import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Microscope, ArrowLeft } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import TCellPredictor from './pages/TCellPredictor';
import VariantComparison from './pages/VariantComparison';

import Sobre from './pages/Sobre';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] font-sans">
      {/* Navbar Complexa e Organizada */}
      <header className="bg-[#1a202c] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo e Branding */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-1.5 bg-blue-500 rounded-md shadow-sm group-hover:bg-blue-400 transition-colors">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[1.1rem] leading-none tracking-tight">
                  Immuno<span className="text-blue-400">Report</span>
                </span>
                <span className="text-[0.65rem] text-gray-400 uppercase tracking-widest font-bold mt-1">
                  Catálogo de Predição
                </span>
              </div>
            </Link>

            {/* Menu Principal (Abas) */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                Início
              </Link>
              <Link to="/sobre" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                Sobre
              </Link>
            </nav>

          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Rodapé */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} ImmunoReport. Plataforma in silico.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>Desenvolvido com IEDB API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/tcell" element={<Layout><TCellPredictor /></Layout>} />
        <Route path="/pepvcomp" element={<Layout><VariantComparison /></Layout>} />
        <Route path="/sobre" element={<Layout><Sobre /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
