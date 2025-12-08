# Backend

Python/FastAPI backend for the Book Catalog.

## Tech Stack

- **FastAPI**: Modern web framework for building APIs
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation and settings management
- **SQLite**: Development database
- **Uvicorn**: ASGI server
- **uv**: Fast Python package installer and resolver

## Setup & Installation

### Prerequisites

- Python 3.11 or higher

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using uv:
   ```bash
   uv sync --all-extras
   ```
   This will create a virtual environment and install all dependencies (including dev tools) from `pyproject.toml`.

3. (Optional) Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Initialize database with seed data:
   ```bash
   uv run python -m app.init_db
   ```

## Running the Server

Development mode with auto-reload:
```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Running Tests

Run all tests:
```bash
uv run pytest
```

The test suite includes 12 tests covering:
- API endpoint functionality
- Service layer CRUD operations
- Business rule validation (e.g., author deletion prevention)

## Code Quality

### Formatting
```bash
uv run black app/ tests/
```

### Type Checking
```bash
uv run mypy app/
```

## Configuration

Environment variables can be set in `.env` file:

- `DATABASE_URL`: Database connection string (default: `sqlite:///./books.db`)
- `DEBUG`: Enable debug mode (default: `True`)

Run the seed script:
```bash
python -m app.init_db
```

## API Documentation

Interactive API documentation is automatically generated and available at:
- Swagger UI: `http://localhost:8000/docs`

## Development Notes

- The application uses SQLite for development.
- CORS is configured to allow all origins in development. Update this for production.
- The service layer (`services.py`) contains all business logic, keeping routes thin.
- All database operations use SQLAlchemy ORM with proper session management.
