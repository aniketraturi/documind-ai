from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.document import (
    DocumentAskRequest,
    DocumentAskResponse,
    DocumentChunkResponse,
    DocumentDetailResponse,
    DocumentResponse,
    DocumentSearchRequest,
    DocumentSearchResult,
)
from app.services.document_service import (
    ask_user_document,
    chunk_user_document,
    delete_user_document,
    embed_user_document_chunks,
    get_user_document,
    list_user_document_chunks,
    list_user_documents,
    process_user_document,
    search_user_document_chunks,
    upload_document,
)
router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get(
    "",
    response_model=list[DocumentResponse],
)
def list_documents_route(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_user_documents(
        db,
        current_user=current_user,
    )


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_document_route(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return upload_document(
        db,
        file=file,
        current_user=current_user,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentDetailResponse,
)
def get_document_route(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_document(
        db,
        document_id=document_id,
        current_user=current_user,
    )

@router.get(
    "/{document_id}/chunks",
    response_model=list[DocumentChunkResponse],
)
def list_document_chunks_route(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_user_document_chunks(
        db,
        document_id=document_id,
        current_user=current_user,
    )

@router.post(
    "/{document_id}/process",
    response_model=DocumentDetailResponse,
)
def process_document_route(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return process_user_document(
        db,
        document_id=document_id,
        current_user=current_user,
    )

@router.post(
    "/{document_id}/chunk",
    response_model=list[DocumentChunkResponse],
)
def chunk_document_route(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return chunk_user_document(
        db,
        document_id=document_id,
        current_user=current_user,
    )


@router.delete(
    "/{document_id}",
)
def delete_document_route(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_user_document(
        db,
        document_id=document_id,
        current_user=current_user,
    )

@router.post(
    "/{document_id}/embed",
    response_model=DocumentDetailResponse,
)
def embed_document_route(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return embed_user_document_chunks(
        db,
        document_id=document_id,
        current_user=current_user,
    )

@router.post(
    "/{document_id}/search",
    response_model=list[DocumentSearchResult],
)
def search_document_route(
    document_id: int,
    request: DocumentSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_user_document_chunks(
        db,
        document_id=document_id,
        query=request.query,
        top_k=request.top_k,
        current_user=current_user,
    )

@router.post(
    "/{document_id}/ask",
    response_model=DocumentAskResponse,
)
def ask_document_route(
    document_id: int,
    request: DocumentAskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ask_user_document(
        db,
        document_id=document_id,
        question=request.question,
        top_k=request.top_k,
        current_user=current_user,
    )