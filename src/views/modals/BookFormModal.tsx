import { X } from 'lucide-react';
import type { Book } from '../../models/Book';
import BookForm from '../forms/BookForm';

/*
This is a reusable modal providing a form to the user to add a new book or edit an existing one.
When editing, the form fields are pre-filled with the book's current details. When adding a new book, the form is empty.
The form includes validation and error handling. Callback functions are provided to handle the form submission and closing the modal.
*/

// Props for the BookFormModal.
// The book prop contains the details of the book to be deleted, or null if no book is selected.
// Callback functions to confirm deletion or cancelling the action are also included.
interface Props {
  open: boolean;
  initial: Book | null;
  loading: boolean;
  onSubmit: (data: Omit<Book, 'id'> & { id?: number }) => void;
  onClose: () => void;
}

// This modal render the BookForm form within it, allowing a new book to be added or to edit an existing one. 
// The form includes validation and error handling. 
// Callback functions are provided to handle the form submission and closing the modal.
export default function BookFormModal({ open, initial, loading, onSubmit, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {initial ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} style={{ color: '#a5b4fc', background: 'none',
                                             border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <BookForm initial={initial} onSubmit={onSubmit} onCancel={onClose} loading={loading} />
        </div>
      </div>
    </div>
  );
}