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

def get_documents_by_owner(
    db: Session,
    *,
    owner_id: int,
) -> list[Document]:
    return (
        db.query(Document)
        .filter(Document.owner_id == owner_id)
        .order_by(Document.created_at.desc())
        .all()
    )

def get_document_by_id(
    db: Session,
    *,
    document_id: int,
) -> Document | None:
    return db.query(Document).filter(Document.id == document_id).first()


def delete_document(
    db: Session,
    *,
    document: Document,
) -> None:
    db.delete(document)
    db.commit()

def update_document_after_processing(
    db: Session,
    *,
    document: Document,
    extracted_text: str,
    total_pages: int,
    status: str = "processed",
) -> Document:
    document.extracted_text = extracted_text
    document.total_pages = total_pages
    document.status = status

    db.commit()
    db.refresh(document)

    return document