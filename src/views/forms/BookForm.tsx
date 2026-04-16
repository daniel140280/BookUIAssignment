import { useState, useEffect } from 'react';
import type { Book } from '../../models/Book';

/*
This component renders a form for adding or editing a book.
*/

// Props for the BookForm component. 
// The initial prop contains the details of the book to be edited. If null this the form is empty ready to add a new book.
// Following validation of the data, the callback functions pass the book details (and id if editing).
interface Props {
  initial?: Book | null;
  onSubmit: (book: Omit<Book, 'id'> & { id?: number }) => void;
  onCancel: () => void;
  loading: boolean;
}

// Constant for the empty form state. Required when adding a new book or resetting the form after editing.
const EMPTY: Omit<Book, 'id'> = {
  title: '', author: '', date: '', genres: '', characters: '', synopsis: '',
};

// This element renders a form for adding or editing a book. Data validation and error handling are included in the user interface. 
// The form fields are pre-filled when editing a book, and reset when adding a new book or after editing.
export default function BookForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [form,   setForm]   = useState<Omit<Book, 'id'>>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Book, 'id'>, string>>>({});

  useEffect(() => {
    setForm(initial ? { ...initial } : EMPTY);
    setErrors({});
  }, [initial]);

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim())       e.title      = 'Title is required.';
    if (!form.author.trim())      e.author     = 'Author is required.';
    if (!form.date.trim())        e.date       = 'Date is required.';
    else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.date))
                                  e.date       = 'Date must be DD/MM/YYYY.';
    if (!form.genres.trim())      e.genres     = 'Genres are required.';
    if (!form.characters.trim())  e.characters = 'Characters are required.';
    if (!form.synopsis.trim())    e.synopsis   = 'Synopsis is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(initial ? { ...form, id: initial.id } : form);
  }

  const field = (label: string, key: keyof typeof form, multiline = false) => (
    <div key={key}>
      <label className="form-label">{label}</label>
      {multiline
        ? <textarea value={form[key]} onChange={set(key)} rows={3} className="form-control" />
        : <input type="text" value={form[key]} onChange={set(key)} className="form-control" />
      }
      {errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {field('Title',             'title')}
      {field('Author',            'author')}
      {field('Date (DD/MM/YYYY)', 'date')}
      {field('Genres',            'genres')}
      {field('Characters',        'characters')}
      {field('Synopsis',          'synopsis', true)}
      <div style={{ display: 'flex', gap: '.75rem', paddingTop: '.5rem' }}>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Saving…' : initial ? 'Update' : 'Add Book'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}