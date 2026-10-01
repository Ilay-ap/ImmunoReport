import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, GitCompare } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-20">
      
      {/* Banner Principal - Com Cor, Sem subtítulo */}
      <div className="bg-[#1a202c] border-b-[3px] border-blue-500 shadow-md">
        <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Catálogo Analítico Imunológico
          </h1>
        </div>
      </div>

      {/* Grid de Ferramentas - Fundo Branco Clássico */}
      <div className="max-w-[850px] mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* Card 1: T Cell Prediction */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Topo do Card */}
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <ShieldCheck className="w-14 h-14 text-blue-400 relative z-10 drop-shadow-md" />
            </div>
            
            {/* Corpo do Card */}
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">Predição Estrutural</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">T Cell Prediction</h3>
              <p className="text-xs italic text-gray-500 mb-3 pb-3 border-b border-gray-100">MHC Class I Affinity</p>
              
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">
                Avalie a afinidade de peptídeos. Calcula o produto cartesiano de alelos, suporta FASTA e gera relatórios via categorização (Strong/Weak).
              </p>
              
              <Link to="/tcell" className="block w-full text-center bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

          {/* Card 2: Variant Comparison */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Topo do Card */}
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <GitCompare className="w-14 h-14 text-emerald-400 relative z-10 drop-shadow-md" />
            </div>
            
            {/* Corpo do Card */}
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Mapeamento de Escape</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Variant Comparison</h3>
              <p className="text-xs italic text-gray-500 mb-3 pb-3 border-b border-gray-100">Wild Type vs Mutante</p>
              
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">
                Compare o impacto de mutações no escape imunológico. Processamento simultâneo para cálculo preciso de Fold Change em pares WT vs MUT.
              </p>
              
              <Link to="/pepvcomp" className="block w-full text-center bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
