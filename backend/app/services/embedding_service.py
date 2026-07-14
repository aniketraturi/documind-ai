import hashlib
import random

from openai import OpenAI

from app.core.config import settings
from app.core.errors import bad_request_error

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def generate_mock_embedding(text: str, dimensions: int = 1536) -> list[float]:
    seed = int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16) % (2**32)
    random_generator = random.Random(seed)

    return [random_generator.uniform(-1, 1) for _ in range(dimensions)]


def generate_embedding(text: str) -> list[float]:
    cleaned_text = text.strip()

    if not cleaned_text:
        raise bad_request_error("Cannot generate embedding for empty text")

    if not settings.OPENAI_API_KEY:
        return generate_mock_embedding(cleaned_text)

    try:
        response = client.embeddings.create(
            model=settings.OPENAI_EMBEDDING_MODEL,
            input=cleaned_text,
        )
    except Exception as error:
        print("OPENAI EMBEDDING ERROR:", repr(error))
        return generate_mock_embedding(cleaned_text)

    return response.data[0].embedding