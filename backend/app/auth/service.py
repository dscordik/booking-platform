from app.auth.schemas import RegistrationRequest, LoginRequest, TokenResponse
from app.auth import repository as auth_repository
from app.user import repository as user_repository
from app.database.models import User
from app.auth import security as auth_security
from app.auth.config import security as security_config
from app.enums.roles_enum import UserRole

from fastapi import HTTPException

from sqlalchemy.orm import Session

def create_user(db: Session, login: str, email: str, password: str, first_name: str, last_name: str, role: UserRole, phone: str) -> User:
    if user_repository.get_user_by_name(db, login):
        raise HTTPException(
            status_code=400,
            detail=f'User with login {login} already exists'
        ) 

    hash_password = auth_security.hash_the_password(password)
    new_user = auth_repository.create_user(db, login, email, hash_password, first_name, last_name, role, phone)

    db.commit()
    db.refresh(new_user)

    return new_user

def login(db: Session, login: str, password: str) -> TokenResponse:
    current_user = user_repository.get_user_by_name(db, login)
    if not current_user:
        raise HTTPException(
            status_code=401, 
            detail=f'Invalid login or password'
        )

    if not auth_security.check_the_password(current_user.password_hash, password):
        raise HTTPException(
            status_code=401,
            detail='Invalid login or password'
        )

    token = security_config.create_access_token(uid=str(current_user.id))

    return TokenResponse(access_token=token) 