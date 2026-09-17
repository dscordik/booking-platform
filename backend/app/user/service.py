from sqlalchemy.orm import Session

from app.enums.roles_enum import UserRole
from app.user import repository as user_repository

from fastapi import HTTPException

def change_user_role(db: Session, user_id: int, new_role: UserRole):
    user = user_repository.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=401,
            detail='User not found'
        )

    user_with_changed_role = user_repository.change_user_role(db, user, new_role)

    return user_with_changed_role