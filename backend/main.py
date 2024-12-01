import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import AsyncOpenAI

from api.controller import WorkoutController, ExerciseController
from storage.repository import WorkoutRepository, ExerciseRepository
from agent.assisant import WorkoutAssistantAgent

app = FastAPI()


def main():
    load_dotenv()
    mongo_uri, mongo_db_name = os.environ.get(
        "MONGO_URI"), os.environ.get("MONGO_DB_NAME")
    openai_async_client = AsyncOpenAI()
    workout_repository = WorkoutRepository(
        mongo_uri, mongo_db_name, "workouts")
    agent = WorkoutAssistantAgent(tools=[])
    workout_controller = WorkoutController(
        workout_repository, assisant_agent=agent)
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
