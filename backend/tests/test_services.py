import pytest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models import Author, Book, Genre, Publisher
from app.schemas import AuthorCreate, AuthorUpdate, BookCreate, BookUpdate
from app.services import (
    create_author,
    create_book,
    delete_author,
    delete_book,
    get_author,
    get_authors,
    get_book,
    get_books,
    get_genre,
    get_genres,
    get_publisher,
    get_publishers,
    update_author,
    update_book,
)

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_services.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()


@pytest.fixture
def sample_genre(db):
    genre = Genre(name="Science Fiction", description="Sci-fi books")
    db.add(genre)
    db.commit()
    db.refresh(genre)
    return genre


@pytest.fixture
def sample_publisher(db):
    publisher = Publisher(name="Test Publisher", website="http://test.com")
    db.add(publisher)
    db.commit()
    db.refresh(publisher)
    return publisher


def test_create_author(db):
    author_data = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    author = create_author(db, author_data)
    
    assert author.id is not None
    assert author.name == "Isaac"
    assert author.surname == "Asimov"


def test_get_authors(db):
    author1 = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    author2 = AuthorCreate(name="Arthur", surname="Clarke", birth_year=1917)
    create_author(db, author1)
    create_author(db, author2)
    
    authors = get_authors(db)
    assert len(authors) == 2


def test_get_author(db):
    author_data = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    created = create_author(db, author_data)
    
    fetched = get_author(db, created.id)
    assert fetched.name == "Isaac"


def test_update_author(db):
    author_data = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    created = create_author(db, author_data)
    
    update_data = AuthorUpdate(name="Isaac", surname="Asimov", birth_year=1921)
    updated = update_author(db, created.id, update_data)
    
    assert updated.birth_year == 1921


def test_delete_author_success(db):
    author_data = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    created = create_author(db, author_data)
    
    result = delete_author(db, created.id)
    assert result is True


def test_delete_author_with_books_fails(db, sample_genre, sample_publisher):
    author_data = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    author = create_author(db, author_data)
    
    book_data = BookCreate(
        title="Foundation",
        edition="1st",
        publisher_id=sample_publisher.id,
        genre_id=sample_genre.id,
        author_ids=[author.id]
    )
    create_book(db, book_data)
    
    with pytest.raises(HTTPException) as exc:
        delete_author(db, author.id)
    assert exc.value.status_code == 400


def test_create_book(db, sample_genre, sample_publisher):
    author_data = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    author = create_author(db, author_data)
    
    book_data = BookCreate(
        title="Foundation",
        edition="1st",
        publisher_id=sample_publisher.id,
        genre_id=sample_genre.id,
        author_ids=[author.id]
    )
    book = create_book(db, book_data)
    
    assert book.id is not None
    assert book.title == "Foundation"


def test_get_books(db, sample_genre, sample_publisher):
    author_data = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    author = create_author(db, author_data)
    
    book1 = BookCreate(
        title="Foundation", edition="1st",
        publisher_id=sample_publisher.id, genre_id=sample_genre.id,
        author_ids=[author.id]
    )
    book2 = BookCreate(
        title="I, Robot", edition="1st",
        publisher_id=sample_publisher.id, genre_id=sample_genre.id,
        author_ids=[author.id]
    )
    create_book(db, book1)
    create_book(db, book2)
    
    books = get_books(db)
    assert len(books) == 2


def test_delete_book(db, sample_genre, sample_publisher):
    author_data = AuthorCreate(name="Isaac", surname="Asimov", birth_year=1920)
    author = create_author(db, author_data)
    
    book_data = BookCreate(
        title="Foundation", edition="1st",
        publisher_id=sample_publisher.id, genre_id=sample_genre.id,
        author_ids=[author.id]
    )
    book = create_book(db, book_data)
    
    result = delete_book(db, book.id)
    assert result is True
