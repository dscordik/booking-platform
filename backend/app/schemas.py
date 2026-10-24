from typing import Literal, Optional, Any
from pydantic import BaseModel, ConfigDict, computed_field, Field
from datetime import datetime

UserRole = Literal['user', 'admin']
BookingStatus = Literal['pending', 'confirmed', 'cancelled', 'done']

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
    telegram_id:int | None = None

    model_config = ConfigDict(from_attributes=True)

class TelegramLinkCodeOut(BaseModel):
    code:str
    deep_link:str

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

class SlotCreate(BaseModel):
    service_id:int
    start_at:datetime
    end_at:datetime

class SlotOut(BaseModel):
    id:int
    service_id: int
    start_at: datetime
    end_at: datetime
    is_booked:bool
    service: Any = Field(default=None, exclude=True)
    @computed_field
    @property
    def service_title(self)->str:
        return self.service.title if self.service else "Услуга не найдена"

    model_config = ConfigDict(from_attributes=True)

class BookingCreate(BaseModel):
    slot_id:int
    comment:Optional[str] = None

class BookingOut(BaseModel):
    id:int
    slot_id: int
    status: str
    comment: Optional[str] = None
    created_at: datetime
    slot:SlotOut

    model_config = ConfigDict(from_attributes=True)

class BookingStatusUpdate(BaseModel):
    status:BookingStatus

class BookingAdmin(BookingOut):
    user:Any = Field(default=None,exclude=True)

    @computed_field
    @property
    def user_email(self) -> str:
        return self.user.email if self.user else 'Пользователь не найден'