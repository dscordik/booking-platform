from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from starlette import status

from app.deps import get_db, get_current_admin
from app.models import Slot, User, Booking
from app.schemas import SlotOut, SlotCreate

router = APIRouter()

@router.get('/slots', response_model=list[SlotOut])
def get_all_slots(service_id:int = Query(...),date:str | None = Query(None), db:Session = Depends(get_db)):
    if date is None:
        start_date = datetime.utcnow()
        end_date = datetime.utcnow() + timedelta(days=7)
    else:
        start_date = datetime.strptime(date, "%Y-%m-%d")
        end_date =datetime.strptime(date, "%Y-%m-%d") + timedelta(days=1)
    slots = db.query(Slot).options(joinedload(Slot.service)).filter(Slot.service_id == service_id).filter(Slot.start_at >= start_date).filter(Slot.start_at < end_date).all()
    return slots

@router.post('/slots', response_model=SlotOut)
def create_slot(slot_data:SlotCreate,admin:User = Depends(get_current_admin), db:Session = Depends(get_db)):
    slot = slot_data.model_dump()
    if slot_data.end_at <= slot_data.start_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Время окончания должно быть больше начала')
    if slot_data.start_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Нельзя создать слот в прошлом')
    new_slot = Slot(**slot)
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.delete('/slots/{id}')
def delete_current_slot(id:int,admin:User = Depends(get_current_admin), db:Session = Depends(get_db)):
    slot = db.query(Slot).filter(Slot.id == id).first()
    booking = db.query(Booking).filter(Booking.slot_id == id).filter(Booking.status.in_(['pending', 'confirmed'])).first()
    if slot is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Слот не найден')
    if booking:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Нельзя удалить слот с активной бронью')
    db.delete(slot)
    db.commit()
    return {'message': 'Слот удален'}