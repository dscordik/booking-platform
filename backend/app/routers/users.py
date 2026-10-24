from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import secrets
from app.config import settings
from app.deps import get_current_user, get_db
from app.models import User
from app.schemas import UserOut, TelegramLinkCodeOut

router = APIRouter()

@router.get('/me', response_model=UserOut)
def current_user(user:User=Depends(get_current_user)):
    return user

@router.post('/me/telegram-link-code', response_model=TelegramLinkCodeOut)
def create_link_telegram(user:User = Depends(get_current_user), db:Session = Depends(get_db)):
    token = secrets.token_urlsafe(8)
    user.telegram_link_code = token
    db.commit()
    deep_link = f'https://t.me/{settings.BOT_USERNAME}?start={user.telegram_link_code}'
    return {'code':token, 'deep_link':deep_link}