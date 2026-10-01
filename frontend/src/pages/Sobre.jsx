import React from 'react';

export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Sobre o ImmunoReport</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
          <p>
            O <strong>ImmunoReport</strong> é um portal bioinformático projetado para fornecer ferramentas de predição de classe mundial para pesquisadores e imunologistas. Inspirado pelas mais robustas plataformas governamentais e acadêmicas (como o IEDB), nosso catálogo visa centralizar análises <em>in silico</em>.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Ferramentas Atuais</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>T Cell Prediction (Class I):</strong> Permite processar sequências FASTA inteiras, combinando-as com múltiplos alelos e comprimentos para gerar um mapa completo de afinidade imunológica.
            </li>
            <li>
              <strong>Variant Comparison:</strong> Focada na análise de mutações. Permite comparar rapidamente o peptídeo Selvagem (Wild Type) com a sua Variante (Mutante), calculando Fold Change e alertando sobre possíveis escapes imunológicos.
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Privacidade e Dados</h3>
          <p>
            Todo o processamento é orquestrado através de proxies seguros. Nenhuma sequência genética ou dado de pesquisa é armazenado permanentemente em nossos servidores, garantindo confidencialidade total para pesquisas não publicadas.
          </p>
        </div>
      </div>
    </div>
  );
}
