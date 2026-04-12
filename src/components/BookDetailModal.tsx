import { X, Pencil, Trash2, BookOpen, User, Calendar, Tag, Users } from 'lucide-react';
import type { Book } from '../types/Book';

interface Props {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-indigo-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
        <p className="text-gray-800 text-sm break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function BookDetailModal({ book, onClose, onEdit, onDelete }: Props) {
  if (!book) return null;

  function handleDelete() {
    onClose();
    onDelete(book!);
  }

  function handleEdit() {
    onClose();
    onEdit(book!);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-indigo-700 px-6 py-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Book #{book.id}</p>
            <h2 className="text-white text-xl font-bold leading-snug break-words">{book.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white transition-colors shrink-0 mt-0.5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Field icon={<User size={16} />}     label="Author"  value={book.author} />
            <Field icon={<Calendar size={16} />} label="Date"    value={book.date} />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <Field icon={<Tag size={16} />} label="Genres" value={book.genres} />
          </div>

          {book.characters && (
            <div className="border-t border-gray-100 pt-4">
              <Field icon={<Users size={16} />} label="Characters" value={book.characters} />
            </div>
          )}

          {book.synopsis && (
            <div className="border-t border-gray-100 pt-4">
              <Field icon={<BookOpen size={16} />} label="Synopsis" value={book.synopsis} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={15} /> Delete
          </button>
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Pencil size={15} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}
