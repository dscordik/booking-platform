# Booking Platform — Misha psychologist

![React](https://img.shields.io/badge/React_19-20232a?logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646cff?logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-ff4154?logo=reactquery&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169e1?logo=postgresql&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-realtime-e8a33d)
![Telegram](https://img.shields.io/badge/Telegram-bot-26a5e4?logo=telegram&logoColor=white)

Полнофункциональная платформа онлайн-записи к психологу. Клиент выбирает услугу и свободное время, записывается и получает уведомления в Telegram. Администратор управляет услугами, расписанием и статусами записей. Все изменения видны всем **в реальном времени**, без перезагрузки страницы.

**[Демо](https://booking-platform-sigma-three.vercel.app)** · **[Swagger API](https://booking-platform-production.up.railway.app/docs)**

> [!NOTE]
> Бэкенд лежит на бесплатном тарифе и может «засыпать» после простоя. Первая загрузка демо иногда занимает до минуты.

---

## Содержание

- [Возможности](#возможности)
- [Интересные инженерные решения](#интересные-инженерные-решения)
- [Стек](#стек)
- [Демо-аккаунты](#демо-аккаунты)
- [Быстрый старт](#быстрый-старт)
- [Telegram-бот](#telegram-бот)
- [Структура проекта](#структура-проекта)
- [API](#api)
- [Бизнес-правила](#бизнес-правила)
- [Деплой](#деплой)
- [Известные ограничения](#известные-ограничения)

---

## Возможности

**Клиент**
- Регистрация и вход по email, JWT-авторизация.
- Каталог услуг с ценой и длительностью.
- Выбор дня (7 дней вперёд) и свободного времени, занятые слоты неактивны.
- Запись с комментарием, понятное сообщение при конфликте («Слот только что заняли»).
- «Мои записи»: предстоящие и история, статусы, отмена записи.
- Профиль и подключение Telegram одним нажатием.

**Администратор**
- Услуги: создание, редактирование прямо в таблице, удаление.
- Слоты: просмотр по услуге и дате, создание, удаление (занятый удалить нельзя).
- Записи: все записи клиентов, фильтры по статусу и услуге, смена статуса.

**Платформа**
- **Реальное время (WebSocket):** новая запись сразу появляется у админа, занятый слот сам становится серым у остальных, смена статуса мгновенно доходит до клиента. В шапке индикатор соединения.
- **Telegram-уведомления:** клиенту и администраторам при создании и отмене записи, клиенту при смене статуса.
- Единая обработка ошибок: человеческие сообщения вместо технических, редирект на вход при истёкшем токене.
- Адаптивный интерфейс в тёплой жёлтой палитре.

---

## Интересные инженерные решения

### Защита от двойного бронирования

Если два человека одновременно жмут на один слот, запись получит только один. Создание записи выполняется в одной транзакции со строковой блокировкой слота:

```python
slot = (
    db.query(Slot)
    .options(joinedload(Slot.service))
    .filter(Slot.id == booking_data.slot_id)
    .with_for_update(of=Slot)   # блокируется только строка слота
    .first()
)
```

```mermaid
sequenceDiagram
    participant A as Клиент A
    participant B as Клиент B
    participant API as FastAPI
    participant DB as PostgreSQL
    A->>API: POST /bookings (слот 5)
    B->>API: POST /bookings (слот 5)
    API->>DB: SELECT слот 5 FOR UPDATE (A)
    API->>DB: SELECT слот 5 FOR UPDATE (B), ждёт
    DB-->>API: A: слот свободен
    API->>DB: A: is_booked = true, COMMIT
    DB-->>API: B: слот уже занят
    API-->>A: 200 OK
    API-->>B: 409 Conflict
```

`of=Slot` важен для PostgreSQL: запрос подгружает услугу через `JOIN`, и без уточнения БД отказывается блокировать внешнее соединение. `SELECT ... FOR UPDATE` не работает на SQLite (блокировка строк игнорируется), поэтому защиту нужно проверять на PostgreSQL.

### Обновления в реальном времени

Сервер по WebSocket сообщает клиентам только **что изменилось**, а не присылает данные. Фронтенд в ответ помечает нужные запросы TanStack Query устаревшими и они сами перезапрашиваются. Это значит, что единственный источник данных остаётся REST API, а WebSocket только сигнализирует.

```mermaid
flowchart LR
    A[Клиент бронирует слот] --> B[POST /api/bookings]
    B --> C[COMMIT в БД]
    C --> D[Рассылка менеджером соединений]
    D --> E[WebSocket /api/ws]
    E --> F[Браузеры: invalidateQueries]
    F --> G[React Query перезапрашивает данные]
```

| Событие | Получатели | Что обновляется на клиенте |
|---------|------------|----------------------------|
| `booking_created` | админы | список записей |
| `booking_cancelled` | админы | список записей |
| `booking_status_changed` | владелец записи и админы | «Мои записи» и список записей |
| `slot_occupancy_changed` | все подключённые | слоты на странице услуги |

Авторизация сокета идёт через `?token=` (браузерный WebSocket не умеет передавать заголовки). При невалидном токене сервер закрывает соединение с кодом `1008`, и клиент не пытается переподключаться бесконечно. При обрыве клиент переподключается с растущей паузой (1 → 2 → 4 … 15 секунд).

### Telegram без лишних библиотек

Бот работает на long polling через `httpx` в фоновой `asyncio`-задаче. Публичный адрес и webhook не нужны. Сбой Telegram никогда не ломает бронирование: ошибка логируется, а запись создаётся. Рассылка по WebSocket выполняется раньше отправки в Telegram, чтобы недоступный Telegram не задерживал обновление интерфейса.

### Прочее

- **Feature-Sliced Design** на фронтенде: страницы, фичи, сущности и общий слой с чёткими границами.
- **Идемпотентный сид:** безопасно запускается при каждом старте, добавляет только недостающее и не трогает слоты с бронями.
- **БЭМ** во всех стилях, цвета и отступы в CSS-переменных.

---

## Стек

| Часть | Технологии |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite, React Router 7, TanStack Query, Axios |
| **Backend** | Python 3.13, FastAPI, SQLAlchemy 2, Alembic, Pydantic v2 |
| **База данных** | PostgreSQL (прод), SQLite (локальная разработка) |
| **Авторизация** | JWT (`python-jose`), пароли `passlib` + `bcrypt` |
| **Реальное время** | WebSocket (FastAPI / Starlette) |
| **Уведомления** | Telegram Bot API, long polling на `httpx` |
| **Стили** | Чистый CSS, БЭМ |
| **Хостинг** | Vercel (frontend), Railway (backend + PostgreSQL) |

---

## Демо-аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Администратор | `admin@booking.local` | `admin123` |
| Клиент | любой | зарегистрируйтесь на странице `/register` |

> [!WARNING]
> Это учебный проект с тестовыми данными. Для реального развёртывания смените пароль администратора из сида.

---

## Быстрый старт

Нужны **Python 3.13**, **Node.js 20+** и Telegram-бот (токен выдаёт `@BotFather`).

```bash
git clone https://github.com/dscordik/booking-platform.git
cd booking-platform
```

### Backend

```bash
cd backend
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env           # Windows: copy .env.example .env
```

Заполните `backend/.env`. Секретный ключ можно сгенерировать так:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DATABASE_URL` | Строка подключения к БД | — (обязательно) |
| `SECRET_KEY` | Секрет для подписи JWT | — (обязательно) |
| `ACCESS_TOKEN` | Время жизни токена, минуты | `30` |
| `ALGORITHM` | Алгоритм подписи JWT | `HS256` |
| `BOT_TOKEN` | Токен Telegram-бота | — (обязательно) |
| `BOT_USERNAME` | Username бота без `@` | — (обязательно) |

Примеры `DATABASE_URL`:

```
sqlite:///./app.db                                    # локально, без установки БД
postgresql+psycopg://user:password@localhost:5432/booking
```

Миграции, тестовые данные и запуск:

```bash
alembic upgrade head           # создать таблицы
python -m app.seed             # админ, 6 услуг, слоты на 7 дней вперёд
uvicorn app.main:app --reload
```

Сервер: <http://localhost:8000> · Swagger: <http://localhost:8000/docs> · Проверка: <http://localhost:8000/api/health>

### Frontend

В новом терминале:

```bash
cd frontend
cp .env.example .env           # Windows: copy .env.example .env
npm install
npm run dev
```

Приложение: <http://localhost:5173>

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `VITE_API_URL` | Адрес бэкенда вместе с `/api` | `http://localhost:8000/api` |

> [!TIP]
> Если фронтенд на локальном адресе ходит на «боевой» сервер, проверьте, не задан ли `VITE_API_URL` в `frontend/.env`, `.env.local` или `.env.development`. Vite читает эти файлы только при старте, поэтому после правки перезапустите `npm run dev`.

Другие команды:

```bash
npm run build      # проверка типов и production-сборка
npm run lint       # ESLint
npm run preview    # предпросмотр сборки
```

### Проверка защиты от гонки

На PostgreSQL выполните `python -m app.test_race` из папки `backend/`. Скрипт отправляет два одновременных запроса на один слот. В нём нужно указать JWT-токен пользователя и ID свободного слота. Ожидаемый результат: один ответ `200`, второй `409`.

---

## Telegram-бот

1. В Telegram откройте `@BotFather`, выполните `/newbot` и получите токен и username.
2. Впишите их в `BOT_TOKEN` и `BOT_USERNAME`. Бот стартует вместе с сервером.
3. Пользователь открывает **Профиль → «Подключить Telegram» → «Открыть бота»** и нажимает Start. Бот привязывает аккаунт по одноразовому коду (`/start <код>`).

| Событие | Клиенту | Админам с привязанным Telegram |
|---------|:-------:|:------------------------------:|
| Запись создана | ✅ | ✅ |
| Клиент отменил запись | ✅ | ✅ |
| Админ сменил статус | ✅ | — |

> [!IMPORTANT]
> Один токен бота можно использовать только в одном процессе. Если запустить бота одновременно локально и на сервере, Telegram вернёт ошибку конфликта. Для разработки заведите отдельного бота.

---

## Структура проекта

```
booking-platform/
├── backend/
│   ├── alembic/                  # миграции БД
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py           # регистрация, вход
│   │   │   ├── users.py          # /me, код привязки Telegram
│   │   │   ├── services.py       # каталог услуг
│   │   │   ├── slots.py          # слоты
│   │   │   ├── bookings.py       # записи, уведомления, рассылка событий
│   │   │   └── ws.py             # WebSocket-эндпоинт
│   │   ├── config.py             # настройки из переменных окружения
│   │   ├── database.py           # подключение, сессии
│   │   ├── deps.py               # зависимости: БД, пользователь, админ, WS-пользователь
│   │   ├── main.py               # приложение, CORS, роутеры, запуск бота
│   │   ├── models.py             # User, Service, Slot, Booking
│   │   ├── schemas.py            # Pydantic-схемы
│   │   ├── security.py           # JWT, хеширование паролей
│   │   ├── seed.py               # админ, услуги, слоты (идемпотентный)
│   │   ├── telegram_bot.py       # отправка сообщений и long polling
│   │   ├── websocket.py          # менеджер WebSocket-соединений
│   │   └── test_race.py          # проверка гонки при бронировании
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    ├── .env.example
    └── src/                      # Feature-Sliced Design
        ├── App/                  # роутер, провайдеры, защищённые маршруты
        ├── Pages/                # страницы
        ├── Features/             # сценарии: вход и регистрация, выбор слота
        ├── Entities/             # session, service, slot, booking (API + типы + ключи запросов)
        └── Shared/
            ├── api/              # axios-клиент и интерцепторы
            ├── config/           # маршруты
            ├── layout/           # общий каркас страницы
            ├── lib/              # токен, ошибки, даты, QueryClient, useWebsocket
            └── ui/               # Button, Input, Select, StatusBadge, Spinner,
                                  # Header, AdminMenu, таблицы, карточки, индикатор WS
```

### Маршруты фронтенда

| Путь | Страница | Доступ |
|------|----------|--------|
| `/`, `/services` | Каталог услуг | все |
| `/services/:id` | Услуга и выбор времени | все (записаться: после входа) |
| `/login`, `/register` | Вход, регистрация | все |
| `/profile` | Профиль, Telegram | авторизованные |
| `/my-bookings` | Мои записи | авторизованные |
| `/admin/services` | Управление услугами | админ |
| `/admin/slots` | Управление слотами | админ |
| `/admin/bookings` | Управление записями | админ |

---

## API

Префикс — `/api`. Интерактивная документация: `/docs`.

<details>
<summary><b>Авторизация и профиль</b></summary>

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| `POST` | `/api/auth/register` | все | Регистрация |
| `POST` | `/api/auth/login` | все | Вход, возвращает JWT |
| `GET` | `/api/me` | JWT | Текущий пользователь |
| `POST` | `/api/me/telegram-link-code` | JWT | Код привязки Telegram и ссылка на бота |

</details>

<details>
<summary><b>Услуги</b></summary>

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| `GET` | `/api/services/` | все | Список услуг |
| `GET` | `/api/services/{id}` | все | Одна услуга |
| `POST` | `/api/services/` | админ | Создать |
| `PATCH` | `/api/services/{id}` | админ | Изменить |
| `DELETE` | `/api/services/{id}` | админ | Удалить |

</details>

<details>
<summary><b>Слоты</b></summary>

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| `GET` | `/api/slots?service_id=&date=` | все | Слоты услуги, опционально на дату |
| `POST` | `/api/slots` | админ | Создать слот |
| `DELETE` | `/api/slots/{id}` | админ | Удалить слот |

</details>

<details>
<summary><b>Записи</b></summary>

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| `POST` | `/api/bookings` | JWT | Записаться на слот |
| `GET` | `/api/bookings/me` | JWT | Мои записи |
| `PATCH` | `/api/bookings/{id}/cancel` | владелец | Отменить свою запись |
| `GET` | `/api/bookings?status=&service_id=` | админ | Все записи с фильтрами |
| `PATCH` | `/api/bookings/{id}/admin-status` | админ | Сменить статус записи |

Статусы: `pending` (ожидает), `confirmed` (подтверждена), `cancelled` (отменена), `done` (выполнена).

</details>

<details>
<summary><b>Служебное и реальное время</b></summary>

| Метод | Путь | Описание |
|-------|------|----------|
| `GET`, `HEAD` | `/api/health` | Проверка работы сервиса |
| `WebSocket` | `/api/ws?token=<jwt>` | События реального времени |

</details>

---

## Бизнес-правила

- Нельзя записаться на слот в прошлом (`400`) и на занятый слот (`409`).
- Отменить можно только свою запись (`403` для чужой), и только если она не отменена и не завершена.
- Отмена записи (клиентом или админом) освобождает слот. Возврат отменённой записи в активный статус занимает слот обратно, если он ещё свободен (иначе `409`).
- Админ не может создать слот в прошлом или с окончанием раньше начала (`400`).
- Нельзя удалить слот с активной записью (`400`).
- Админ-эндпоинты недоступны без роли `admin`.

---

## Деплой

### Backend → Railway

1. New Project → Deploy from GitHub repo, добавить **PostgreSQL**.
2. В настройках сервиса бэкенда:

   | Поле | Значение |
   |------|----------|
   | Root Directory | `backend` |
   | Start Command | `alembic upgrade head && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

3. Variables: `DATABASE_URL` (адрес PostgreSQL со схемой `postgresql+psycopg://`), `SECRET_KEY`, `BOT_TOKEN`, `BOT_USERNAME`, при желании `ACCESS_TOKEN` и `ALGORITHM`.
4. Settings → Networking → Generate Domain.

Сид идемпотентный, поэтому его безопасно оставлять в стартовой команде: он добавляет только недостающие услуги и слоты и не трогает слоты с бронями.

### Frontend → Vercel

1. New Project → тот же репозиторий, **Root Directory** `frontend`, Framework Preset — Vite.
2. Environment Variables: `VITE_API_URL` = `https://<ваш-бэкенд>/api`. Vite подставляет переменные при сборке, поэтому после изменения нужен Redeploy.
3. Файл `frontend/vercel.json` направляет все пути на `index.html`, иначе обновление страницы на `/services` или `/login` даёт 404:

   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

### CORS

Разрешённые адреса фронтенда перечислены в `backend/app/main.py` (`allow_origins`). При смене домена обновите список.

---

## Известные ограничения

- **Реестр WebSocket-соединений хранится в памяти процесса,** поэтому realtime работает при одном воркере. Для нескольких воркеров нужен брокер (например Redis pub/sub).
- **Время слотов хранится в UTC.** На сайте оно показывается в часовом поясе браузера, а в сообщениях Telegram пока по UTC.
- Токен для WebSocket передаётся в строке запроса и может попадать в логи сервера. Токен живёт ограниченное время (по умолчанию 30 минут).
- Бот опрашивает Telegram в фоне, поэтому на «спящем» бесплатном сервисе он отвечает с задержкой после пробуждения.

---

## Автор

[@dscordik](https://github.com/dscordik)
