from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import services
from app.database import get_db
from app.schemas import (
    AuthorCreate,
    AuthorDetail,
    AuthorSummary,
    AuthorUpdate,
    BookCreate,
    BookDetail,
    BookSummary,
    BookUpdate,
    GenreDetail,
    GenreSummary,
    PublisherDetail,
    PublisherSummary,
)

router = APIRouter()


@router.get("/authors", response_model=List[AuthorSummary])
def list_authors(
    skip: int = 0,
    limit: int = 100,
    sort_by: Optional[str] = None,
    order: str = "asc",
    db: Session = Depends(get_db),
):
    return services.get_authors(
        db, skip=skip, limit=limit, sort_by=sort_by, order=order
    )


@router.post("/authors", response_model=AuthorDetail, status_code=201)
def create_author(author: AuthorCreate, db: Session = Depends(get_db)):
    try:
        return services.create_author(db, author)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not create author")


@router.get("/authors/{author_id}", response_model=AuthorDetail)
def get_author(author_id: int, db: Session = Depends(get_db)):
    author = services.get_author(db, author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author


@router.put("/authors/{author_id}", response_model=AuthorDetail)
def update_author(author_id: int, author: AuthorUpdate, db: Session = Depends(get_db)):
    updated_author = services.update_author(db, author_id, author)
    if not updated_author:
        raise HTTPException(status_code=404, detail="Author not found")
    return updated_author


@router.delete("/authors/{author_id}", status_code=204)
def delete_author(author_id: int, db: Session = Depends(get_db)):
    deleted = services.delete_author(db, author_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Author not found")


@router.get("/books", response_model=List[BookSummary])
def list_books(
    skip: int = 0,
    limit: int = 100,
    author_id: Optional[int] = None,
    genre_id: Optional[int] = None,
    publisher_id: Optional[int] = None,
    sort_by: Optional[str] = None,
    order: str = "asc",
    db: Session = Depends(get_db),
):
    return services.get_books(
        db,
        skip=skip,
        limit=limit,
        author_id=author_id,
        genre_id=genre_id,
        publisher_id=publisher_id,
        sort_by=sort_by,
        order=order,
    )


@router.post("/books", response_model=BookDetail, status_code=201)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    try:
        return services.create_book(db, book)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not create book")


@router.get("/books/{book_id}", response_model=BookDetail)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = services.get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.put("/books/{book_id}", response_model=BookDetail)
def update_book(book_id: int, book: BookUpdate, db: Session = Depends(get_db)):
    updated_book = services.update_book(db, book_id, book)
    if not updated_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated_book


@router.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    deleted = services.delete_book(db, book_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Book not found")


@router.get("/genres", response_model=List[GenreSummary])
def list_genres(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return services.get_genres(db, skip=skip, limit=limit)


@router.get("/genres/{genre_id}", response_model=GenreDetail)
def get_genre(genre_id: int, db: Session = Depends(get_db)):
    genre = services.get_genre(db, genre_id)
    if not genre:
        raise HTTPException(status_code=404, detail="Genre not found")
    return genre


@router.get("/publishers", response_model=List[PublisherSummary])
def list_publishers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return services.get_publishers(db, skip=skip, limit=limit)


@router.get("/publishers/{publisher_id}", response_model=PublisherDetail)
def get_publisher(publisher_id: int, db: Session = Depends(get_db)):
    publisher = services.get_publisher(db, publisher_id)
    if not publisher:
        raise HTTPException(status_code=404, detail="Publisher not found")
    return publisher
