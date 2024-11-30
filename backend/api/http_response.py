from typing import Any

from fastapi import HTTPException


def HTTPResponse(status_code: int, message: str = "", data: Any = None):
    if status_code >= 400:
        raise HTTPException(status_code=status_code, detail=message)
    response = {"message": message}
    if data:
        response.update({"body": data})
    return response
