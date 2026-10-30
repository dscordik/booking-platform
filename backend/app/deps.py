from fastapi import Depends, HTTPException, status
from app.models import User
from app.security import decode_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import SessionLocal

bearer_schema = HTTPBearer()

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

def get_current_user(credentials:HTTPAuthorizationCredentials = Depends(bearer_schema), db:Session = Depends(get_db))->User:
    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Невалидный токен')
    email = payload.get('sub')
    if email is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Невалидный токен')
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Пользователь не найден')
    return user

def get_current_admin(user:User = Depends(get_current_user)):
    if user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='У вас недостаточно прав')
    return user

def get_ws_user(token:str | None, db:Session) -> User | None:
    if not token:
        return None
    payload = decode_access_token(token)
    if payload is None:
        return None
    email = payload.get('sub')
    if email is None:
        return None
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        return None
    return user