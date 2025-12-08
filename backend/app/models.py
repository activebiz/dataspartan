from datetime import date
from typing import List

from sqlalchemy import Column, Date, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

book_authors = Table(
    "book_authors",
    Base.metadata,
    Column("book_id", Integer, ForeignKey("books.id"), primary_key=True),
    Column("author_id", Integer, ForeignKey("authors.id"), primary_key=True),
)


class Author(Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    surname: Mapped[str] = mapped_column(String(100), nullable=False)
    birth_year: Mapped[int] = mapped_column(Integer, nullable=False)

    books: Mapped[List["Book"]] = relationship(
        "Book", secondary=book_authors, back_populates="authors"
    )


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    books: Mapped[List["Book"]] = relationship("Book", back_populates="genre")


class Publisher(Base):
    __tablename__ = "publishers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    website: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    creation_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    books: Mapped[List["Book"]] = relationship("Book", back_populates="publisher")


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    edition: Mapped[str | None] = mapped_column(String(50), nullable=True)
    published_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    publisher_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("publishers.id"), nullable=False
    )
    genre_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("genres.id"), nullable=False
    )

    publisher: Mapped["Publisher"] = relationship("Publisher", back_populates="books")
    genre: Mapped["Genre"] = relationship("Genre", back_populates="books")
    authors: Mapped[List["Author"]] = relationship(
        "Author", secondary=book_authors, back_populates="books"
    )
