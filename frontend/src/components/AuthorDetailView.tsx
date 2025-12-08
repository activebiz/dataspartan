import type { AuthorDetail } from "../types";

interface AuthorDetailViewProps {
  author: AuthorDetail;
  onEdit: () => void;
  onDelete: () => void;
}

export function AuthorDetailView({
  author,
  onEdit,
  onDelete,
}: AuthorDetailViewProps) {
  return (
    <div style={{ background: "white", borderRadius: "4px", padding: "1.5em", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: "0.3em" }}>
            {author.name} {author.surname}
          </h2>
          <p style={{ margin: 0, color: "#777", fontSize: "14px" }}>Born: {author.birth_year}</p>
        </div>
        <div className="pure-button-group" style={{ display: "flex", gap: "0.5em" }}>
          <button className="pure-button pure-button-primary" onClick={onEdit}>
            Edit
          </button>
          <button className="pure-button" style={{ backgroundColor: "#d9534f", color: "white" }} onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
