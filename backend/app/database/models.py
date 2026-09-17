from app.database.database import Base
from app.enums.roles_enum import UserRole

from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey

class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    login: Mapped[str]
    email: Mapped[str]
    password_hash: Mapped[str]
    first_name: Mapped[str]
    last_name: Mapped[str]
    role: Mapped[UserRole] = mapped_column(default=UserRole.CLIENT)
    phone: Mapped[None | str] = mapped_column(default=None)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now())
    #is_Active используется для проверки статуса аккаунта. False - аккаунт деактивирован, заблокирован.
    is_active: Mapped[bool] = mapped_column(default=True)

class Service(Base):
    __tablename__ = 'service'

    id: Mapped[int] = mapped_column(primary_key=True)
    master_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    title: Mapped[str]
    description: Mapped[str]
    duration_minutes: Mapped[int]
    price: Mapped[int]
    #is_active показывает, доступен ли сервис для бронирования в данный момент
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now())