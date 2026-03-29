import type { Book } from '../types/Book';

interface Props {
  books: Book[];
  onEdit:   (book: Book) => void;
  onDelete: (book: Book) => void;
}

export default function BookTable({ books, onEdit, onDelete }: Props) {
  if (books.length === 0) {
    return <p className="text-center text-gray-500 py-12">No books found.</p>;
  }

  return (
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
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-500">{book.id}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{book.title}</td>
              <td className="px-4 py-3 text-gray-700">{book.author}</td>
              <td className="px-4 py-3 text-gray-600">{book.date}</td>
              <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{book.genres}</td>
              <td className="px-4 py-3 text-right space-x-2">
                <button
                  onClick={() => onEdit(book)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(book)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
