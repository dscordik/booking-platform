from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from app.deps import get_db, get_current_admin
from app.models import Service, User
from app.schemas import ServiceOut, ServiceCreate, ServiceUpdate

router = APIRouter()

@router.get('/', response_model=list[ServiceOut])
def get_services(db:Session = Depends(get_db)):
    services = db.query(Service).filter(Service.is_active == True).order_by(Service.id).all()
    return services

@router.get('/{service_id}', response_model=ServiceOut)
def get_current_service(service_id:int, db:Session = Depends(get_db)):
    current_service = db.query(Service).filter(Service.id == service_id).first()
    if current_service is None or not current_service.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Такой услуги не существует')
    return current_service

@router.post('/', response_model=ServiceOut)
def create_service(service_data:ServiceCreate,admin:User = Depends(get_current_admin), db:Session = Depends(get_db)):
    service = service_data.model_dump()
    new_service = Service(**service)
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.patch('/{service_id}', response_model=ServiceOut)
def update_service(service_id:int, service_update:ServiceUpdate, admin:User = Depends(get_current_admin), db:Session = Depends(get_db)):
    current_service = db.query(Service).filter(Service.id == service_id).first()
    if current_service is None or not current_service.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Такой услуги не существует')
    services = service_update.model_dump(exclude_unset=True)
    for key, value in services.items():
        setattr(current_service, key, value)
    db.commit()
    db.refresh(current_service)
    return current_service

@router.delete('/{service_id}')
def delete_current_service(service_id:int, admin:User = Depends(get_current_admin), db:Session = Depends(get_db)):
    current_service = db.query(Service).filter(Service.id == service_id).first()
    if current_service is None or not current_service.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Такой услуги не существует')
    current_service.is_active = False
    db.commit()
    return {'message': 'Услуга успешно удалена'}