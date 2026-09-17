from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.auth.dependencies import get_db
from app.resources.schemas import CreateServiceRequest
from app.resources.dependencies import require_master
from app.database.models import User
from app.resources import service as resources_service

router = APIRouter()

@router.post('/resources/createservice')
def create_service(service: CreateServiceRequest, db: Session = Depends(get_db), current_user: User = Depends(require_master)):
    return resources_service.create_service(db, current_user, service)