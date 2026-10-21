import asyncio
import httpx

async def book(client: httpx.AsyncClient, slot_id: int, token: str, request_num: int):
    print(f"Запрос {request_num}: пытаемся забронировать слот {slot_id}...")
    resp = await client.post(
        "http://localhost:8000/api/bookings",
        json={"slot_id": slot_id, "comment": f"Тестовая бронь {request_num}"},
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Запрос {request_num} получил: {resp.status_code} {resp.json()}")


async def main():
    # 1. Вставь сюда реальный токен авторизованного пользователя!
    # Его можно получить, зарегистрировавшись через Swagger (/api/auth/register)
    # или создав через этот же скрипт, если есть эндпоинт.
    # Пока просто скопируй его из ответа Swagger или из localStorage фронта.
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJUZVN0MTIzQGdtYWlsLmNvbSIsImV4cCI6MTc5MjQwNzE2M30.DCxHmSybmkrGOrsDYEi4v8kdFIbItpqcaJaxA77BV2I"

    # 2. Вставь ID любого свободного слота (посмотри в Swagger GET /api/slots?service_id=1)
    # Возьми самый первый слот, у которого is_booked: false
    slot_id = 2  # <-- ЗАМЕНИ НА РЕАЛЬНЫЙ ID СВОБОДНОГО СЛОТА!

    async with httpx.AsyncClient() as client:
        print(f"--- Запускаем 2 одновременных запроса на слот {slot_id} ---")
        await asyncio.gather(
            book(client, slot_id, token, 1),
            book(client, slot_id, token, 2),
        )
        print("--- Тест завершён ---")


if __name__ == "__main__":
    asyncio.run(main())