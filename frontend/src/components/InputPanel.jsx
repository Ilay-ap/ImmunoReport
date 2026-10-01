import React, { useState, useMemo } from 'react';
import { FlaskConical, Send, AlertTriangle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { sanitizeInput, validateSequences } from '../utils/fastaParser';
import { COMMON_ALLELES, PREDICTION_METHODS, PEPTIDE_LENGTHS } from '../constants/alleles';
import AllelePicker from './AllelePicker';

const EXAMPLE_SEQUENCES = `>Spike_SARS_CoV_2_Fragment
MFVFLVLLPLVSSQCVNLTTRTQLPPAYTNSFTRGVYYPDKVFR
>Tumor_Antigen_NY_ESO_1
MQAEGRGTGGSTGDADGPGGPGIPDGPGGNAGGPGEAGATGGRGPRGAGA
>Influenza_A_Matrix_Protein
MSLLTEVETYVLSIIPSGPLKAEIAQRLEDVFAGKNTDLEALMEWLKTRP`;

export default function InputPanel({ onSubmit, isLoading }) {
  const [rawSequences, setRawSequences] = useState('');
  const [selectedAlleles, setSelectedAlleles] = useState(['HLA-A*02:01']);
  const [selectedLengths, setSelectedLengths] = useState([9]);
  const [method, setMethod] = useState('netmhcpan_el');

  const validation = useMemo(() => validateSequences(rawSequences), [rawSequences]);
  const canSubmit = validation.isValid && selectedAlleles.length > 0 && selectedLengths.length > 0 && !isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const sanitized = sanitizeInput(rawSequences);
    onSubmit({
      sequences: sanitized,
      alleles: selectedAlleles,
      lengths: selectedLengths,
      method,
    });
  };

  const toggleLength = (len) => {
    if (selectedLengths.includes(len)) {
      if (selectedLengths.length === 1) {
        toast.error('Selecione ao menos um comprimento.');
        return;
      }
      setSelectedLengths(selectedLengths.filter(l => l !== len));
    } else {
      setSelectedLengths([...selectedLengths, len]);
    }
  };

  const loadExamples = () => {
    setRawSequences(EXAMPLE_SEQUENCES);
    setSelectedAlleles(['HLA-A*02:01', 'HLA-B*07:02']);
    setSelectedLengths([9, 10]);
    toast.success('Sequências de exemplo carregadas!');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100/50 text-blue-600 rounded-xl shadow-inner">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Dados da Pesquisa</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Predição algorítmica de epítopos de células T e afinidade ao complexo MHC Classe I</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 bg-white">
        {/* Sequence textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Sequências de Aminoácidos (FASTA)
            </label>
            <button
              type="button"
              onClick={loadExamples}
              className="text-xs flex items-center gap-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Carregar Exemplos
            </button>
          </div>
          <textarea
            value={rawSequences}
            onChange={(e) => setRawSequences(e.target.value)}
            placeholder=">Nome_da_Proteina&#10;SLYNTVATLYCVHQRIDV&#10;>Outra_Proteina&#10;MFVFLVLLPLVSSQCVNL"
            rows={7}
            className="w-full font-mono text-sm px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-y placeholder-gray-400 bg-slate-50/50"
          />
          {rawSequences.trim() && !validation.isValid && (
            <div className="mt-2 space-y-1 p-3 bg-red-50 rounded-lg border border-red-100">
              {validation.errors.map((err, i) => (
                <p key={i} className="text-sm text-red-600 flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  {err}
                </p>
              ))}
            </div>
          )}
          {validation.isValid && rawSequences.trim() && (
            <p className="mt-2 text-sm text-emerald-600 font-medium px-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {validation.sequenceCount} sequência(s) válida(s) detectada(s)
            </p>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Parameters grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Peptide Length */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Comprimento (K-mers)
            </label>
            <div className="flex gap-2 flex-wrap">
              {PEPTIDE_LENGTHS.map(len => (
                <button
                  key={len}
                  type="button"
                  onClick={() => toggleLength(len)}
                  className={`px-3.5 py-1.5 text-sm font-bold rounded-lg border-2 transition-all ${
                    selectedLengths.includes(len)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Prediction Method */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Método Algorítmico
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
            >
              {PREDICTION_METHODS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* MHC Alleles */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Alelos HLA (Classe I)
            </label>
            <AllelePicker
              alleles={COMMON_ALLELES}
              selected={selectedAlleles}
              onChange={setSelectedAlleles}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send className="w-4 h-4" />
            Processar Predições
          </button>
        </div>
      </div>
    </form>
  );
}
