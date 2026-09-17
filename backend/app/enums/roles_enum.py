from enum import Enum

class UserRole(str, Enum):
    CLIENT = 'client'
    ADMIN = 'admin'
    MASTER = 'master'
