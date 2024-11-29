from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional

from api.payload_schema import Workout


class WorkoutRepository:
    def __init__(self, mongo_uri: str, db_name: str):
        self.client = AsyncIOMotorClient(mongo_uri)
        self.db = self.client[db_name]
        self.collection = self.db["routines"]

    async def add(self, routine: Workout) -> str:
        routine_dict = routine.model_dump(exclude={"id"})
        result = await self.collection.insert_one(routine_dict)
        return str(result.inserted_id)

    async def get(self, routine_id: str) -> Optional[Workout]:
        routine_dict = await self.collection.find_one({"_id": ObjectId(routine_id)})
        if routine_dict:
            routine_dict["id"] = str(routine_dict.pop("_id"))
            return Workout(**routine_dict)
        return None

    async def list(self) -> List[Workout]:
        routines = []
        async for routine_dict in self.collection.find():
            routine_dict["id"] = str(routine_dict.pop("_id"))
            routines.append(Workout(**routine_dict))
        return routines

    async def update(self, routine_id: str, routine: Workout) -> bool:
        update_data = routine.model_dump(exclude={"id"})
        result = await self.collection.update_one(
            {"_id": ObjectId(routine_id)}, {"$set": update_data})
        return result.modified_count > 0

    async def remove(self, routine_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(routine_id)})
        return result.deleted_count > 0
