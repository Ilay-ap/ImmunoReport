import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function AllelePicker({ alleles, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (allele) => {
    if (selected.includes(allele)) {
      onChange(selected.filter(a => a !== allele));
    } else {
      onChange([...selected, allele]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <span className="truncate text-gray-700">
          {selected.length === 0
            ? 'Selecione alelos...'
            : `${selected.length} alelo(s) selecionado(s)`}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <button
              type="button"
              onClick={() => onChange(selected.length === alleles.length ? [] : [...alleles])}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {selected.length === alleles.length ? 'Desmarcar todos' : 'Selecionar todos'}
            </button>
          </div>
          {alleles.map(allele => (
            <label
              key={allele}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-blue-50 cursor-pointer text-sm"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                selected.includes(allele)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}>
                {selected.includes(allele) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="font-mono text-gray-700">{allele}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
