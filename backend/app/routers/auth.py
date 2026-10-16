from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from app.deps import get_db, get_current_user
from app.models import User
from app.schemas import UserOut, UserCreate, Token, LoginRequest
from app.security import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post('/register', response_model=UserOut)
def register_user(user_data:UserCreate, db:Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Пользователь уже существует')
    new_user = User(email=user_data.email, hashed_password=hash_password(user_data.password), first_name=user_data.first_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post('/login', response_model=Token)
def login_user(login_data:LoginRequest, db:Session = Depends(get_db)):
    user = db.query(User).filter(User.email==login_data.email).first()
    if user is None or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='Неверный email или пароль')
    token = create_access_token(data={'sub':user.email})
    return Token(access_token=token, token_type='bearer')