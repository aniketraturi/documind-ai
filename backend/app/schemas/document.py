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


class DocumentDetailResponse(DocumentResponse):
    extracted_text: str | None

class DocumentChunkResponse(BaseModel):
    id: int
    document_id: int
    chunk_index: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentSearchRequest(BaseModel):
    query: str
    top_k: int = 5


class DocumentSearchResult(BaseModel):
    chunk_id: int
    document_id: int
    chunk_index: int
    content: str
    similarity: float


class DocumentAskRequest(BaseModel):
    question: str
    top_k: int = 5


class DocumentAskSource(BaseModel):
    chunk_id: int
    chunk_index: int
    content: str
    similarity: float


class DocumentAskResponse(BaseModel):
    answer: str
    sources: list[DocumentAskSource]