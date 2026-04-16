import { AlertTriangle } from 'lucide-react';
import type { Book } from '../../models/Book';

/*
This is a reusable modal providing dialogue to the user to confirm an action, specifically to delete a book.
The book's title is provided to ensure the user has a visual prompt it is correct before deleting. 
*/

// Props for the ConfirmModal.
// The book prop contains the details of the book to be deleted, or null if no book is selected.
// Callback functions to confirm deletion or cancelling the action are also included.
interface Props {
  book: Book | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ book, onConfirm, onCancel }: Props) {
  if (!book) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}
           style={{ maxWidth: '26rem' }}>
        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <AlertTriangle size={40} style={{ color: '#f59e0b', margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '.5rem' }}>
            Delete Book?
          </h3>
          <p style={{ color: '#6b7280', fontSize: '.9rem', marginBottom: '1.5rem' }}>
            Are you sure you want to delete <strong>"{book.title}"</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
            <button onClick={onCancel}  className="btn btn-secondary">Cancel</button>
            <button onClick={onConfirm} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}