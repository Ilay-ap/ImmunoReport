import React, { useState } from 'react';
import { Microscope, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import InputPanel from '../components/InputPanel';
import Dashboard from '../components/Dashboard';
import StatusSpinner from '../components/StatusSpinner';

export default function BCellPredictor() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const handleSubmit = async (params) => {
    setIsLoading(true);
    setResults(null);
    try {
      const res = await fetch('/api/predict/bcell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(910000),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || 'Erro desconhecido');
      if (!data.results || data.results.length === 0) {
        toast.error('Nenhum resultado retornado.');
        return;
      }
      setResults(data.results);
      setMetadata({ method: params.method, alleles: ['N/A'], lengths: ['N/A'] });
      toast.success(`${data.total} peptídeos analisados com sucesso!`);
    } catch (err) {
      toast.error(err.name === 'TimeoutError' ? 'Tempo limite excedido.' : err.message || 'Erro no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 pt-8 pb-20 px-4 text-center border-b-4 border-fuchsia-500 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
              <ShieldCheck className="w-10 h-10 text-fuchsia-300" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-md">
            B Cell Prediction - Sequence Input
          </h1>
          <p className="text-sm md:text-base text-blue-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Predição de epítopos lineares de células B (Sequence-based). Identifique regiões imunogênicas e características de superfície na proteína.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="-mt-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        <InputPanel onSubmit={handleSubmit} isLoading={isLoading} isBCell={true} />
        {isLoading && <div className="bg-white rounded-2xl shadow-xl p-8"><StatusSpinner /></div>}
        {results && !isLoading && <Dashboard data={results} metadata={metadata} />}
      </main>
    </div>
  );
}
