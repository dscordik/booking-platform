from sqlalchemy.orm import Session

from app.database.models import User, Service
from app.resources import repository as resources_repository

from fastapi import HTTPException

def create_service(db: Session, current_user: User, service: Service):
    service = resources_repository.get_service_by_parametres(db, service.title, service.description,
service.duration_minutes, service.price)
    if service:
        raise HTTPException(
            status_code=400,
            detail='Service is already exists'
        )
    service = resources_repository.create_service(db, current_user.id,
service.title, service.description, service.duration_minutes, service.price)

    db.commit()
    db.refresh(service)

    return service