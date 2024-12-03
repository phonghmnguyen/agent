from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from pydantic_settings import BaseSettings
from haystack.utils import Secret

from api.controller import WorkoutController, ExerciseController
from api.auth import TokenVerifier
from storage.repository import WorkoutRepository, ExerciseRepository
from agent.assisant import WorkoutAssistantAgent, FuncTool
from agent.pipeline import MongoDBRetrievalPipeline, MongoDBAtlasDocumentStore
from schema.model import Workout, ExerciseInWorkout


app = FastAPI()


class Settings(BaseSettings):
    mongo_uri: str
    mongo_db_name: str
    openai_key: str
    auth0_domain: str
    auth0_api_audience: str
    auth0_issuer: str
    auth0_algorithms: str

    class Config:
        env_file = ".env"


def main():
    settings = Settings()
    mongo_uri, mongo_db_name = settings.mongo_uri, settings.mongo_db_name
    openai_async_client = AsyncOpenAI()
    token_verifier = TokenVerifier(
        settings.auth0_domain,
        settings.auth0_api_audience,
        settings.auth0_issuer,
        settings.auth0_algorithms
    )
    workout_repository = WorkoutRepository(
        mongo_uri, mongo_db_name, "workouts")
    exercise_rag = MongoDBRetrievalPipeline(store=MongoDBAtlasDocumentStore(
        mongo_connection_string=Secret.from_token(mongo_uri),
        database_name=mongo_db_name,
        collection_name="exercises",
        vector_search_index="vector_search"
        ))
    query_exercise_tool = FuncTool(
        name="query_exercise",
        desc="use this function to semantically search the exercise database for a list of matching exercises with a query",
        func=exercise_rag.query,
        params={
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                },
                "required": ["query"],
                "additionalProperties": False,
            },
    )
    async def add_workout(user_id, exercises, estimated_duration, target_muscle_groups, total_calories_burned):
        workout = Workout(
            user_id=user_id,
            exercises=[ExerciseInWorkout(**e) for e in exercises],
            estimated_duration=estimated_duration,
            target_muscle_groups=target_muscle_groups,
            total_calories_burned=total_calories_burned,
        )
        workout_id = await workout_repository.add(workout=workout)
        return True
    
    add_workout_tool = FuncTool(
        name="async_add_workout",
        desc="use this function to add a workout to the workout database. it will return true if successfully the workout is successfully added",
        func=add_workout,
        params=Workout.model_json_schema()
    )


    agent = WorkoutAssistantAgent(tools=[query_exercise_tool, add_workout_tool])
    workout_controller = WorkoutController(
        workout_repository, agent, token_verifier)
    exercise_repository = ExerciseRepository(
        mongo_uri, mongo_db_name, "exercises")
    exercise_controller = ExerciseController(
        exercise_repository, openai_async_client)
    app.include_router(workout_controller.router, prefix="/api")
    app.include_router(exercise_controller.router, prefix="/api")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


if __name__ == "__main__":
    main()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
