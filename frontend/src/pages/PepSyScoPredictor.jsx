import React, { useState } from 'react';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import NextGenInputPanel from '../components/NextGenInputPanel';
import NextGenDashboard from '../components/NextGenDashboard';
import StatusSpinner from '../components/StatusSpinner';

const EXAMPLES = `>PepSySco_Test\nSLYNTVATL`;

export default function PepSyScoPredictor() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (sequences) => {
    setIsLoading(true);
    setResults(null);
    try {
      const payload = {
        tool_group: 'pepsysco',
        stage_kwargs: {
            peptide_input: sequences,
            input_sequence_text: sequences,
            epitope_sequences: sequences,
            protein_sequences: sequences
        },
        input_parameters: {}
      };

      const res = await fetch('/api/nextgen/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(910000), // 15 minutes
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Erro desconhecido');
      if (!data.results || data.results.length === 0) {
        toast.error('Nenhum resultado retornado.');
        return;
      }
      setResults(data.results);
      toast.success(`${data.total} registros processados com sucesso!`);
    } catch (err) {
      toast.error(err.name === 'TimeoutError' ? 'Tempo limite excedido.' : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 border-blue-500 pt-8 pb-20 px-4 text-center border-b-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
              <FlaskConical className="w-10 h-10 text-blue-300" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-md">
            PepSySco
          </h1>
          <p className="text-sm md:text-base text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Predição da probabilidade de síntese de um peptídeo.
          </p>
        </div>
      </div>
      <main className="-mt-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        
        {/* Aviso de lentidao */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-md mb-6 flex gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-amber-800 font-bold text-sm">Tempo de Processamento (API IEDB NextGen)</h3>
            <p className="text-amber-700 text-sm mt-1 leading-relaxed">
              Esta ferramenta utiliza a nova infraestrutura avançada de filas do IEDB. Dependendo da demanda no servidor deles e do tamanho da sua sequência, <strong>os resultados podem demorar entre 2 a 10 minutos para carregar.</strong> A tela de carregamento permanecerá ativa até que os resultados sejam devolvidos.
            </p>
          </div>
        </div>

        <NextGenInputPanel onSubmit={handleSubmit} isLoading={isLoading} title="PepSySco" description="Processamento via Motor NextGen" exampleSequences={EXAMPLES} />
        
        {isLoading && <div className="bg-white rounded-2xl shadow-xl p-8"><StatusSpinner /></div>}
        {results && !isLoading && <NextGenDashboard data={results} title="PepSySco" defaultTitle="Relatório PepSySco" />}
      </main>
    </div>
  );
}
