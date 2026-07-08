from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.document_chunk import DocumentChunk


def delete_chunks_by_document(
    db: Session,
    *,
    document_id: int,
) -> None:
    db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document_id
    ).delete()

    db.commit()


def create_chunks(
    db: Session,
    *,
    document: Document,
    chunks: list[str],
) -> list[DocumentChunk]:
    document_chunks = [
        DocumentChunk(
            document_id=document.id,
            chunk_index=index,
            content=chunk,
        )
        for index, chunk in enumerate(chunks)
    ]

    db.add_all(document_chunks)

    document.chunk_count = len(document_chunks)
    document.status = "chunked"

    db.commit()

    for chunk in document_chunks:
        db.refresh(chunk)

    db.refresh(document)

    return document_chunks

def get_chunks_by_document(
    db: Session,
    *,
    document_id: int,
) -> list[DocumentChunk]:
    return (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )