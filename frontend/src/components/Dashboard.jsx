import React, { useState, useRef } from 'react';
import { FileDown, Filter, BarChart3, Table2, Settings2, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import ResultsTable from './ResultsTable';
import AffinityChart from './AffinityChart';
import PdfReport from './PdfReport';
import LogoUploader from './LogoUploader';
import { chartToBase64 } from '../utils/pdfExport';

export default function Dashboard({ data, metadata }) {
  const [affinityFilter, setAffinityFilter] = useState('All');
  const [chartImage, setChartImage] = useState(null);
  
  // Customize Report State
  const [logo, setLogo] = useState(null);
  const [reportTitle, setReportTitle] = useState('Relatório de Predição Imunológica (MHC-I)');
  const [reportAuthor, setReportAuthor] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const chartRef = useRef(null);
  const printRef = useRef(null);

  const filteredData = affinityFilter === 'All' 
    ? data 
    : data.filter(r => r.binding_affinity === affinityFilter);

  const strongCount = data.filter(r => r.binding_affinity === 'Strong').length;
  const intermediateCount = data.filter(r => r.binding_affinity === 'Intermediate').length;
  const weakCount = data.filter(r => r.binding_affinity === 'Weak').length;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Relatorio_Imunologico',
    onBeforeGetContent: async () => {
      try {
        const img = await chartToBase64(chartRef);
        setChartImage(img);
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.error("Erro ao gerar imagem do gráfico", err);
      }
    },
  });

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    
    let availableKeys = Object.keys(filteredData[0]).filter(k => k !== 'color_code');
    availableKeys = availableKeys.filter(k => k !== 'binding_affinity');
    availableKeys.push('binding_affinity');

    const headers = availableKeys.map(k => {
      const labels = {
        allele: 'Alelo', seq_num: 'Seq #', start: 'Inicio', end: 'Fim', length: 'Tam',
        peptide: 'Peptideo', percentile_rank: 'Rank', binding_affinity: 'Afinidade',
      };
      return labels[k] || k.toUpperCase();
    });

    const csvRows = [
      headers.join(','),
      ...filteredData.map(row => 
        availableKeys.map(key => row[key]).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'predicoes_mhc1.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {data.length} peptídeos analisados
                </h3>
                <p className="text-sm text-gray-500 font-medium">Classificação geral baseada no Rank</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                Strong: {strongCount}
              </span>
              <span className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg border border-yellow-200">
                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
                Intermediate: {intermediateCount}
              </span>
              <span className="flex items-center gap-2 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="w-3 h-3 rounded-full bg-slate-500 shadow-sm" />
                Weak: {weakCount}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 w-full lg:w-auto">
              <Filter className="w-4 h-4 text-gray-400 ml-3 mr-2" />
              <select
                value={affinityFilter}
                onChange={(e) => setAffinityFilter(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-700 py-2 pr-4 focus:outline-none cursor-pointer"
              >
                <option value="All">Mostrar Todos</option>
                <option value="Strong">Apenas Strong</option>
                <option value="Intermediate">Apenas Intermediate</option>
                <option value="Weak">Apenas Weak</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Settings2 className="w-4 h-4" />
              Personalizar PDF
            </button>

            <button
              onClick={exportToCSV}
              className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-md"
            >
              <Download className="w-4 h-4 text-slate-300" />
              CSV
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md shadow-emerald-500/20"
            >
              <FileDown className="w-4 h-4" />
              Gerar PDF
            </button>
          </div>
        </div>

        {/* Report Settings Panel */}
        {showSettings && (
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-2 opacity-100">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Título do Relatório</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Pesquisador / Lab</label>
                <input
                  type="text"
                  value={reportAuthor}
                  placeholder="Ex: Dra. Jane Doe - Lab de Imunologia"
                  onChange={e => setReportAuthor(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Observações / Conclusões</label>
                <textarea
                  value={reportNotes}
                  placeholder="Adicione notas que serão impressas no final do relatório..."
                  onChange={e => setReportNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            
            {/* Logo Uploader Column */}
            <div className="flex flex-col items-center justify-center border-l border-gray-100 pl-6">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 w-full text-center">Logotipo do Laboratório</label>
              <LogoUploader logo={logo} onLogoChange={setLogo} />
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <AffinityChart ref={chartRef} data={filteredData} />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Table2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Planilha de Resultados</h3>
          </div>
        </div>
        <ResultsTable data={data} affinityFilter={affinityFilter} />
      </div>

      {/* Hidden PDF Component */}
      <div style={{ display: 'none' }}>
        <PdfReport
          ref={printRef}
          data={filteredData}
          logo={logo}
          chartImageBase64={chartImage}
          metadata={metadata}
          customProps={{ reportTitle, reportAuthor, reportNotes }}
        />
      </div>
    </div>
  );
}
