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
            You are an AI fitness assistant equipped with specialized tools to plan, create, and update workouts, as well as provide fitness-related advice tailored to user needs.
        """)
        self.llm = OpenAIChatGenerator()

    async def chat(self, message: str, memory: List[ChatMessage]) -> ChatMessage:
        holistic_view = [self.instructions, *
                         memory, ChatMessage.from_user(message)]
        response = self.llm.run(messages=holistic_view, generation_kwargs={
                                "tools": self.tool_schema})

        turn=3
        while response and response["replies"][0].meta["finish_reason"] == "tool_calls" and turn != 0:
            print(f"TURN {turn}")
            print(response["replies"][0])
            func_calls = json.loads(response["replies"][0].content)
            for func_call in func_calls:
                func_name = func_call["function"]["name"]
                func_args = json.loads(func_call["function"]["arguments"])
                if func_name[:5] == "async":
                    func_response = await self.tool_mapping[func_name](**func_args)
                else:
                    func_response = self.tool_mapping[func_name](**func_args)

                print(func_response)
                holistic_view.append(ChatMessage.from_function(
                    content=json.dumps(func_response), name=func_name))
                response = self.llm.run(messages=holistic_view, generation_kwargs={
                    "tools": self.tool_schema})
            turn -= 1
                
        

        return response["replies"][0] if response else ChatMessage.from_assistant("Failed to generate answer")

    async def plan_workout_from_questionnaire(self, user_id: str, questionnaire: Questionnaire) -> str:
        message = f"""
        Create a personalized workout plan for user {user_id} based on the provided questionnaire. Query the exercise database once to fetch matching exercises, design the workout plan, and add it to the workout database once.
        Once the workout is successfully created, exit immediately without making any further function calls.
        Questionnaire: {questionnaire.model_dump()}
        """
       
        response = await self.chat(message, [])
        return response.content
        
