from typing import Optional

import jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

class UnauthorizedException(HTTPException):
    def __init__(self, detail: str, **kwargs):
        """Returns HTTP 403"""
        super().__init__(status.HTTP_403_FORBIDDEN, detail=detail)

class UnauthenticatedException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Requires authentication"
        )


class TokenVerifier:
    def __init__(self, auth0_domain: str, auth0_api_audience: str, auth0_issuer: str, auth0_algo: str):
        jwks_url = f'https://{auth0_domain}/.well-known/jwks.json'
        self.jwks_client = jwt.PyJWKClient(jwks_url)
        self.auth0_api_audience = auth0_api_audience
        self.auth0_issuer = auth0_issuer
        self.auth0_algo = auth0_algo

    async def verify(self, token: Optional[HTTPAuthorizationCredentials]) -> str:
        if not token:
            raise UnauthenticatedException
    
        try:
            signing_key = self.jwks_client.get_signing_key_from_jwt(token.credentials).key
        except (jwt.exceptions.PyJWKClientError, jwt.exceptions.DecodeError) as err:
            raise UnauthorizedException(str(err))
        
        try:
            payload = jwt.decode(
                token.credentials,
                signing_key,
                algorithms=self.auth0_algo,
                audience=self.auth0_api_audience,
                issuer= self.auth0_issuer
            )
        except jwt.exceptions.PyJWTError as err:
            raise UnauthorizedException(str(err))
            
        return payload['sub']
        

