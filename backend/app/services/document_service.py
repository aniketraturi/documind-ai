import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.errors import bad_request_error
from app.models.user import User
from app.repositories.document_repository import create_document

UPLOAD_DIR = Path("uploads/documents")


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