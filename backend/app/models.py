from sqlalchemy import DateTime, Integer, String, func, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class User(Base):
    __tablename__ = 'users'

    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    email:Mapped[str] = mapped_column(String, unique=True ,nullable=False, index=True)
    hashed_password:Mapped[str] = mapped_column(String, nullable=False)
    first_name:Mapped[str | None] = mapped_column(String, nullable=True)
    role:Mapped[str] = mapped_column(String, default='user', nullable=False)
    created_at:Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    telegram_id:Mapped[int] = mapped_column(Integer, nullable=True, unique=True)
    telegram_link_code:Mapped[str] = mapped_column(String, nullable=True, unique=True)

class Service(Base):
    __tablename__ = 'services'

    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    title:Mapped[str] = mapped_column(String, nullable=False)
    description:Mapped[str] = mapped_column(Text, nullable=True)
    duration_min:Mapped[int] = mapped_column(Integer, nullable=False)
    price:Mapped[int] = mapped_column(Integer, nullable=False)
    is_active:Mapped[bool] = mapped_column(Boolean, default=True)
    created_at:Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    slots = relationship("Slot", back_populates="service")

class Slot(Base):
    __tablename__ = 'slots'

    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    service_id:Mapped[int] = mapped_column(Integer, ForeignKey('services.id'))
    start_at:Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    end_at:Mapped[DateTime] = mapped_column(DateTime,nullable=False)
    is_booked:Mapped[bool] = mapped_column(Boolean, default=False)
    service = relationship("Service", back_populates="slots")

class Booking(Base):
    __tablename__ = 'bookings'

    id:Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id:Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    slot_id:Mapped[int] = mapped_column(Integer, ForeignKey('slots.id'))
    status:Mapped[str] = mapped_column(String, default='pending')
    comment:Mapped[str] = mapped_column(String, nullable=True)
    created_at:Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    user = relationship('User')
    slot = relationship('Slot')