from abc import ABC, abstractmethod
from typing import List, Optional


from domain.models import Routine


class IRoutineRepository(ABC):
    """
    Interface for the Workout Routine repository, defining the methods for data operations.
    """
    @abstractmethod
    async def add(self, routine: Routine) -> str:
        """
        Add a new workout routine and return its ID.

        Args:
            routine (Routine): The workout routine to create.

        Returns:
            str: The ID of the created workout routine.
        """
        pass

    @abstractmethod
    async def get(self, routine_id: str) -> Optional[Routine]:
        """
        Retrieve a workout routine by its ID.

        Args:
            routine_id (str): The ID of the routine to retrieve.

        Returns:
            Optional[Routine]: The retrieved workout routine, or None if not found.
        """
        pass

    @abstractmethod
    async def list(self) -> List[Routine]:
        """
        List all workout routines.

        Returns:
            List[Routine]: A list of all workout routines. 
                                 This list may be empty if no routines are available.
       """
        pass

    @abstractmethod
    async def update(self, routine_id: str, routine: Routine) -> bool:
        """
        Update a workout routine by its ID and return success status.

        Args:
            routine_id (str): The ID of the routine to update.
            routine (Routine): The updated workout routine object containing the new data.

        Returns:
            bool: True if the removal was successful, False otherwise.
        """
        pass

    @abstractmethod
    async def remove(self, routine_id: str) -> bool:
        """
        Remove a workout routine by its ID and return success status.

        Args:
            routine_id (str): The ID of the routine to remove.

        Returns:
            bool: True if the removal was successful, False otherwise.
        """
