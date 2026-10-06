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
  const [sortOrder, setSortOrder] = useState('rank_asc');
  const [chartImage, setChartImage] = useState(null);
  
  // Customize Report State
  const [logo, setLogo] = useState(null);
  const [reportTitle, setReportTitle] = useState('Relatório de Predição Imunológica (MHC-I)');
  const [reportAuthor, setReportAuthor] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const chartRef = useRef(null);
  const printRef = useRef(null);

  let filteredData = affinityFilter === 'All' 
    ? [...data]
    : data.filter(r => r.binding_affinity === affinityFilter);

  // Apply Sorting
  filteredData.sort((a, b) => {
    const getVal = (row) => row.percentile_rank !== undefined ? row.percentile_rank : (row.score || 0);
    const getPos = (row) => row.start !== undefined ? row.start : (row.position || 0);
    
    if (sortOrder === 'rank_asc') return getVal(a) - getVal(b);
    if (sortOrder === 'rank_desc') return getVal(b) - getVal(a);
    if (sortOrder === 'position_asc') return getPos(a) - getPos(b);
    if (sortOrder === 'allele') return (a.allele || '').localeCompare(b.allele || '');
    return 0;
  });

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
        score: 'Score', position: 'Posição', residue: 'Resíduo'
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
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Settings2 className="w-4 h-4" />
              Personalizar Relatório
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
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-6 animate-in slide-in-from-top-2 opacity-100 bg-slate-50/50 p-6 -mx-6 -mb-6 rounded-b-2xl">
            
            {/* Seção 1: Filtros e Ordenação */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-500" /> Filtros e Ordenação de Dados
              </h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1.5 w-full sm:w-64">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filtrar por Afinidade</label>
                  <select
                    value={affinityFilter}
                    onChange={(e) => setAffinityFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-gray-700 shadow-sm"
                  >
                    <option value="All">Mostrar Todos (Sem filtro)</option>
                    <option value="Strong">Apenas Strong</option>
                    <option value="Intermediate">Apenas Intermediate</option>
                    <option value="Weak">Apenas Weak</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 w-full sm:w-64">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ordenar Resultados Por</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium text-gray-700 shadow-sm"
                  >
                    <option value="rank_asc">Menor Rank (Maior Afinidade)</option>
                    <option value="rank_desc">Maior Rank (Menor Afinidade)</option>
                    <option value="position_asc">Ordem na Sequência (Início)</option>
                    <option value="allele">Agrupar por Alelo</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Seção 2: Informações do Documento PDF */}
            <div>
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileDown className="w-4 h-4 text-blue-500" /> Informações Visuais do PDF
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Título do Relatório</label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={e => setReportTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome do Pesquisador / Lab</label>
                    <input
                      type="text"
                      value={reportAuthor}
                      placeholder="Ex: Dra. Jane Doe - Lab de Imunologia"
                      onChange={e => setReportAuthor(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Observações / Conclusões</label>
                    <textarea
                      value={reportNotes}
                      placeholder="Adicione notas que serão impressas no final do relatório..."
                      onChange={e => setReportNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none shadow-sm"
                    />
                  </div>
                </div>
                
                {/* Logo Uploader Column */}
                <div className="flex flex-col items-center justify-center border-l border-gray-200 pl-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 w-full text-center">Logotipo do Laboratório</label>
                  <LogoUploader logo={logo} onLogoChange={setLogo} />
                </div>
              </div>
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
