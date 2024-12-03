from typing import Optional

from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from openai import AsyncOpenAI, OpenAIError

from api.http_response import HTTPResponse
from api.auth import TokenVerifier
from schema.model import Questionnaire, Exercise
from storage.repository import WorkoutRepository, ExerciseRepository
from agent.assisant import WorkoutAssistantAgent


class WorkoutController:
    def __init__(self,
                 repository: WorkoutRepository,
                 assisant_agent: WorkoutAssistantAgent,
                 token_verifier: TokenVerifier,
                 router: APIRouter = APIRouter()
                 ):
        self.router = router
        self.repository = repository
        self.assistant = assisant_agent,
        self.token_verifier = token_verifier
        self.register_routes()

    def register_routes(self):
        self.router.post("/workouts")(self.create_workout)
        self.router.get("/workouts")(self.list_all_workouts)
        self.router.get("/workouts/{workout_id}")(self.get_workout)
        self.router.delete("/workouts/{workout_id}")(self.remove_workout)

    async def create_workout(self, questionnaire: Questionnaire, token: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer())):
        user_id = await self.token_verifier.verify(token)
        workout_id = await self.assistant.plan_workout_from_questionnaire(user_id, questionnaire)
        return HTTPResponse(201,  {"id": workout_id})

    async def get_workout(self, token: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer())):
        user_id = await self.token_verifier.verify(token)
        workout = await self.repository.get(user_id)
        if not workout:
            return HTTPResponse(404)
        return HTTPResponse(200, workout.model_dump())

    async def list_all_workouts(self):
        workouts = await self.repository.list_all()
        return HTTPResponse(200, [workout.model_dump() for workout in workouts])

    async def remove_workout(self, workout_id: str):
        removed = await self.repository.remove(workout_id)
        if not removed:
            return HTTPResponse(404)
        return HTTPResponse(204)


class ExerciseController:
    def __init__(self,
                 repository: ExerciseRepository,
                 openai_client: AsyncOpenAI,
                 router: APIRouter = APIRouter()
                 ):
        self.router = router
        self.repository = repository
        self.openai_client = openai_client
        self.register_routes()

    def register_routes(self):
        self.router.post("/exercises")(self.create_exercise)
        self.router.get("/exercises")(self.list_all_exercises)
        self.router.get("/exercises/{exercise_id}")(self.get_exercise)
        self.router.delete("/exercises/{exercise_id}")(self.remove_exercise)

    async def create_exercise(self, exercise: Exercise):
        embed_text = f"{exercise.name} {exercise.description} {' '.join(exercise.muscle_groups)} {exercise.difficulty} {
            ' '.join(exercise.equipment)} {exercise.instructions} {' '.join(exercise.tags)}"
        try:
            embedding = await self.openai_client.embeddings.create(
                input=embed_text,
                model="text-embedding-3-small"
            )
        except OpenAIError:
            return HTTPResponse(503)

        exercise.embedding = embedding.data[0].embedding
        exercise_id = await self.repository.add(exercise)
        return HTTPResponse(201, {"id": exercise_id})

    async def get_exercise(self, exercise_id: str):
        exercise = await self.repository.get(exercise_id)
        if not exercise:
            return HTTPResponse(404)
        return HTTPResponse(200, exercise.model_dump(exclude={"embedding"}))

    async def list_all_exercises(self):
        exercises = await self.repository.list_all()
        return HTTPResponse(200, [exercise.model_dump(exclude={"embedding"}) for exercise in exercises])

    async def remove_exercise(self, exercise_id: str):
        removed = await self.repository.remove(exercise_id)
        if not removed:
            return HTTPResponse(404)
        return HTTPResponse(204)
