import React, { useState } from 'react';
import { FlaskConical, Send, AlertTriangle, BookOpen } from 'lucide-react';
import { sanitizeInput, validateSequences } from '../utils/fastaParser';

const DEFAULT_EXAMPLES = `>Spike_SARS_CoV_2
MFVFLVLLPLVSSQCVNLTTRTQLPPAYTNSFTRGVYYPDKVFR
>Tumor_Antigen_NY_ESO_1
MQAEGRGTGGSTGDADGPGGPGIPDGPGGNAGGPGEAGATGGRGPRGAGA`;

const NextGenInputPanel = ({ onSubmit, isLoading, exampleSequences = DEFAULT_EXAMPLES, title = "Análise de Sequências" }) => {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState(null);

  const handleLoadExamples = () => {
    setInputText(exampleSequences);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('Por favor, insira uma sequência para análise.');
      return;
    }

    const sanitized = sanitizeInput(inputText);
    const validation = validateSequences(sanitized);

    if (!validation.isValid) {
      setError(validation.errors.join(' | '));
      return;
    }

    setError(null);
    onSubmit(sanitized);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <FlaskConical className="w-6 h-6" />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="sequence-input" className="block text-sm font-medium text-gray-700">
                Sequências (Formato FASTA)
              </label>
              <button
                type="button"
                onClick={handleLoadExamples}
                className="text-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Carregar Exemplos
              </button>
            </div>
            
            <textarea
              id="sequence-input"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (error) setError(null);
              }}
              rows={8}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm p-4 bg-gray-50 transition-colors border"
              placeholder=">Identificador da Sequência&#10;MTQ...&#10;&#10;Insira suas sequências em formato FASTA..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Analisando...' : 'Analisar Sequências'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NextGenInputPanel;
