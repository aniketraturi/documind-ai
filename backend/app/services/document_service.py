import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.errors import bad_request_error, forbidden_error, not_found_error
from app.models.user import User
from app.repositories.document_repository import (
    create_document,
    delete_document,
    get_document_by_id,
    get_documents_by_owner,
    update_document_after_processing,
)
UPLOAD_DIR = Path("uploads/documents")
from app.services.pdf_service import extract_text_from_pdf
from app.repositories.chunk_repository import (
    create_chunks,
    delete_chunks_by_document,
    get_chunks_by_document,
)
from app.services.chunking_service import split_text_into_chunks

def upload_document(
    db: Session,
    *,
    file: UploadFile,
    current_user: User,
):
    if file.content_type != "application/pdf":
        raise bad_request_error("Only PDF files are allowed")

    original_filename = file.filename or "uploaded.pdf"

    if not original_filename.lower().endswith(".pdf"):
        raise bad_request_error("Only PDF files are allowed")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{uuid4()}_{original_filename}"
    file_path = UPLOAD_DIR / stored_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    title = Path(original_filename).stem

    document = create_document(
        db,
        owner_id=current_user.id,
        title=title,
        filename=original_filename,
        file_path=str(file_path),
        status="uploaded",
    )

    return document

def list_user_documents(
    db: Session,
    *,
    current_user: User,
):
    return get_documents_by_owner(
        db,
        owner_id=current_user.id,
    )

def delete_user_document(
    db: Session,
    *,
    document_id: int,
    current_user: User,
):
    document = get_document_by_id(
        db,
        document_id=document_id,
    )

    if document is None:
        raise not_found_error("Document not found")

    if document.owner_id != current_user.id:
        raise forbidden_error("You do not have permission to delete this document")

    file_path = Path(document.file_path)

    try:
        if file_path.exists():
            file_path.unlink()
    except OSError:
            pass

    delete_document(
        db,
        document=document,
    )

    return {"message": "Document deleted successfully"}

def process_user_document(
    db: Session,
    *,
    document_id: int,
    current_user: User,
):
    document = get_document_by_id(
        db,
        document_id=document_id,
    )

    if document is None:
        raise not_found_error("Document not found")

    if document.owner_id != current_user.id:
        raise forbidden_error("You do not have permission to process this document")

    file_path = Path(document.file_path)

    if not file_path.exists():
        raise not_found_error("Uploaded file not found")

    try:
        extracted_text, total_pages = extract_text_from_pdf(document.file_path)
    except Exception:
        document.status = "failed"
        db.commit()
        raise bad_request_error("Failed to extract text from PDF")

    if not extracted_text:
        document.status = "failed"
        db.commit()
        raise bad_request_error("No text could be extracted from this PDF")

    return update_document_after_processing(
        db,
        document=document,
        extracted_text=extracted_text,
        total_pages=total_pages,
        status="processed",
    )

def chunk_user_document(
    db: Session,
    *,
    document_id: int,
    current_user: User,
):
    document = get_document_by_id(
        db,
        document_id=document_id,
    )

    if document is None:
        raise not_found_error("Document not found")

    if document.owner_id != current_user.id:
        raise forbidden_error("You do not have permission to chunk this document")

    if not document.extracted_text:
        raise bad_request_error("Document must be processed before chunking")

    chunks = split_text_into_chunks(document.extracted_text)

    if not chunks:
        document.status = "failed"
        db.commit()
        raise bad_request_error("No chunks could be created from this document")

    delete_chunks_by_document(
        db,
        document_id=document.id,
    )

    return create_chunks(
        db,
        document=document,
        chunks=chunks,
    )

def get_user_document(
    db: Session,
    *,
    document_id: int,
    current_user: User,
):
    document = get_document_by_id(
        db,
        document_id=document_id,
    )

    if document is None:
        raise not_found_error("Document not found")

    if document.owner_id != current_user.id:
        raise forbidden_error("You do not have permission to view this document")

    return document

def list_user_document_chunks(
    db: Session,
    *,
    document_id: int,
    current_user: User,
):
    document = get_document_by_id(
        db,
        document_id=document_id,
    )

    if document is None:
        raise not_found_error("Document not found")

    if document.owner_id != current_user.id:
        raise forbidden_error("You do not have permission to view this document")

    return get_chunks_by_document(
        db,
        document_id=document.id,
    )