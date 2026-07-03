from pathlib import Path

from pypdf import PdfReader


def extract_text_from_pdf(file_path: str) -> tuple[str, int]:
    path = Path(file_path)

    reader = PdfReader(str(path))

    extracted_pages: list[str] = []

    for page in reader.pages:
        page_text = page.extract_text() or ""
        extracted_pages.append(page_text)

    extracted_text = "\n\n".join(extracted_pages).strip()
    total_pages = len(reader.pages)

    return extracted_text, total_pages