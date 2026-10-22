from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from starlette import status
from app.deps import get_current_user, get_db, get_current_admin
from app.models import User, Booking, Slot
from app.schemas import BookingOut, BookingCreate, BookingAdmin, BookingStatus, BookingStatusUpdate

router = APIRouter()

@router.post('/bookings', response_model=BookingOut)
def create_booking(booking_data:BookingCreate,user:User = Depends(get_current_user), db:Session = Depends(get_db)):
    slot = db.query(Slot).filter(Slot.id == booking_data.slot_id).with_for_update().first()
    if slot is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Слот не найден')
    if slot.start_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Нельзя забронировать слот в прошлом')
    if slot.is_booked:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Слот уже занят')
    slot.is_booked = True
    new_booking = Booking(
        user_id=user.id,
        slot_id=slot.id,
        status='pending',
        comment=booking_data.comment
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@router.get('/bookings/me', response_model=list[BookingOut])
def get_my_bookings(user:User = Depends(get_current_user), db:Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.user_id == user.id).join(Slot).order_by(Slot.start_at).all()
    return bookings

@router.patch('/bookings/{id}/cancel', response_model=BookingOut)
def cancel_bookings(id:int,user = Depends(get_current_user), db:Session = Depends(get_db)):
    current_booking = db.query(Booking).filter(Booking.id == id).first()
    if current_booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Брони не существует')
    if current_booking.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Нельзя отменить чужую бронь')
    if current_booking.status in ['cancelled', 'done']:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Нельзя отменить уже отменённую или завершённую бронь')
    slot = db.query(Slot).filter(Slot.id == current_booking.slot_id).with_for_update().first()
    if slot is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Слот не найден')
    if slot.start_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Нельзя забронировать слот в прошлом')
    current_booking.status = "cancelled"
    slot.is_booked = False
    db.commit()
    return current_booking

@router.get('/bookings', response_model=list[BookingAdmin])
def get_all_bookings(status_filter:BookingStatus | None = Query(default=None, alias='status'), service_id:int | None = None,admin:User = Depends(get_current_admin) , db:Session = Depends(get_db)):
    res = db.query(Booking).join(Slot).options(joinedload(Booking.user), joinedload(Booking.slot))
    if status_filter is not None:
        res = res.filter(Booking.status == status_filter)
    if service_id is not None:
        res = res.filter(Slot.service_id == service_id)
    res = res.order_by(Booking.created_at.desc())
    return res.all()

@router.patch('/bookings/{id}/admin-status', response_model=BookingAdmin)
def update_admin_status(id:int, body:BookingStatusUpdate, admin:User = Depends(get_current_admin) , db:Session = Depends(get_db)):
    booking = db.query(Booking).options(joinedload(Booking.user), joinedload(Booking.slot)).filter(Booking.id == id).first()
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Брони нет')
    if body.status == 'cancelled' and booking.status != 'cancelled':
        booking.slot.is_booked = False
    booking.status = body.status
    db.commit()
    db.refresh(booking)
    return booking