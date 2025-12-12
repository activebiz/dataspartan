import type {
  Author,
  AuthorCreate,
  AuthorDetail,
  BookCreate,
  BookDetail,
  BookSummary,
  Genre,
  Publisher,
} from "./types";

const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE) ||
  "http://localhost:8000";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getAuthors(params?: {
    skip?: number;
    limit?: number;
    sort_by?: string;
    order?: string;
  }): Promise<Author[]> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request<Author[]>(
      `/authors${queryParams ? `?${queryParams}` : ""}`
    );
  }

  async getAuthor(id: number): Promise<AuthorDetail> {
    return this.request<AuthorDetail>(`/authors/${id}`);
  }

  async createAuthor(author: AuthorCreate): Promise<AuthorDetail> {
    return this.request<AuthorDetail>("/authors", {
      method: "POST",
      body: JSON.stringify(author),
    });
  }

  async updateAuthor(id: number, author: AuthorCreate): Promise<AuthorDetail> {
    console.log("Updating author:", id);
    return this.request<AuthorDetail>(`/authors/${id}`, {
      method: "PUT",
      body: JSON.stringify(author),
    });
  }

  async deleteAuthor(id: number): Promise<void> {
    return this.request<void>(`/authors/${id}`, {
      method: "DELETE",
    });
  }

  async getBooks(params?: {
    skip?: number;
    limit?: number;
    author_id?: number;
    genre_id?: number;
    publisher_id?: number;
    sort_by?: string;
    order?: string;
  }): Promise<BookSummary[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request<BookSummary[]>(
      `/books${queryParams.toString() ? `?${queryParams}` : ""}`
    );
  }

  async getBook(id: number): Promise<BookDetail> {
    return this.request<BookDetail>(`/books/${id}`);
  }

  async createBook(book: BookCreate): Promise<BookDetail> {
    return this.request<BookDetail>("/books", {
      method: "POST",
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: number, book: BookCreate): Promise<BookDetail> {
    return this.request<BookDetail>(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(book),
    });
  }

  async deleteBook(id: number): Promise<void> {
    return this.request<void>(`/books/${id}`, {
      method: "DELETE",
    });
  }

  async getGenres(): Promise<Genre[]> {
    return this.request<Genre[]>("/genres");
  }

  async getGenre(id: number): Promise<Genre> {
    return this.request<Genre>(`/genres/${id}`);
  }

  async getPublishers(): Promise<Publisher[]> {
    return this.request<Publisher[]>("/publishers");
  }

  async getPublisher(id: number): Promise<Publisher> {
    return this.request<Publisher>(`/publishers/${id}`);
  }
}

export const api = new ApiClient();
