import type { Author } from "../types";

interface AuthorSidebarProps {
  authors: Author[];
  selectedAuthorId: number | null;
  onSelectAuthor: (id: number) => void;
  onAddAuthor: () => void;
  loading: boolean;
}

export function AuthorSidebar({
  authors,
  selectedAuthorId,
  onSelectAuthor,
  onAddAuthor,
  loading,
}: AuthorSidebarProps) {
  return (
    <div className="sidebar">
      <div style={{ padding: "1em" }}>
        <h2 style={{ marginBottom: "0.5em" }}>Authors</h2>
      </div>
      <div style={{ padding: "0 1em 1em 1em" }}>
        <button className="pure-button pure-button-primary" style={{ width: "100%" }} onClick={onAddAuthor}>
          + Add New Author
        </button>
      </div>
      <div>
        {loading ? (
          <div style={{ padding: "2em", textAlign: "center", color: "#888" }}>Loading...</div>
        ) : (
          <ul className="pure-menu-list" style={{ margin: 0 }}>
            {authors.map((author) => (
              <li
                key={author.id}
                className={`pure-menu-item author-item ${
                  selectedAuthorId === author.id ? "selected" : ""
                }`}
                style={{ 
                  cursor: "pointer", 
                  padding: "0.8em 1em",
                  borderBottom: "1px solid #eee"
                }}
                onClick={() => onSelectAuthor(author.id)}
              >
                <div style={{ fontWeight: 500, fontSize: "14px" }}>
                  {author.name} {author.surname}
                </div>
                <div style={{ fontSize: "12px", color: selectedAuthorId === author.id ? "#fff" : "#666", marginTop: "2px" }}>
                  Born: {author.birth_year}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
