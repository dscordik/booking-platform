from app.database.database import Base
from app.enums.roles_enum import UserRole

from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    login: Mapped[str]
    email: Mapped[str]
    password_hash: Mapped[str]
    first_name: Mapped[str]
    last_name: Mapped[str]
    role: Mapped[UserRole] = mapped_column(default=UserRole.CLIENT)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now())