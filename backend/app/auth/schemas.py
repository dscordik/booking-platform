from pydantic import BaseModel
from datetime import datetime

class RegistrationRequest(BaseModel):
    login: str
    email: str
    password: str
    first_name: str
    last_name: str

class LoginRequest(BaseModel):
    login: str
    password: str

class TokenResponse(BaseModel):
    model_config = {"from_attributes": True}

    access_token: str
    token_type: str = 'bearer'

class RegistrationResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    login: str
    email: str
    first_name: str
    last_name: str
    created_at: datetime