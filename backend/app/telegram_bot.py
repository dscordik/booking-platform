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

async def start_bot_polling(db_session_factory: Callable[[], Session]):
    offset = 0
    logging.info('Telegram бот запущен в режиме long polling')
    async with httpx.AsyncClient(timeout=40) as client:
        while True:
            try:
                response = await client.get(
                    f'https://api.telegram.org/bot{settings.BOT_TOKEN}/getUpdates',
                    params={'offset': offset, 'timeout': 30},
                )
                for update in response.json().get('result', []):
                    offset = update['update_id'] + 1
                    message = update.get('message')
                    if not message or 'text' not in message:
                        continue
                    parts = message['text'].split()
                    if parts[0].startswith('/start') and len(parts) > 1:
                        chat_id = message['chat']['id']
                        with db_session_factory() as db:
                            user = db.query(User).filter(User.telegram_link_code == parts[1]).first()
                            if user:
                                user.telegram_id = chat_id
                                user.telegram_link_code = None
                                db.commit()
                                await send_telegram_message(chat_id, 'Аккаунт успешно привязан')
                            else:
                                await send_telegram_message(chat_id, 'Код не найден или устарел. Сгенерируйте новый на сайте')
            except Exception as e:
                logging.error(f"Ошибка в цикле polling'а: {e}")
            await asyncio.sleep(1)