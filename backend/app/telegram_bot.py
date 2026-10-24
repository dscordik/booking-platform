import logging
import asyncio
from typing import Callable
import httpx
from sqlalchemy.orm import Session
from app.config import settings
from app.models import User

async def send_telegram_message(chat_id:int, text:str):
    url = f'https://api.telegram.org/bot{settings.BOT_TOKEN}/sendMessage'
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json={'chat_id':chat_id, 'text':text})
            response.raise_for_status()
    except Exception as e:
        logging.warning(f'Ошибка отправки Telegram сообщения {e}')

async def start_bot_polling(db_session_factory:Callable[[], Session]):
    offset = 0
    logging.info('Telegram бот запущен в режиме long polling')
    while True:
        try:
            url = f'https://api.telegram.org/bot{settings.BOT_TOKEN}/getUpdates?offset={offset}&timeout=30'
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                data = response.json()
            for update in data.get('result', []):
                message = update.get('message')
                if message and 'text' in message:
                    text = message['text']
                    chat_id = message['chat']['id']
                    if text.startswith('/start') and len(text.split()) > 1:
                        code = text.split()[1]
                        with db_session_factory() as db:
                            user = db.query(User).filter(User.telegram_link_code == code).first()
                            if user:
                                user.telegram_id = update['message']['chat']['id']
                                user.telegram_link_code = None
                                db.commit()
                                await send_telegram_message(user.telegram_id, 'Аккаунт успешно привязан')
                            else:
                                await send_telegram_message(update['message']['chat']['id'], 'Код не найден или устарел')
                offset = update['update_id'] + 1
        except Exception as e:
            logging.error(f"Ошибка в цикле polling'а: {e}")
        await asyncio.sleep(1)