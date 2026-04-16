import { X, Pencil, Trash2, BookOpen, User, Calendar, Tag, Users } from 'lucide-react';
import type { Book } from '../../models/Book';

/*
This component renders a modal displaying the detail of a selected book.
It includes the options to edit or delete the book. 
*/

// Props for the BookDetailModal.
// The book prop contains the details of the book to be displayed, or null if no book is selected.
// Callback functions to close the modal, edit the book, or delete the book are also included. 
interface Props {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

// Reusable component for displaying a field in the book. Avoids duplication of code.
function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '.75rem' }}>
      <div style={{ marginTop: '2px', color: '#818cf8', flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '.07em', color: '#9ca3af', marginBottom: '2px' }}>{label}</p>
        <p style={{ color: '#1f2937', fontSize: '.875rem', wordBreak: 'break-word' }}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

// This component renders a modal that shows the displays the full details of a selected book. This is more detail than the main page table.
export default function BookDetailModal({ book, onClose, onEdit, onDelete }: Props) {
  if (!book) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase',
                        letterSpacing: '.1em', color: '#a5b4fc', marginBottom: '4px' }}>
              Book #{book.id}
            </p>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, wordBreak: 'break-word' }}>
              {book.title}
            </h2>
          </div>
          <button onClick={onClose} style={{ color: '#a5b4fc', background: 'none',
                                             border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field icon={<User size={16} />}     label="Author" value={book.author} />
            <Field icon={<Calendar size={16} />} label="Date"   value={book.date} />
          </div>
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
            <Field icon={<Tag size={16} />} label="Genres" value={book.genres} />
          </div>
          {book.characters && (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
              <Field icon={<Users size={16} />} label="Characters" value={book.characters} />
            </div>
          )}
          {book.synopsis && (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
              <Field icon={<BookOpen size={16} />} label="Synopsis" value={book.synopsis} />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={() => { onClose(); onDelete(book); }} className="btn btn-danger">
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={() => { onClose(); onEdit(book); }} className="btn btn-primary">
            <Pencil size={15} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}

  // export default function BookDetailModal({ book, onClose, onEdit, onDelete }: Props) {
  // if (!book) return null;

  // function handleDelete() {
  //   onClose();
  //   onDelete(book!);
  // }

  // function handleEdit() {
  //   onClose();
  //   onEdit(book!);
  // }

  // return (
  //   <div
  //     className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
  //     onClick={onClose}
  //   >
  //     <div
  //       className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden"
  //       onClick={(e) => e.stopPropagation()}
  //     >
  //       {/* Header */}
  //       <div className="bg-indigo-700 px-6 py-5 flex items-start justify-between gap-4">
  //         <div className="min-w-0">
  //           <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Book #{book.id}</p>
  //           <h2 className="text-white text-xl font-bold leading-snug break-words">{book.title}</h2>
  //         </div>
  //         <button
  //           onClick={onClose}
  //           className="text-indigo-200 hover:text-white transition-colors shrink-0 mt-0.5"
  //         >
  //           <X size={20} />
  //         </button>
  //       </div>

  //       {/* Body */}
  //       <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
  //         <div className="grid grid-cols-2 gap-4">
  //           <Field icon={<User size={16} />}     label="Author"  value={book.author} />
  //           <Field icon={<Calendar size={16} />} label="Date"    value={book.date} />
  //         </div>

  //         <div className="border-t border-gray-100 pt-4">
  //           <Field icon={<Tag size={16} />} label="Genres" value={book.genres} />
  //         </div>

  //         {book.characters && (
  //           <div className="border-t border-gray-100 pt-4">
  //             <Field icon={<Users size={16} />} label="Characters" value={book.characters} />
  //           </div>
  //         )}

  //         {book.synopsis && (
  //           <div className="border-t border-gray-100 pt-4">
  //             <Field icon={<BookOpen size={16} />} label="Synopsis" value={book.synopsis} />
  //           </div>
  //         )}
  //       </div>

  //       {/* Footer */}
  //       <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
  //         <button
  //           onClick={handleDelete}
  //           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
  //         >
  //           <Trash2 size={15} /> Delete
  //         </button>
  //         <button
  //           onClick={handleEdit}
  //           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
  //         >
  //           <Pencil size={15} /> Edit
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
