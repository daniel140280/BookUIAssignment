import { useState, useEffect, useCallback } from 'react';
import type { Book, DataFormat } from '../models/Book';
import { getAllBooks, searchBooks, createBook, updateBook, deleteBook } from '../services/controllers/bookApiController';
import BookTable from './components/BookTable';
import FormatSelector from './components/FormatSelector';
import Toast from './components/Toast';
import BookDetailModal from './modals/BookDetailModal';
import BookFormModal from './modals/BookFormModal';
import ConfirmModal from './modals/ConfirmModal';

/*
The App component is the main entry point of the application. 
In essence, this is the Book Library Management.
It manages the overall state, providing a list of all books, data format selection, search query, adding and deleting books.
It also handles interactions with the API to fetch, create, update, and delete books based on user actions.
React hooks are used for state management and rendering only element updates in response to user interactions and API responses. 
*/

export default function App() {
  // Main states
  const [books,   setBooks]   = useState<Book[]>([]);
  const [format,  setFormat]  = useState<DataFormat>('json');
  const [query,   setQuery]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Modal states 
  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [editingBook,  setEditingBook]  = useState<Book | null>(null);
  const [formOpen,     setFormOpen]     = useState(false);
  const [formLoading,  setFormLoading]  = useState(false);
  const [confirmBook,  setConfirmBook]  = useState<Book | null>(null);

  // This function fetches books from the API based on the current search query and selected format.
  const fetchBooks = useCallback(async (q: string, fmt: DataFormat) => {
    setLoading(true);
    setError(null);
    try {
      const results = q.trim()
        ? await searchBooks(q.trim(), fmt)
        : await getAllBooks(fmt);
      setBooks(results);
    } catch {
      setError('Failed to load books. Is the Tomcat server running on localhost:8080?');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // This React useEffect hook runs whenever the search query or data format changes. 
  // A 300ms debounce timer is used to avoid excessive API calls while the user is typing.
  // Only when the timer expires, will it fetchBooks with the current query and format.
  useEffect(() => {
    const timer = setTimeout(() => fetchBooks(query, format), 300);
    return () => clearTimeout(timer);
  }, [query, format, fetchBooks]);

  // This function launches when "Add Book" button clicked, opening the add new book modal with empty fields.
  function openAdd() {
    setEditingBook(null);
    setFormOpen(true);
  }

  // This function launches when a books "Edit" button is clicked. The function is called with the book's data.
  function openEdit(book: Book) {
    setEditingBook(book);
    setFormOpen(true);
  }

  // This function closes both the add and edit modals, resetting the editing book state to null.
  function closeForm() {
    setFormOpen(false);
    setEditingBook(null);
  }

  // This function handles the add and edit book form submissions. Based on the presence of an id (or not) it will determines whether to create a new book or update an existing one.
  async function handleFormSubmit(data: Omit<Book, 'id'> & { id?: number }) {
    setFormLoading(true);
    setError(null);
    try {
      if (data.id !== undefined) {
        await updateBook(data as Book, format);
        setToast(`"${data.title}" by ${data.author} updated successfully.`);
      } else {
        await createBook(data, format);
        setToast(`"${data.title}" by ${data.author} added successfully.`);
      }
      closeForm();
      fetchBooks(query, format);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setError(msg ?? 'Failed to save book.');
    } finally {
      setFormLoading(false);
    }
  }


  // REMOVE This function is called when a user confirms they want to delete a book. 
  // It validates a book exists, then calls the deleteBook API function. A If successful, a brief success toast message is shown and book library refreshed.
  // async function handleDelete(book: Book) {
  //   if (!window.confirm(`Delete "${book.title}"?`)) return;
  //   setError(null);
  //   try {
  //     await deleteBook(book.id, format);
  //     setToast(`"${book.title}" by ${book.author} deleted.`);
  //     fetchBooks(query, format);
  //   } catch (err: unknown) {
  //     const msg = (err as { response?: { data?: string } })?.response?.data;
  //     setError(msg ?? 'Failed to delete book.');
  //   }
  // }

  
  // If an error occurs during deletion, an error message is displayed in the UI.
  async function handleDeleteConfirmed() {
    if (!confirmBook) return;
    const book = confirmBook;
    setConfirmBook(null);
    setError(null);
    try {
      await deleteBook(book.id, format);
      setToast(`"${book.title}" deleted.`);
      fetchBooks(query, format);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: string } })?.response?.data;
      setError(msg ?? 'Failed to delete book.');
    }
  }

  // This function is called when a user confirms they want to delete a book. 
  // It sets the confirmBook state to the selected book, which triggers the display of a confirmation modal. 
  // If the user confirms, handleDeleteConfirmed will be called to perform the deletion.
  function requestDelete(book: Book) {
    setDetailBook(null);
    setConfirmBook(book);
  }

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div className="page-header-inner">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-.015em' }}>
            Book Library
          </h1>
          <FormatSelector value={format} onChange={setFormat} />
        </div>
      </header>

      <main className="page-main" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search by title, genre or year…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control"
            style={{ flex: 1 }}
          />
          <button onClick={openAdd} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            + Add Book
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading
          ? <p style={{ textAlign: 'center', color: '#6b7280', padding: '3rem 0' }}>Loading…</p>
          : <BookTable
              books={books}
              onEdit={openEdit}
              onDelete={requestDelete}
              onRowClick={setDetailBook}
            />
        }
      </main>

      <BookDetailModal
        book={detailBook}
        onClose={() => setDetailBook(null)}
        onEdit={(b) => { setDetailBook(null); openEdit(b); }}
        onDelete={requestDelete}
      />

      <BookFormModal
        open={formOpen}
        initial={editingBook}
        loading={formLoading}
        onSubmit={handleFormSubmit}
        onClose={closeForm}
      />

      <ConfirmModal
        book={confirmBook}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmBook(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
