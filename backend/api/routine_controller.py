from fastapi import APIRouter

from api.http_response import HTTPResponse
from domain.repositories import IRoutineRepository
from domain.models import Routine, Questionnaire


class RoutineController:
    """
    Controller class for handling HTTP requests related to workout routines.

    This class provides methods for creating, retrieving, updating, and deleting
    workout routines, as well as listing all routines.
    """

    def __init__(self, repository: IRoutineRepository, router: APIRouter = APIRouter()):
        """
        Initialize the RoutineController.

        Args:
            repository (RoutineRepository): The repository for routine data operations.
            router (APIRouter, optional): The FastAPI router to register routes.
        """
        self.router = router
        self.repository = repository
        self.register_routes()

    def register_routes(self):
        """Register all routes for routine operations with the FastAPI router."""
        self.router.post("/routines")(self.create_routine_from_questionnaire)
        self.router.get("/routines")(self.list_routines)
        self.router.get("/routines/{routine_id}")(self.get_routine)
        self.router.put("/routines/{routine_id}")(self.update_routine)
        self.router.delete("/routines/{routine_id}")(self.remove_routine)

    async def create_routine(self, routine: Routine):
        """
        Create a new workout routine.

        Args:
            routine (Routine): The routine data to be created.

        Returns:
            HTTPResponse
        """
        routine_id = await self.repository.add(routine)
        return HTTPResponse(201, "Routine is successfully created", {
            "id": routine_id
        })

    async def create_routine_from_questionnaire(self, questionnaire: Questionnaire):
        """
        Create a new workout routine from a questionnaire

        Args:
            questionnaire (Questionnaire): The questionnaire that will be used to create the new routine.

        Returns:
            HTTPResponse
        """
        print("HELLO")

    async def get_routine(self, routine_id: str):
        """
        Retrieve a specific workout routine by ID.

        Args:
            routine_id (str): The ID of the routine to retrieve.

        Returns:
            HTTPResponse
        """
        routine = await self.repository.get(routine_id)
        if not routine:
            return HTTPResponse(404, "Routine with this ID is not found")
        return HTTPResponse(200, "Routine is successfully retrieved", routine.model_dump())

    async def list_routines(self):
        """
        Retrieve a list of all workout routines.

        Returns:
            HTTPResponse
        """
        routines = await self.repository.list()
        return HTTPResponse(200, "Successfully list all routines", [routine.model_dump() for routine in routines])

    async def update_routine(self, routine_id: str, routine: Routine):
        """
        Update an existing workout routine.

        Args:
            routine_id (str): The ID of the routine to update.
            routine (Routine): The updated routine data.

        Returns:
            HTTPResponse
        """
        updated = await self.repository.update(routine_id, routine)
        if not updated:
            return HTTPResponse(404, "Routine with this id is not found for update")
        return HTTPResponse(200, "Routine is successfully updated")

    async def remove_routine(self, routine_id: str):
        """
        Remove a specific workout routine by ID.

        Args:
            routine_id (str): The ID of the routine to remove.

        Returns:
            HTTPResponse
        """
        removed = await self.repository.remove(routine_id)
        if not removed:
            return HTTPResponse(404, "Routine with this ID is not found for removal")
        return HTTPResponse(204, "Routine is successfully removed")
