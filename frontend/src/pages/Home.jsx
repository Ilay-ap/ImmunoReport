import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, GitCompare, Microscope } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-20">
      
      {/* Banner Principal */}
      <div className="bg-[#1a202c] border-b-[3px] border-blue-500 shadow-md">
        <div className="max-w-[900px] mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Catálogo de Predição
          </h1>
        </div>
      </div>

      {/* Grid de Ferramentas */}
      <div className="max-w-[1200px] mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card: T Cell Prediction */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <Microscope className="w-14 h-14 text-blue-400 relative z-10 drop-shadow-md" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">MHC Class I</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">T Cell Prediction</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">Predição de ligação ao complexo principal de histocompatibilidade classe I.</p>
              <Link to="/tcell" className="block w-full text-center bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

          {/* Card: T Cell Prediction Class II */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <Microscope className="w-14 h-14 text-green-400 relative z-10 drop-shadow-md" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1.5">MHC Class II</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">T Cell Prediction II</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">Predição de ligação ao complexo principal de histocompatibilidade classe II.</p>
              <Link to="/tcell-ii" className="block w-full text-center bg-green-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

          {/* Card: B Cell Prediction */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <ShieldCheck className="w-14 h-14 text-pink-400 relative z-10 drop-shadow-md" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1.5">Linear Epitopes</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">B Cell Prediction</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">Predição de epítopos lineares de células B baseado em características físico-químicas.</p>
              <Link to="/bcell" className="block w-full text-center bg-pink-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-pink-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

          {/* Card: Variant Comparison */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <GitCompare className="w-14 h-14 text-purple-400 relative z-10 drop-shadow-md" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1.5">Local Tool</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Variant Comparison</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">Compare sequências selvagens (WT) com variantes (MT) de forma local.</p>
              <Link to="/pepvcomp" className="block w-full text-center bg-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

          

          

          

          

          

          


          {/* Card: Epitope Cluster */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <ShieldCheck className="w-14 h-14 text-orange-400 relative z-10 drop-shadow-md" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1.5">NextGen Pipeline</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Epitope Cluster</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">Group peptides by sequence identity</p>
              <Link to="/cluster" className="block w-full text-center bg-orange-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-orange-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

          {/* Card: Conservancy */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <ShieldCheck className="w-14 h-14 text-teal-400 relative z-10 drop-shadow-md" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1.5">NextGen Pipeline</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Conservancy</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">Calculate the degree of conservancy of a set of epitopes within a given set of protein sequences</p>
              <Link to="/conservancy" className="block w-full text-center bg-teal-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

          {/* Card: PepSySco */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <ShieldCheck className="w-14 h-14 text-blue-400 relative z-10 drop-shadow-md" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">NextGen Pipeline</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">PepSySco</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">Predict the likelihood that a peptide can be synthesized successfully</p>
              <Link to="/pepsysco" className="block w-full text-center bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

          {/* Card: PEPMatch */}
          <div className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>
              <ShieldCheck className="w-14 h-14 text-indigo-400 relative z-10 drop-shadow-md" />
            </div>
            <div className="p-5 flex flex-col flex-grow bg-white">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1.5">NextGen Pipeline</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">PEPMatch</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow mb-5">Search for closely related peptides in a reference proteome</p>
              <Link to="/pepmatch" className="block w-full text-center bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Acessar Ferramenta
              </Link>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
