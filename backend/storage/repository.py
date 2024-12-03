from typing import List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

from schema.model import Workout, Exercise


class WorkoutRepository:
    def __init__(self, mongo_uri: str, db_name: str, collection_name: str):
        self.client = AsyncIOMotorClient(mongo_uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    async def add(self, workout: Workout) -> str:
        workout_dict = workout.model_dump(exclude={"id"})
        result = await self.collection.insert_one(workout_dict)
        return str(result.inserted_id)

    async def get(self, user_id: str) -> Optional[Workout]:
        workout_dict = await self.collection.find_one({"user_id": user_id})
        if workout_dict:
            workout_dict["id"] = str(workout_dict.pop("_id"))
            return Workout(**workout_dict)
        return None

    async def list_all(self) -> List[Workout]:
        workouts = []
        async for workout_dict in self.collection.find():
            workout_dict["id"] = str(workout_dict.pop("_id"))
            workouts.append(Workout(**workout_dict))
        return workouts

    async def remove(self, workout_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(workout_id)})
        return result.deleted_count > 0


class ExerciseRepository:
    def __init__(self, mongo_uri: str, db_name: str, collection_name: str):
        self.client = AsyncIOMotorClient(mongo_uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    async def add(self, exercise: Exercise) -> str:
        exercise_dict = exercise.model_dump(exclude={"id"})
        exercise_dict["_id"] = exercise_dict["name"]
        result = await self.collection.insert_one(exercise_dict)
        return str(result.inserted_id)

    async def get(self, exercise_id: str) -> Optional[Exercise]:
        exercise_dict = await self.collection.find_one({"_id": exercise_id})
        if exercise_dict:
            exercise_dict["id"] = str(exercise_dict.pop("_id"))
            return Exercise(**exercise_dict)
        return None

    async def list_all(self) -> List[Exercise]:
        exercises = []
        async for exercise_dict in self.collection.find():
            exercise_dict["id"] = str(exercise_dict.pop("_id"))
            exercises.append(Exercise(**exercise_dict))
        return exercises

    async def remove(self, exercise_id: str) -> bool:
        result = await self.collection.delete_one({"_id": exercise_id})
        return result.deleted_count > 0
