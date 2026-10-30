from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.connections:dict[WebSocket, tuple[int, str]] = {}
    def connect(self, websocket:WebSocket, user_id:int, role:str):
        self.connections[websocket] = (user_id, role)
    def disconnect(self, websocket:WebSocket):
        self.connections.pop(websocket, None)

    async def safe_send(self, websocket:WebSocket, message:dict):
        try:
            await websocket.send_json(message)
            return True
        except Exception:
            self.disconnect(websocket)
            return False

    async def broad_cast(self, message:dict):
        for websocket in list(self.connections.keys()):
            await self.safe_send(websocket, message)

    async def broad_cast_admin(self, message:dict):
        for websocket, data in list(self.connections.items()):
            user_id, role = data
            if role != 'admin':
                continue
            await self.safe_send(websocket, message)

    async def send_to_user(self, user_id:int, message:dict):
        for websocket, data in list(self.connections.items()):
            connected_user_id, role = data
            if connected_user_id != user_id:
                continue
            await self.safe_send(websocket, message)


Manager = ConnectionManager()