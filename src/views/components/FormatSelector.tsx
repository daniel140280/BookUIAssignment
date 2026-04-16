import type { DataFormat } from '../../models/Book';
import { FORMAT_LABELS } from '../../models/Book';

/*
The FormatSelector component provides a UI for selecting the data format used for communication with the server. 
It displays buttons for each format  (JSON, XML, plain text), highlighting the currently selected data format.
*/

// Props for the FormatSelector component.
// The value prop indicates the currently selected data format. The callback function is used when the user selects a different data format.
interface Props {
  value: DataFormat;
  onChange: (f: DataFormat) => void;
}

// The FormatSelector component renders a set of buttons for each data format. Required for user requests to the server to determine the relevant Content-Type and Accept headers needed for API calls.
export default function FormatSelector({ value, onChange }: Props) {
  return (
    <div className="format-selector-wrap">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase',
                       letterSpacing: '.1em', color: '#a5b4fc' }}>Data Format</span>
        <span style={{ fontSize: '.7rem', color: '#c7d2fe' }}>select exchange format</span>
      </div>
      <div className="format-btn-group">
        {(Object.keys(FORMAT_LABELS) as DataFormat[]).map((f) => (
          <button key={f} onClick={() => onChange(f)}
            className={`format-btn ${value === f ? 'active' : 'inactive'}`}>
            {FORMAT_LABELS[f]}
          </button>
        ))}
      </div>
    </div>
  );  
}


// return (
//   <div className="flex items-center gap-3">
//     <div className="flex flex-col items-end">
//       <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
//         Data Format
//       </span>
//       <span className="text-xs text-indigo-300">select exchange format</span>
//     </div>
//     <div className="flex rounded-lg overflow-hidden text-sm shadow-inner border border-indigo-400">
//       {(Object.keys(FORMAT_LABELS) as DataFormat[]).map((f) => (
//         <button
//           key={f}
//           onClick={() => onChange(f)}
//           className={`px-4 py-2 font-semibold transition-all duration-150 cursor-pointer ${
//             value === f
//               ? 'bg-white text-indigo-700 shadow-sm'
//               : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700 hover:text-white'
//           }`}
//         >
//           {FORMAT_LABELS[f]}
//         </button>
//       ))}
//     </div>
//   </div>
// );