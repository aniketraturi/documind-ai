from sqlalchemy.orm import Session

from app.models.document import Document


def create_document(
    db: Session,
    *,
    owner_id: int,
    title: str,
    filename: str,
    file_path: str,
    status: str = "uploaded",
) -> Document:
    document = Document(
        owner_id=owner_id,
        title=title,
        filename=filename,
        file_path=file_path,
        status=status,
        chunk_count=0,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document