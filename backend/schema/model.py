from typing import List, Optional
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field,  HttpUrl
from pydantic.json_schema import SkipJsonSchema


class Exercise(BaseModel):
    id: SkipJsonSchema[str] = ""
    name: str
    description: str
    muscle_groups: List[str] = Field(default_factory=list)
    difficulty: str = Field(
        default="beginner", description="Difficulty level of the exercise")
    equipments: List[str] = Field(
        default_factory=list, description="Equipments needed for the exercise")
    instructions: str = Field(
        default_factory=list, description="Step-by-step instructions")
    video_url: str = Field(
        default=None, description="URL to a demonstration video")
    tags: List[str] = Field(default_factory=list,
                            description="Tags for categorization")
    embedding: SkipJsonSchema[List[float]] = []
    content: SkipJsonSchema[str] = ""


class ExerciseInWorkout(BaseModel):
    exercise_name: str
    day: str
    duration: Optional[int] = Field(
        default=None, description="Duration of the exercise in seconds")
    repetitions: Optional[int] = Field(
        default=None, description="Number of repetitions")
    sets: Optional[int] = Field(default=None, description="Number of sets")
    rest_between_sets: Optional[int] = Field(
        default=None, description="Rest time between sets in seconds")
    estimated_calories_burned: float = Field(
        default=None, description="Estimated calories burned per minute")
    notes: Optional[str] = Field(
        default=None, description="Specific notes for this exercise in this routine")


class Workout(BaseModel):
    id: SkipJsonSchema[str] = ""
    user_id: str = Field(
        default=None, description="ID of the user this workout is for")
    exercises: List[ExerciseInWorkout]
    estimated_duration: int = Field(
        default=None, description="Estimated duration of the workout in minutes")
    target_muscle_groups: List[str] = Field(
        default_factory=list, description="Main muscle groups targeted")
    total_calories_burned: int = Field(
        default=None, description="Estimated total calories burned")
    

class Questionnaire(BaseModel):
    class Frequency(str, Enum):
        DAILY = "daily"
        WEEKLY = "weekly"
        BIWEEKLY = "biweekly"
        OCCASIONALLY = "occasionally"

    class FitnessGoal(str, Enum):
        WEIGHT_LOSS = "weight loss"
        MUSCLE_GAIN = "muscle gain"
        STAYING_FIT = "staying fit"
        ENDURANCE = "endurance"

    class WorkoutLocation(str, Enum):
        HOME = "home"
        GYM = "gym"
        OUTDOORS = "outdoors"

    class ExperienceLevel(str, Enum):
        BEGINNER = "beginner"
        INTERMEDIATE = "intermediate"
        ADVANCED = "advanced"

    frequency: Frequency
    fitness_goal: FitnessGoal
    workout_location: WorkoutLocation
    space_constraint: int = Field(..., ge=0, le=10)
    has_equipment: bool
    experience_level: ExperienceLevel
    workout_duration: int = Field(..., gt=0)
