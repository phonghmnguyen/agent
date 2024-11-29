from fastapi import APIRouter
from openai import AsyncOpenAI

from api.http_response import HTTPResponse
from api.schema import Questionnaire, Exercise
from storage.repository import WorkoutRepository, ExerciseRepository
from agent.assisant import WorkoutAssistantAgent


class WorkoutController:
    def __init__(self, repository: WorkoutRepository, assisant_agent: WorkoutAssistantAgent, router: APIRouter = APIRouter()):
        self.router = router
        self.repository = repository
        self.assistant = assisant_agent
        self.register_routes()

    def register_routes(self):
        self.router.post("/workouts")(self.create_workout)
        self.router.get("/workouts")(self.list_workouts)
        self.router.get("/workouts/{workout_id}")(self.get_workout)
        self.router.delete("/workouts/{workout_id}")(self.remove_workout)

    async def create_workout(self, questionnaire: Questionnaire):
        workout_id = await self.assistant.create_workout_from_questionnaire(questionnaire)
        return HTTPResponse(201, "workout created", {
            "id": workout_id
        })

    async def get_workout(self, workout_id: str):
        workout = await self.repository.get(workout_id)
        if not workout:
            return HTTPResponse(404, "workout not found")
        return HTTPResponse(200, "workout retrieved", workout.model_dump())

    async def list_workouts(self):
        workouts = await self.repository.list()
        return HTTPResponse(200, "workouts retrieved", [workout.model_dump() for workout in workouts])

    async def remove_workout(self, workout_id: str):
        removed = await self.repository.remove(workout_id)
        if not removed:
            return HTTPResponse(404, "workout not found")
        return HTTPResponse(204, "workout removed")


class ExerciseController:
    def __init__(self, repository: ExerciseRepository, openai_client: AsyncOpenAI, router: APIRouter = APIRouter()):
        self.router = router
        self.repository = repository
        self.register_routes()
        self.openai_client = openai_client

    def register_routes(self):
        pass

    async def create_exercise(self, exercise: Exercise):
        embed_text = f"{exercise.name} {exercise.description} {' '.join(exercise.muscle_groups)} {exercise.difficulty} {
            ' '.join(exercise.equipment)} {exercise.instructions} {' '.join(exercise.tags)}"
        embedding = await self.openai_client.embeddings.create(
            input=embed_text,
            model="text-embedding-3-small"
        )
        exercise.embedding = embedding
        exercise_id = await self.repository.add(exercise)
        return HTTPResponse(201, "exercise created", {
            "id": exercise_id
        })

    async def get_exercise(self, exercise_id: str):
        exercise = await self.repository.get(exercise_id)
        if not exercise:
            return HTTPResponse(404, "exercise not found")
        return HTTPResponse(200, "exercise retrieved", exercise.model_dump(exclude={"embedding"}))

    async def list_exercises(self):
        exercises = await self.repository.list()
        return HTTPResponse(200, "exercises retrieved", [exercise.model_dump(exclude={"embedding"}) for exercise in exercises])

    async def remove_exercise(self, exercise_id: str):
        removed = await self.repository.remove(exercise_id)
        if not removed:
            return HTTPResponse(404, "exercise not found")
        return HTTPResponse(204, "exercise removed")
