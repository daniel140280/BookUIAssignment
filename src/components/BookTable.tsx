import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Book } from '../types/Book';

const PAGE_SIZE = 50;

interface Props {
  books: Book[];
  onEdit:     (book: Book) => void;
  onDelete:   (book: Book) => void;
  onRowClick: (book: Book) => void;
}

export default function BookTable({ books, onEdit, onDelete, onRowClick }: Props) {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the book list changes (search/filter)
  useEffect(() => { setPage(1); }, [books]);

  if (books.length === 0) {
    return <p className="text-center text-gray-500 py-12">No books found.</p>;
  }

  const totalPages = Math.ceil(books.length / PAGE_SIZE);
  const pageBooks  = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Genres</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {pageBooks.map((book) => (
              <tr key={book.id} onClick={() => onRowClick(book)} className="hover:bg-indigo-50 cursor-pointer transition-colors">
                <td className="px-4 py-3 text-gray-500">{book.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{book.title}</td>
                <td className="px-4 py-3 text-gray-700">{book.author}</td>
                <td className="px-4 py-3 text-gray-600">{book.date}</td>
                <td className="px-4 py-3 text-gray-600">{book.genres}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap space-x-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(book)}
                    title="Edit"
                    className="inline-flex items-center justify-center p-1.5 rounded hover:bg-indigo-50 text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(book)}
                    title="Delete"
                    className="inline-flex items-center justify-center p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, books.length)} of {books.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
