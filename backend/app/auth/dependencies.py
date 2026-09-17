from fastapi import Depends, HTTPException

from authx import TokenPayload

from app.auth.config import security as security_config
from app.database.dependency import get_db
from app.database.models import User
from app.enums.roles_enum import UserRole

from sqlalchemy.orm import Session

def get_current_user(db: Session = Depends(get_db), payload: TokenPayload = Depends(security_config.access_token_required)) -> User:
    user_id = payload.sub

    user = db.query(User).filter(User.id==int(user_id)).first()
    if not user: 
        raise HTTPException(
            status_code=404,
            detail='User not found'
        )
    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail='User is not active'
        )
    return user
