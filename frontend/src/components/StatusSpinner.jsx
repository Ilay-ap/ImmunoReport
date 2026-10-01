import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  'Consultando motor IEDB...',
  'Processando afinidades...',
  'Classificando peptídeos...',
  'Analisando interações MHC...',
  'Quase pronto...',
];

export default function StatusSpinner() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-lg text-gray-600 font-medium animate-pulse">
        {MESSAGES[msgIdx]}
      </p>
      <p className="text-sm text-gray-400">
        Este processo pode levar alguns minutos para lotes grandes.
      </p>
    </div>
  );
}
