import type { DataFormat } from '../types/Book';
import { FORMAT_LABELS } from '../types/Book';

interface Props {
  value: DataFormat;
  onChange: (f: DataFormat) => void;
}

export default function FormatSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
          Data Format
        </span>
        <span className="text-xs text-indigo-300">select exchange format</span>
      </div>
      <div className="flex rounded-lg overflow-hidden text-sm shadow-inner border border-indigo-400">
        {(Object.keys(FORMAT_LABELS) as DataFormat[]).map((f) => (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`px-4 py-2 font-semibold transition-all duration-150 cursor-pointer ${
              value === f
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700 hover:text-white'
            }`}
          >
            {FORMAT_LABELS[f]}
          </button>
        ))}
      </div>
    </div>
  );
}
