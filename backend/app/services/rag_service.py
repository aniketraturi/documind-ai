from app.schemas.document import DocumentSearchResult


def generate_mock_rag_answer(
    *,
    question: str,
    search_results: list[DocumentSearchResult],
) -> str:
    if not search_results:
        return "I could not find relevant information in this document."

    top_chunks_text = "\n\n".join(
        [
            f"Source chunk {index + 1}:\n{result.content}"
            for index, result in enumerate(search_results[:3])
        ]
    )

    return (
        "Based on the most relevant document chunks, here is a draft answer:\n\n"
        f"Question: {question}\n\n"
        "Relevant context found:\n\n"
        f"{top_chunks_text}\n\n"
        "Note: This is a local development answer. Later, this will be replaced "
        "with a real AI-generated answer using the retrieved chunks as context."
    )