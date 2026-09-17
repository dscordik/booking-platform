from pydantic import BaseModel, field_validator, Field
from datetime import datetime

from app.enums.roles_enum import UserRole

class RegistrationRequest(BaseModel):
    login: str
    email: str
    password: str
    first_name: str
    last_name: str
    role: UserRole = Field(UserRole.CLIENT)
    phone: str | None = Field(None, max_length=15)

    @field_validator('role')
    @classmethod
    def validate_role(cls, value):
        if value == UserRole.ADMIN:
            raise ValueError('Admin role cannot be selected during registration')
        return value

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
    role: UserRole
    phone: str
    created_at: datetime