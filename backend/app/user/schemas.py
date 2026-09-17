from pydantic import BaseModel

from app.enums.roles_enum import UserRole

class ChangeRoleRequest(BaseModel):
    role: UserRole