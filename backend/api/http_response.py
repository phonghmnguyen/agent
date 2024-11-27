from typing import Any

from fastapi import HTTPException


def HTTPResponse(status_code: int, message: str, data: Any = None):
    """
    Centralizes HTTP response creation and error handling.

    Args:
        status_code (int): The HTTP status code to return.
        message (str): A message to include in the response.
        data (Optional[Dict]): Additional data to include in the response.

    Raises:
        HTTPException: If the status code indicates an error (4xx or 5xx).

    Returns:
        dict: The response body.
    """
    if status_code >= 400:
        raise HTTPException(status_code=status_code, detail=message)
    response = {"message": message}
    if data:
        response.update({"body": data})
    return response
