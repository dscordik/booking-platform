from typing import Literal, Optional
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

class ServiceCreate(BaseModel):
    title:str
    description:Optional[str] = None
    duration_min:int
    price:int

class ServiceUpdate(BaseModel):
    title:Optional[str] = None
    description:Optional[str] = None
    duration_min:Optional[int] = None
    price:Optional[int] = None

class ServiceOut(BaseModel):
    id:int
    title:str
    description:Optional[str] = None
    duration_min:int
    price:int
    is_active:bool
    created_at:datetime

    model_config = ConfigDict(from_attributes=True)