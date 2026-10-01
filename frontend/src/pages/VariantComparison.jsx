import React, { useState, useRef } from 'react';
import { GitCompare, Send, BookOpen, Download, FileDown, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import AllelePicker from '../components/AllelePicker';
import LogoUploader from '../components/LogoUploader';
import VariantPdfReport from '../components/VariantPdfReport';
import { COMMON_ALLELES, PREDICTION_METHODS } from '../constants/alleles';

export default function VariantComparison() {
  const [rawPairs, setRawPairs] = useState('');
  const [selectedAlleles, setSelectedAlleles] = useState(['HLA-A*02:01']);
  const [method, setMethod] = useState('netmhcpan_el');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Customize Report State
  const [logo, setLogo] = useState(null);
  const [reportTitle, setReportTitle] = useState('Análise de Escape Imunológico (WT vs MUT)');
  const [reportAuthor, setReportAuthor] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const printRef = useRef(null);

  const loadExamples = () => {
    setRawPairs("SLYNTVATL,SLYNTVATV\nYLNDHLEPV,YLNDHLEPA");
    setSelectedAlleles(['HLA-A*02:01']);
    toast.success('Exemplos carregados!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawPairs.trim()) return toast.error('Insira as sequências WT,MUT.');
    if (selectedAlleles.length === 0) return toast.error('Selecione ao menos um alelo.');

    const lines = rawPairs.split('\n').map(l => l.trim()).filter(l => l);
    const pairs = [];
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length !== 2) return toast.error(`Linha ${i+1} inválida. Use formato: WT,MUT`);
      pairs.push({ id: `Pair_${i+1}`, wt: parts[0].trim(), mut: parts[1].trim() });
    }

    setIsLoading(true);
    setResults(null);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairs, alleles: selectedAlleles, method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Erro ao comparar variantes.');
      
      setResults(data.results);
      toast.success('Comparação concluída!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    if (!results) return;
    const headers = ['ID', 'Alelo', 'WT Peptideo', 'WT Rank', 'WT Afinidade', 'MUT Peptideo', 'MUT Rank', 'MUT Afinidade', 'Fold Change (WT/MUT)', 'Escape'];
    const csv = [headers.join(',')];
    results.forEach(r => {
      csv.push(`${r.id},${r.allele},${r.wt_peptide},${r.wt_rank},${r.wt_affinity},${r.mut_peptide},${r.mut_rank},${r.mut_affinity},${r.fold_change.toFixed(3)},${r.escape ? 'SIM' : 'NAO'}`);
    });
    
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'variant_comparison.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Relatorio_Variantes',
  });

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen pb-16">
      
      {/* Hero */}
      <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 pt-8 pb-20 px-4 text-center border-b-4 border-emerald-500 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
              <GitCompare className="w-10 h-10 text-emerald-100" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-md">
            Peptide Variant Comparison
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Análise quantitativa de escape imunológico. Compare simultaneamente peptídeos Wild Type (WT) e Mutantes (MUT) para mapear o impacto das variantes genéticas na afinidade de ligação.
          </p>
        </div>
      </div>

      <main className="-mt-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Input Panel */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               <GitCompare className="w-5 h-5 text-emerald-600" /> Pares de Peptídeos
             </h2>
             <button type="button" onClick={loadExamples} className="text-xs flex items-center gap-1.5 text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-full font-medium transition-colors">
               <BookOpen className="w-3.5 h-3.5" /> Carregar Exemplos
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Formato: Sequência WT, Sequência MUT (uma por linha)</label>
              <textarea
                value={rawPairs}
                onChange={e => setRawPairs(e.target.value)}
                placeholder="SLYNTVATL,SLYNTVATV&#10;YLNDHLEPV,YLNDHLEPA"
                rows={5}
                className="w-full font-mono text-sm px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none bg-slate-50/50"
              />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Método Algorítmico</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
              >
                {PREDICTION_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Alelos HLA</label>
              <AllelePicker alleles={COMMON_ALLELES} selected={selectedAlleles} onChange={setSelectedAlleles} />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/30"
            >
              {isLoading ? 'Comparando...' : 'Comparar Variantes'} <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6 animate-in slide-in-from-bottom-4">
            
            {/* Header / Actions Bar */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-800">Tabela de Comparação WT vs MUT</h3>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Settings2 className="w-4 h-4" /> Personalizar PDF
                </button>

                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4 text-slate-300" /> CSV
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md shadow-emerald-500/20"
                >
                  <FileDown className="w-4 h-4" /> Gerar PDF
                </button>
              </div>
            </div>

            {/* Report Settings Panel */}
            {showSettings && (
              <div className="mb-6 pt-2 pb-6 border-b border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Título do Relatório</label>
                    <input type="text" value={reportTitle} onChange={e => setReportTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Pesquisador / Lab</label>
                    <input type="text" value={reportAuthor} placeholder="Ex: Dra. Jane Doe" onChange={e => setReportAuthor(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Observações / Conclusões</label>
                    <textarea value={reportNotes} placeholder="Adicione notas que serão impressas no final do relatório..." onChange={e => setReportNotes(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-gray-100 pl-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 w-full text-center">Logotipo do Laboratório</label>
                  <LogoUploader logo={logo} onLogoChange={setLogo} />
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Alelo</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-blue-800 bg-blue-50 uppercase">WT Peptídeo</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-blue-800 bg-blue-50 uppercase">WT Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-red-800 bg-red-50 uppercase">MUT Peptídeo</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-red-800 bg-red-50 uppercase">MUT Rank</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Fold Change</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Escape?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((r, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{r.allele}</td>
                      <td className="px-4 py-3 text-sm font-mono font-bold bg-blue-50/30 text-blue-900">{r.wt_peptide}</td>
                      <td className="px-4 py-3 text-sm font-bold text-center bg-blue-50/30">{r.wt_rank.toFixed(3)}</td>
                      <td className="px-4 py-3 text-sm font-mono font-bold bg-red-50/30 text-red-900">{r.mut_peptide}</td>
                      <td className="px-4 py-3 text-sm font-bold text-center bg-red-50/30">{r.mut_rank.toFixed(3)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-center text-gray-700">{r.fold_change.toFixed(2)}x</td>
                      <td className="px-4 py-3 text-sm text-center">
                        {r.escape ? 
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">SIM</span> : 
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold border border-emerald-200">NÃO</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hidden PDF Component */}
            <div style={{ display: 'none' }}>
              <VariantPdfReport
                ref={printRef}
                data={results}
                logo={logo}
                customProps={{ reportTitle, reportAuthor, reportNotes }}
              />
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
