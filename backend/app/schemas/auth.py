from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    full_name: str = Field(min_length=1, max_length=255)


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str

    class Config:
        from_attributes = True