from fastapi import APIRouter

from api.http_response import HTTPResponse
from api.payload_schema import Workout, Questionnaire
from storage.repository import WorkoutRepository


class WorkoutController:
    def __init__(self, repository: WorkoutRepository, router: APIRouter = APIRouter()):
        self.router = router
        self.repository = repository
        self.register_routes()

    def register_routes(self):
        self.router.post("/routines")(self.create_routine_from_questionnaire)
        self.router.get("/routines")(self.list_routines)
        self.router.get("/routines/{routine_id}")(self.get_routine)
        self.router.put("/routines/{routine_id}")(self.update_routine)
        self.router.delete("/routines/{routine_id}")(self.remove_routine)

    async def create_workout(self, questionnaire: Questionnaire):
        pass

    async def get_routine(self, routine_id: str):
        routine = await self.repository.get(routine_id)
        if not routine:
            return HTTPResponse(404, "Routine with this ID is not found")
        return HTTPResponse(200, "Routine is successfully retrieved", routine.model_dump())

    async def list_routines(self):
        routines = await self.repository.list()
        return HTTPResponse(200, "Successfully list all routines", [routine.model_dump() for routine in routines])

    async def update_routine(self, routine_id: str, routine: Routine):
        updated = await self.repository.update(routine_id, routine)
        if not updated:
            return HTTPResponse(404, "Routine with this id is not found for update")
        return HTTPResponse(200, "Routine is successfully updated")

    async def remove_routine(self, routine_id: str):
        removed = await self.repository.remove(routine_id)
        if not removed:
            return HTTPResponse(404, "Routine with this ID is not found for removal")
        return HTTPResponse(204, "Routine is successfully removed")
