# DocuMind AI

DocuMind AI is a full-stack AI-powered enterprise document knowledge base.

The goal of this project is to let users upload company documents, process them into searchable chunks, generate embeddings, and ask questions using Retrieval-Augmented Generation.

## Tech Stack

### Frontend
- React
- Tailwind CSS

### Backend
- FastAPI
- Python
- SQLAlchemy
- Alembic

### Database
- PostgreSQL
- pgvector planned for vector search

### AI
- OpenAI Embeddings API planned
- RAG-based question answering planned

## Current Progress

### Completed
- Project repository setup
- FastAPI backend setup
- Health check endpoint
- PostgreSQL connection
- Alembic migrations setup
- User model and users table
- Clean backend folder structure

### In Progress
- Backend architecture setup
- Authentication preparation

### Planned Features
- JWT authentication
- Role-based access control
- PDF document upload
- PDF text extraction
- Text chunking
- Embedding generation
- Semantic search
- RAG chat with citations
- Chat history
- Admin dashboard
- Audit logs
- Dockerized deployment

## Backend Setup

Go to the backend folder:

```bash
cd backend