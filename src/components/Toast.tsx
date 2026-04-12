import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface Props {
  message: string | null;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-white border border-green-200 shadow-lg rounded-xl px-4 py-3 max-w-sm animate-fade-in">
      <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
      <p className="text-sm text-gray-800 flex-1">{message}</p>
      <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5">
        <X size={16} />
      </button>
    </div>
  );
}
