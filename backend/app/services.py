from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.models import Author, Book, Genre, Publisher
from app.schemas import AuthorCreate, AuthorUpdate, BookCreate, BookUpdate


def get_authors(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    sort_by: Optional[str] = None,
    order: str = "asc",
) -> List[Author]:
    query = db.query(Author)

    if sort_by:
        order_column = getattr(Author, sort_by, None)
        if order_column:
            if order == "desc":
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column)

    return query.offset(skip).limit(limit).all()


def get_author(db: Session, author_id: int) -> Optional[Author]:
    return (
        db.query(Author)
        .options(joinedload(Author.books).joinedload(Book.genre))
        .options(joinedload(Author.books).joinedload(Book.publisher))
        .filter(Author.id == author_id)
        .first()
    )


def create_author(db: Session, author: AuthorCreate) -> Author:
    payload = author.model_dump()
    db_author = Author(**payload)
    db.add(db_author)
    db.commit()
    db.refresh(db_author)
    return db_author


def update_author(
    db: Session, author_id: int, author: AuthorUpdate
) -> Optional[Author]:
    db_author = db.query(Author).filter(Author.id == author_id).first()
    if not db_author:
        return None

    for key, value in author.model_dump().items():
        setattr(db_author, key, value)

    db.commit()
    db.refresh(db_author)
    return db_author


def delete_author(db: Session, author_id: int) -> bool:
    db_author = (
        db.query(Author)
        .options(joinedload(Author.books))
        .filter(Author.id == author_id)
        .first()
    )

    if not db_author:
        return False

    if db_author.books:
        num_books = len(db_author.books)
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete author with {num_books} associated book(s)",
        )

    db.delete(db_author)
    db.commit()
    return True


def get_books(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    author_id: Optional[int] = None,
    genre_id: Optional[int] = None,
    publisher_id: Optional[int] = None,
    sort_by: Optional[str] = None,
    order: str = "asc",
) -> List[Book]:
    query = db.query(Book).options(
        joinedload(Book.genre), joinedload(Book.publisher), joinedload(Book.authors)
    )

    if author_id:
        query = query.join(Book.authors).filter(Author.id == author_id)
    if genre_id:
        query = query.filter(Book.genre_id == genre_id)
    if publisher_id:
        query = query.filter(Book.publisher_id == publisher_id)

    if sort_by:
        order_column = getattr(Book, sort_by, None)
        if order_column:
            if order == "desc":
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column)

    return query.offset(skip).limit(limit).all()


def get_book(db: Session, book_id: int) -> Optional[Book]:
    return (
        db.query(Book)
        .options(
            joinedload(Book.genre),
            joinedload(Book.publisher),
            joinedload(Book.authors),
        )
        .filter(Book.id == book_id)
        .first()
    )


def create_book(db: Session, book: BookCreate) -> Book:
    author_count = db.query(Author).filter(Author.id.in_(book.author_ids)).count()
    if author_count != len(book.author_ids):
        raise HTTPException(status_code=400, detail="One or more author IDs not found")

    authors = db.query(Author).filter(Author.id.in_(book.author_ids)).all()

    genre = db.query(Genre).filter(Genre.id == book.genre_id).first()
    if not genre:
        raise HTTPException(status_code=400, detail="Genre not found")

    publisher = db.query(Publisher).filter(Publisher.id == book.publisher_id).first()
    if not publisher:
        raise HTTPException(status_code=400, detail="Publisher not found")

    book_data = book.model_dump(exclude={"author_ids"})
    db_book = Book(**book_data, authors=authors)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, book_id: int, book: BookUpdate) -> Optional[Book]:
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        return None

    if book.author_ids is not None:
        author_count = db.query(Author).filter(Author.id.in_(book.author_ids)).count()
        if author_count != len(book.author_ids):
            raise HTTPException(status_code=400, detail="One or more author IDs not found")
        authors = db.query(Author).filter(Author.id.in_(book.author_ids)).all()
    else:
        authors = db_book.authors

    genre = db.query(Genre).filter(Genre.id == book.genre_id).first()
    if not genre:
        raise HTTPException(status_code=400, detail="Genre not found")

    publisher = db.query(Publisher).filter(Publisher.id == book.publisher_id).first()
    if not publisher:
        raise HTTPException(status_code=400, detail="Publisher not found")

    book_data = book.model_dump(exclude={"author_ids"}, exclude_unset=True)
    for key, value in book_data.items():
        setattr(db_book, key, value)
    db_book.authors = authors

    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, book_id: int) -> bool:
    db_book = db.query(Book).filter(Book.id == book_id).first()
    if not db_book:
        return False

    db.delete(db_book)
    db.commit()
    return True


def get_genres(db: Session, skip: int = 0, limit: int = 100) -> List[Genre]:
    return db.query(Genre).offset(skip).limit(limit).all()


def get_genre(db: Session, genre_id: int) -> Optional[Genre]:
    return db.query(Genre).filter(Genre.id == genre_id).first()


def get_publishers(db: Session, skip: int = 0, limit: int = 100) -> List[Publisher]:
    return db.query(Publisher).offset(skip).limit(limit).all()


def get_publisher(db: Session, publisher_id: int) -> Optional[Publisher]:
    return db.query(Publisher).filter(Publisher.id == publisher_id).first()
