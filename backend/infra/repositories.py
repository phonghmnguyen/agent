from typing import List, Optional

from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from domain.models import Routine
from domain.repositories import IRoutineRepository


class RoutineRepository(IRoutineRepository):
    def __init__(self, mongo_uri: str, db_name: str):
        self.client = AsyncIOMotorClient(mongo_uri)
        self.db = self.client[db_name]
        self.collection = self.db["routines"]

    async def add(self, routine: Routine) -> str:
        routine_dict = routine.model_dump(exclude={"id"})
        result = await self.collection.insert_one(routine_dict)
        return str(result.inserted_id)

    async def get(self, routine_id: str) -> Optional[Routine]:
        routine_dict = await self.collection.find_one({"_id": ObjectId(routine_id)})
        if routine_dict:
            routine_dict["id"] = str(routine_dict.pop("_id"))
            return Routine(**routine_dict)
        return None

    async def list(self) -> List[Routine]:
        routines = []
        async for routine_dict in self.collection.find():
            routine_dict["id"] = str(routine_dict.pop("_id"))
            routines.append(Routine(**routine_dict))
        return routines

    async def update(self, routine_id: str, routine: Routine) -> bool:
        update_data = routine.model_dump(exclude={"id"})
        result = await self.collection.update_one(
            {"_id": ObjectId(routine_id)}, {"$set": update_data})
        return result.modified_count > 0

    async def remove(self, routine_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(routine_id)})
        return result.deleted_count > 0
