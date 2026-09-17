from fastapi import Depends, HTTPException

from app.database.models import User
from app.auth.dependencies import get_current_user
from app.enums.roles_enum import UserRole

def require_master(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.MASTER:
        raise HTTPException(
            status_code=403,
            detail='Master access required'
        )
    return current_user