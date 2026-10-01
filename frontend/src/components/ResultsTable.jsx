import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const PAGE_SIZE = 25;

function AffinityBadge({ affinity, color }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      {affinity}
    </span>
  );
}

// Function to map internal API keys to friendly column names
const formatHeader = (key) => {
  const labels = {
    allele: 'Alelo',
    seq_num: 'Seq #',
    start: 'Início',
    end: 'Fim',
    length: 'Tam.',
    peptide: 'Peptídeo',
    percentile_rank: 'Rank %',
    binding_affinity: 'Afinidade',
    ic50: 'IC50 (nM)',
    score: 'Score',
    ann_ic50: 'ANN IC50',
    ann_rank: 'ANN Rank',
    smm_ic50: 'SMM IC50',
    smm_rank: 'SMM Rank',
  };
  return labels[key] || key.replace(/_/g, ' ').toUpperCase();
};

export default function ResultsTable({ data, affinityFilter }) {
  const [sortKey, setSortKey] = useState('percentile_rank');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  // Extract all columns returned by API dynamically (excluding internal color_code)
  const availableKeys = useMemo(() => {
    if (!data || data.length === 0) return [];
    let keys = Object.keys(data[0]).filter(k => k !== 'color_code');
    // Ensure binding_affinity is always the last column
    keys = keys.filter(k => k !== 'binding_affinity');
    keys.push('binding_affinity');
    return keys;
  }, [data]);

  const filtered = useMemo(() => {
    let d = [...data];
    
    // Quick Affinity Filter
    if (affinityFilter !== 'All') {
      d = d.filter(r => r.binding_affinity === affinityFilter);
    }
    
    // Text Search
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      d = d.filter(r => 
        r.peptide?.toLowerCase().includes(lowerSearch) || 
        r.allele?.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    d.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return d;
  }, [data, affinityFilter, sortKey, sortDir, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const currentPage = page >= totalPages ? Math.max(0, totalPages - 1) : page;
  const pageData = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar inside table component */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por peptídeo ou alelo..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50 pb-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              {availableKeys.map(key => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 select-none transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    {formatHeader(key)}
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={availableKeys.length} className="px-4 py-8 text-center text-gray-500 text-sm">
                  Nenhum resultado encontrado para os filtros atuais.
                </td>
              </tr>
            ) : (
              pageData.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  {availableKeys.map(key => {
                    if (key === 'binding_affinity') {
                      return (
                        <td key={key} className="px-4 py-2.5 whitespace-nowrap">
                          <AffinityBadge affinity={row[key]} color={row.color_code} />
                        </td>
                      );
                    }
                    if (key === 'peptide' || key === 'allele') {
                      return (
                        <td key={key} className="px-4 py-2.5 text-sm font-mono font-bold text-gray-800 whitespace-nowrap">
                          {row[key]}
                        </td>
                      );
                    }
                    return (
                      <td key={key} className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                        {typeof row[key] === 'number' ? row[key].toFixed(3) : (row[key] !== null ? row[key] : '-')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500 font-medium">
          Mostrando {filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} de <span className="font-bold text-gray-700">{filtered.length}</span> resultados
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-600 min-w-[5rem] text-center">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
