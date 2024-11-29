import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api.controller import WorkoutController
from storage.repository import WorkoutRepository

app = FastAPI()


def main():
    load_dotenv()
    workout_repository = WorkoutRepository(os.environ.get(
        "MONGO_URI"), os.environ.get("MONGO_DB_NAME"), "workouts")
    workout_controller = WorkoutController(workout_repository)
    app.include_router(workout_controller.router, prefix="/api")
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
