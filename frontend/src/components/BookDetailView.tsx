import type { BookDetail } from "../types";

interface BookDetailViewProps {
  book: BookDetail;
  onEdit: () => void;
  onDelete: () => void;
}

export function BookDetailView({ book, onEdit, onDelete }: BookDetailViewProps) {
  return (
    <div style={{ background: "white", borderRadius: "4px", padding: "1.5em", marginTop: "1em" }}>
      <h3 style={{ marginTop: 0 }}>Book Details</h3>
      <table className="pure-table" style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600, width: "30%" }}>Title</td>
            <td>{book.title}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Edition</td>
            <td>{book.edition || "N/A"}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Published Date</td>
            <td>{book.published_date || "N/A"}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Genre</td>
            <td>
              {book.genre.name}
              {book.genre.description && (
                <div style={{ fontSize: "0.85em", marginTop: "0.25em" }}>
                  {book.genre.description}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Publisher</td>
            <td>
              {book.publisher.name}
              {book.publisher.website && (
                <div style={{ fontSize: "0.85em", marginTop: "0.25em" }}>
                  <a
                    href={book.publisher.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pure-link"
                  >
                    {book.publisher.website}
                  </a>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Authors</td>
            <td>
              {book.authors.map((author) => (
                <div key={author.id}>
                  {author.name} {author.surname} ({author.birth_year})
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="pure-button-group" style={{ marginTop: "1em", display: "flex", gap: "0.5em" }}>
        <button className="pure-button pure-button-primary" onClick={onEdit}>
          Edit
        </button>
        <button className="pure-button" style={{ backgroundColor: "#d9534f", color: "white" }} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
