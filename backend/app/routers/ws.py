from fastapi import APIRouter,  WebSocket, WebSocketDisconnect, status
from app.database import SessionLocal
from app.deps import get_ws_user
from app.websocket import Manager

router = APIRouter()

@router.websocket('/ws')
async def ws_endpoint(websocket:WebSocket):
    await websocket.accept()
    token = websocket.query_params.get('token')
    user_inf = None
    with (SessionLocal() as db):
        user = get_ws_user(token, db)
        if user:
            user_inf = (user.id, user.role)
        if user_inf is None:
            return await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
    Manager.connect(websocket, *user_inf)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        Manager.disconnect(websocket)