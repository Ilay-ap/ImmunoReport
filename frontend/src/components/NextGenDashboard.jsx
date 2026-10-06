import React, { useState, useRef, useMemo, forwardRef } from 'react';
import { FileDown, Download, Settings2, Filter, BarChart3, Table2, CheckCircle, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter } from 'recharts';
import LogoUploader from './LogoUploader';
import { chartToBase64 } from '../utils/pdfExport';

// Subcomponents for printing
const PrintReport = forwardRef(({ data, title, author, notes, logo, chartImage, date }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white text-black min-h-screen">
      {/* Print header */}
      <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4 mb-6">
        <div>
          {logo && <img src={logo} alt="Logo" className="h-16 object-contain mb-4" />}
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">Autor: {author || 'Não especificado'}</p>
          <p className="text-gray-600">Data: {date}</p>
        </div>
      </div>

      {/* Chart */}
      {chartImage && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Análise Visual</h2>
          <img src={chartImage} alt="Gráfico" className="w-full max-w-3xl mx-auto" />
        </div>
      )}

      {/* Data Table */}
      <div className="mb-8">
         <h2 className="text-xl font-bold mb-4 border-b pb-2">Resultados</h2>
         {data && data.length > 0 ? (
           <table className="w-full text-sm text-left border-collapse">
             <thead>
               <tr className="bg-gray-100">
                 {Object.keys(data[0]).map(key => (
                   <th key={key} className="border p-2 font-semibold text-gray-700">{key}</th>
                 ))}
               </tr>
             </thead>
             <tbody>
               {data.map((row, i) => (
                 <tr key={i} className="border-b">
                   {Object.keys(data[0]).map(key => (
                     <td key={key} className="border p-2">
                       {row[key] !== undefined && row[key] !== null 
                         ? (typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key]))
                         : '-'}
                     </td>
                   ))}
                 </tr>
               ))}
             </tbody>
           </table>
         ) : (
           <p>Sem dados para exibir.</p>
         )}
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Observações</h2>
          <p className="whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-sm text-gray-500 text-center border-t pt-4">
        Gerado por ImmunoReport - Para fins de pesquisa.
      </div>
    </div>
  );
});

export default function NextGenDashboard({ data = [], title, defaultTitle, chartType = 'bar' }) {
  const [reportTitle, setReportTitle] = useState(defaultTitle || title || 'Relatório NextGen');
  const [author, setAuthor] = useState('');
  const [notes, setNotes] = useState('');
  const [logo, setLogo] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [chartImage, setChartImage] = useState(null);

  const printRef = useRef();
  const chartRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: reportTitle,
    onBeforeGetContent: async () => {
      if (chartRef.current) {
        const base64 = await chartToBase64(chartRef.current);
        setChartImage(base64);
      }
    }
  });

  const exportCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    return data.filter(row => 
      Object.values(row).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [data, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const itemsPerPage = 25;
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const numericColumns = useMemo(() => {
    if (!data || !data.length) return [];
    const firstRow = data[0];
    return Object.keys(firstRow).filter(key => {
      const val = firstRow[key];
      return typeof val === 'number' || (typeof val === 'string' && val.trim() !== '' && !isNaN(val));
    });
  }, [data]);

  const chartData = useMemo(() => {
    return data.slice(0, 100); // Limit for performance
  }, [data]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header / Summary Bar */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{reportTitle}</h1>
          <p className="text-gray-500">Total de registros processados: {data.length}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            <Settings2 size={18} /> Personalizar Relatório
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            <FileDown size={18} /> Exportar CSV
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            <Download size={18} /> Gerar PDF
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título do Relatório</label>
              <input 
                type="text" 
                value={reportTitle} 
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
              <input 
                type="text" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border rounded p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded p-2 h-24 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            <LogoUploader onLogoUpload={setLogo} currentLogo={logo} />
          </div>
        </div>
      )}

      {/* Chart Section */}
      {data.length > 0 && numericColumns.length > 0 && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow" ref={chartRef}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={20} /> Análise Gráfica
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'scatter' ? (
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={Object.keys(data[0])[0]} name="X" />
                  <YAxis dataKey={numericColumns[0]} name="Y" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Dados" data={chartData} fill="#3b82f6" />
                </ScatterChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={Object.keys(data[0])[0]} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={numericColumns[0]} fill="#3b82f6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Table2 size={20} /> Tabela de Dados
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {data.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {Object.keys(data[0]).map(key => (
                    <th 
                      key={key} 
                      className="p-3 cursor-pointer hover:bg-gray-100 font-semibold text-gray-700 whitespace-nowrap"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-1">
                        {key}
                        <ArrowUpDown size={14} className="text-gray-400" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    {Object.keys(data[0]).map(key => (
                      <td key={key} className="p-3 whitespace-nowrap">
                        {row[key] !== undefined && row[key] !== null 
                          ? (typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key]))
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">Nenhum dado encontrado.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length} registros
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Print Component */}
      <div style={{ display: 'none' }}>
        <PrintReport 
          ref={printRef}
          data={sortedData}
          title={reportTitle}
          author={author}
          notes={notes}
          logo={logo}
          chartImage={chartImage}
          date={new Date().toLocaleDateString('pt-BR')}
        />
      </div>
    </div>
  );
}
