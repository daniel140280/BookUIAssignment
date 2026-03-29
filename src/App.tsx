import { useState, useEffect, useCallback } from 'react';
import type { Book, DataFormat } from './types/Book';
import { getAllBooks, searchBooks, createBook, updateBook, deleteBook } from './api/bookApi';
import FormatSelector from './components/FormatSelector';
import BookTable from './components/BookTable';
import BookModal from './components/BookModal';
import BookForm from './components/BookForm';

export default function App() {
  const [books,   setBooks]   = useState<Book[]>([]);
  const [format,  setFormat]  = useState<DataFormat>('json');
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // Modal state
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchBooks = useCallback(async (q: string, fmt: DataFormat) => {
    setLoading(true);
    setError(null);
    try {
      const results = q.trim()
        ? await searchBooks(q.trim(), fmt)
        : await getAllBooks(fmt);
      setBooks(results);
    } catch {
      setError('Failed to load books. Is the server running on localhost:8080?');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever format or query changes (debounced 300ms for search)
  useEffect(() => {
    const timer = setTimeout(() => fetchBooks(query, format), 300);
    return () => clearTimeout(timer);
  }, [query, format, fetchBooks]);

  function openAdd() {
    setEditingBook(null);
    setModalOpen(true);
  }

  function openEdit(book: Book) {
    setEditingBook(book);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingBook(null);
  }

  async function handleFormSubmit(data: Omit<Book, 'id'> & { id?: number }) {
    setFormLoading(true);
    setError(null);
    try {
      if (data.id !== undefined) {
        await updateBook(data as Book, format);
      } else {
        await createBook(data, format);
      }
      closeModal();
      fetchBooks(query, format);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setError(msg ?? 'Failed to save book.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(book: Book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    setError(null);
    try {
      await deleteBook(book.id, format);
      fetchBooks(query, format);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setError(msg ?? 'Failed to delete book.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Book Library</h1>
          <FormatSelector value={format} onChange={setFormat} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Search + Add row */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by title, genre or year…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <button
            onClick={openAdd}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 whitespace-nowrap"
          >
            + Add Book
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Book table */}
        {loading ? (
          <p className="text-center text-gray-500 py-12">Loading…</p>
        ) : (
          <BookTable books={books} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </main>

      {/* Add / Edit modal */}
      <BookModal open={modalOpen} onClose={closeModal}>
        <BookForm
          initial={editingBook}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </BookModal>
    </div>
  );
}
