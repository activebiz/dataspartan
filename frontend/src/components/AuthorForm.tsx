import { useState } from "react";
import type { AuthorCreate } from "../types";

interface AuthorFormProps {
  author?: AuthorCreate & { id?: number };
  onSave: (author: AuthorCreate) => void;
  onCancel: () => void;
  title: string;
}

export function AuthorForm({ author, onSave, onCancel, title }: AuthorFormProps) {
  const [formData, setFormData] = useState<AuthorCreate>({
    name: author?.name || "",
    surname: author?.surname || "",
    birth_year: author?.birth_year || new Date().getFullYear() - 30,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};
    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (formData.surname.trim().length < 2) {
      newErrors.surname = "Surname must be at least 2 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <form className="pure-form pure-form-stacked" onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="pure-input-1"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              required
            />
            {errors.name && <span style={{ color: "red", fontSize: "12px" }}>{errors.name}</span>}

            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              type="text"
              className="pure-input-1"
              value={formData.surname}
              onChange={(e) => {
                setFormData({ ...formData, surname: e.target.value });
                setErrors({ ...errors, surname: "" });
              }}
              required
            />
            {errors.surname && <span style={{ color: "red", fontSize: "12px" }}>{errors.surname}</span>}

            <label htmlFor="birth_year">Birth Year</label>
            <input
              id="birth_year"
              type="number"
              className="pure-input-1"
              value={formData.birth_year}
              onChange={(e) => setFormData({ ...formData, birth_year: Number(e.target.value) })}
              required
              min="1800"
              max={new Date().getFullYear()}
            />
          </fieldset>

          <div style={{ marginTop: "1.5em", display: "flex", gap: "0.5em", justifyContent: "flex-end" }}>
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
