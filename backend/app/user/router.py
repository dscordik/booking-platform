from fastapi import APIRouter, Depends

from app.enums.roles_enum import UserRole
from app.user.dependencies import require_admin
from app.database.models import User
from app.user import service as user_service
from app.auth.dependencies import get_db
from app.auth.schemas import RegistrationResponse
from app.user.schemas import ChangeRoleRequest

from sqlalchemy.orm import Session

router = APIRouter()


@router.patch('/{user_id}/role', response_model=RegistrationResponse)
def change_user_role(user_id: int, role: ChangeRoleRequest, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    return user_service.change_user_role(db, user_id, role)