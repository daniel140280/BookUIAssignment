import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';

interface Props {
  initial?: Book | null;
  onSubmit: (book: Omit<Book, 'id'> & { id?: number }) => void;
  onCancel: () => void;
  loading: boolean;
}

const EMPTY: Omit<Book, 'id'> = {
  title: '', author: '', date: '', genres: '', characters: '', synopsis: '',
};

export default function BookForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState<Omit<Book, 'id'>>(EMPTY);
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

  const field = (
    label: string,
    key: keyof typeof form,
    multiline = false,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={form[key]}
          onChange={set(key)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <input
          type="text"
          value={form[key]}
          onChange={set(key)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {initial ? 'Edit Book' : 'Add New Book'}
      </h2>
      {field('Title', 'title')}
      {field('Author', 'author')}
      {field('Date (DD/MM/YYYY)', 'date')}
      {field('Genres', 'genres')}
      {field('Characters', 'characters')}
      {field('Synopsis', 'synopsis', true)}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving…' : initial ? 'Update' : 'Add Book'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 px-5 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
