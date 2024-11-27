import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api.routine_controller import RoutineController
from infra.repositories import RoutineRepository

app = FastAPI()


def main():
    load_dotenv()
    routine_repository = RoutineRepository(os.environ.get(
        "MONGO_URI"), os.environ.get("MONGO_DB_NAME"))
    routine_controller = RoutineController(routine_repository)
    app.include_router(routine_controller.router, prefix="/api")
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
