export interface Author {
  id: number;
  name: string;
  surname: string;
  birth_year: number;
}

export interface AuthorCreate {
  name: string;
  surname: string;
  birth_year: number;
}

export interface AuthorDetail extends Author {
  books: BookSummary[];
}

export interface Genre {
  id: number;
  name: string;
  description?: string;
}

export interface Publisher {
  id: number;
  name: string;
  website?: string;
  description?: string;
  creation_date?: string;
}

export interface BookBase {
  title: string;
  edition?: string;
  published_date?: string;
  publisher_id: number;
  genre_id: number;
}

export interface BookCreate extends BookBase {
  author_ids: number[];
}

export interface BookSummary extends BookBase {
  id: number;
  genre: Genre;
  publisher: Publisher;
}

export interface BookDetail extends BookBase {
  id: number;
  genre: Genre;
  publisher: Publisher;
  authors: Author[];
}
