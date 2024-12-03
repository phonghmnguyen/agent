import json
from typing import List, Dict, Callable, TypeVar, Generic
from dataclasses import dataclass

from haystack.dataclasses import ChatMessage
from haystack.components.generators.chat import OpenAIChatGenerator

from schema.model import Questionnaire, Workout


T = TypeVar("T")


@dataclass
class FuncTool(Generic[T]):
    name: str
    desc: str
    func: Callable[..., T]
    params: Dict


class WorkoutAssistantAgent:
    tool_mapping: Dict[str, Callable]
    tool_schema: List[Dict]
    llm: OpenAIChatGenerator

    def __init__(self, tools: List[FuncTool]):
        self.tool_mapping = {
            tool.name: tool.func for tool in tools
        }
        self.tool_schema = [{
            "type": "function",
            "function": {
                "name": tool.name,
                "description": tool.desc,
                "parameters": tool.params,
            }
        }
            for tool in tools]

        self.instructions = ChatMessage.from_system("""
            You are an ... (need some prompt engineering here)
        """)
        self.llm = OpenAIChatGenerator()

    def chat(self, message: str, memory: List[ChatMessage]) -> ChatMessage:
        holistic_view = [self.instructions, *
                         memory, ChatMessage.from_user(message)]
        response = self.llm.run(messages=holistic_view, generation_kwargs={
                                "tools": self.tool_schema})

        turn = 2
        while response and response["replies"][0].meta["finish_reason"] == "tool_calls" and turn != 0:
            print(response["replies"][0])
            func_calls = json.loads(response["replies"][0].content)
            for func_call in func_calls:
                func_name = func_call["function"]["name"]
                func_args = json.loads(func_call["function"]["arguments"])
                func_response = self.tool_mapping[func_name](**func_args)
                holistic_view.append(ChatMessage.from_function(
                    content=json.dumps(func_response), name=func_name))
                response = self.llm.run(messages=holistic_view, generation_kwargs={
                    "tools": self.tool_schema})
                turn -= 1
                


        return response["replies"][0] if response else ChatMessage.from_assistant("Failed to generate answer")

    async def plan_workout_from_questionnaire(self, user_id: str, questionnaire: Questionnaire) -> str:
        # message = f"""
        # I need you to create a workout plan for user {user_id} based on this questionnaire. You need to query the exercise database for a list of matching exercises and add it to the workout database. You must return the id of the workout plan you created.
        # Questionnaire: {questionnaire.model_dump()}
        # """
        message = f"""
        I need you to create a workout plan for user {user_id} based on this questionnaire. You need to query the exercise database for a list of matching exercises and return it.
        Questionnaire: {questionnaire.model_dump()}
        """
        workout_id = self.chat(message, []).content
        return workout_id
        
