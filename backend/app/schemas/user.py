# app/schemas/user.py
from pydantic import BaseModel
from uuid import UUID

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: UUID
    username: str
    
    class Config:
        orm_mode = True
