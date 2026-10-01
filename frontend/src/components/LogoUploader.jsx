import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function LogoUploader({ logo, onLogoChange }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => onLogoChange(ev.target.result);
    reader.readAsDataURL(file);
  }, [onLogoChange]);

  const handleDragOver = (e) => e.preventDefault();

  if (logo) {
    return (
      <div className="relative inline-block">
        <img src={logo} alt="Logo" className="h-16 rounded border border-gray-200 p-1 bg-white" />
        <button
          onClick={() => onLogoChange(null)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
    >
      <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
      <span className="text-xs text-gray-500">Arraste o logo (.png, .jpg)</span>
      <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleDrop} />
    </label>
  );
}
