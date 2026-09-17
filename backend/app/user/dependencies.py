from app.database.models import User
from app.auth.dependencies import get_current_user
from app.enums.roles_enum import UserRole

from fastapi import Depends, HTTPException

#Проверка, является ли пользователь администратором.
def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail='Admin access required'
        )

    return require_admin