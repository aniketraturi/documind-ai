from datetime import datetime

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    owner_id: int
    title: str
    filename: str
    status: str
    total_pages: int | None
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True