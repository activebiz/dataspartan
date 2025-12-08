from __future__ import annotations

from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class AuthorBase(BaseModel):
    name: str | None = None
    surname: str | None = None
    birth_year: int | None = None


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(AuthorBase):
    pass


class AuthorSummary(AuthorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class GenreBase(BaseModel):
    name: str
    description: Optional[str] = None


class GenreSummary(GenreBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class GenreDetail(GenreBase):
    model_config = ConfigDict(from_attributes=True)

    id: int



class PublisherBase(BaseModel):
    name: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    creation_date: Optional[date] = None


class PublisherSummary(PublisherBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class PublisherDetail(PublisherBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class BookBase(BaseModel):
    title: str
    edition: Optional[str] = None
    published_date: Optional[date] = None
    publisher_id: int
    genre_id: int


class BookCreate(BookBase):
    author_ids: List[int] = []


class BookUpdate(BookBase):
    author_ids: Optional[List[int]] = None


class BookSummary(BookBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    genre: GenreSummary
    publisher: PublisherSummary


class BookDetail(BookBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    genre: GenreDetail
    publisher: PublisherDetail
    authors: List[AuthorSummary]


class AuthorDetail(AuthorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    books: List[BookSummary] = []
