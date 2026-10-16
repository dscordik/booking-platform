from typing import Literal
from pydantic import BaseModel, ConfigDict
from datetime import datetime

UserRole = Literal['user', 'admin']

class UserCreate(BaseModel):
    email:str
    password:str
    first_name:str | None = None

class UserOut(BaseModel):
    id:int
    email:str
    first_name:str | None = None
    role:str
    created_at:datetime

    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email:str
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str