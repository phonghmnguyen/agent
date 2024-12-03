import os
from functools import lru_cache

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import AsyncOpenAI
from pydantic_settings import BaseSettings

from api.controller import WorkoutController, ExerciseController
from api.auth import TokenVerifier
from storage.repository import WorkoutRepository, ExerciseRepository
from agent.assisant import WorkoutAssistantAgent, FuncTool

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
    test_tool = FuncTool("print", "do nothing", lambda: print("hi"), {})
    agent = WorkoutAssistantAgent(tools=[test_tool])
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
