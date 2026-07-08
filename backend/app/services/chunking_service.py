def split_text_into_chunks(
    text: str,
    *,
    chunk_size: int = 1000,
    overlap: int = 150,
) -> list[str]:
    cleaned_text = " ".join(text.split())

    if not cleaned_text:
        return []

    chunks: list[str] = []
    start = 0

    while start < len(cleaned_text):
        end = start + chunk_size
        chunk = cleaned_text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks