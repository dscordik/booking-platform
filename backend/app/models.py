from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    email:Mapped[str] = mapped_column(String, unique=True ,nullable=False, index=True)
    hashed_password:Mapped[str] = mapped_column(String, nullable=False)
    first_name:Mapped[str | None] = mapped_column(String, nullable=True)
    role:Mapped[str] = mapped_column(String, default='user', nullable=False)
    created_at:Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())