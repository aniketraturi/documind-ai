from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.document import DocumentDetailResponse, DocumentResponse
from app.services.document_service import (
    delete_user_document,
    list_user_documents,
    process_user_document,
    upload_document,
)

router = APIRouter(prefix="/documents", tags=["Documents"])


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