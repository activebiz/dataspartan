import { useState, useEffect } from "react";
import type { BookCreate, Genre, Publisher } from "../types";

interface BookFormProps {
  book?: BookCreate & { id?: number };
  genres: Genre[];
  publishers: Publisher[];
  currentAuthorId: number;
  onSave: (book: BookCreate) => void;
  onCancel: () => void;
  title: string;
}

export function BookForm({
  book,
  genres,
  publishers,
  currentAuthorId,
  onSave,
  onCancel,
  title,
}: BookFormProps) {
  const [formData, setFormData] = useState<BookCreate>({
    title: book?.title || "",
    edition: book?.edition || "",
    published_date: book?.published_date || "",
    publisher_id: book?.publisher_id || (publishers[0]?.id || 0),
    genre_id: book?.genre_id || (genres[0]?.id || 0),
    author_ids: book?.author_ids || [currentAuthorId],
  });

  useEffect(() => {
    if (!book && publishers.length > 0 && formData.publisher_id === 0) {
      setFormData((prev) => ({ ...prev, publisher_id: publishers[0].id }));
    }
  }, [publishers, book, formData.publisher_id]);

  useEffect(() => {
    if (!book && genres.length > 0 && formData.genre_id === 0) {
      setFormData((prev) => ({ ...prev, genre_id: genres[0].id }));
    }
  }, [genres, book, formData.genre_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <form className="pure-form pure-form-stacked" onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="pure-input-1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <label htmlFor="edition">Edition</label>
            <input
              id="edition"
              type="text"
              className="pure-input-1"
              value={formData.edition}
              onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
            />

            <label htmlFor="published_date">Published Date</label>
            <input
              id="published_date"
              type="date"
              className="pure-input-1"
              value={formData.published_date}
              onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
            />

            <label htmlFor="publisher">Publisher</label>
            <select
              id="publisher"
              className="pure-input-1"
              value={formData.publisher_id}
              onChange={(e) => setFormData({ ...formData, publisher_id: Number(e.target.value) })}
              required
            >
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </select>

            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              className="pure-input-1"
              value={formData.genre_id}
              onChange={(e) => setFormData({ ...formData, genre_id: Number(e.target.value) })}
              required
            >
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </fieldset>

          <div className="pure-button-group" style={{ marginTop: "1.5em", display: "flex", gap: "0.5em", justifyContent: "flex-end" }}>
            <button type="button" className="pure-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="pure-button pure-button-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
