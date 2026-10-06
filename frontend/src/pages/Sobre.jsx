import React from 'react';
import { Microscope, ShieldCheck, GitCompare, Grid, Search, FlaskConical } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Sobre o ImmunoReport</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
          <p>
            O <strong>ImmunoReport</strong> é um portal bioinformático projetado para fornecer ferramentas de predição de classe mundial para pesquisadores e imunologistas. Inspirado pelas mais robustas plataformas governamentais e acadêmicas (como o IEDB), nosso catálogo visa centralizar análises <em>in silico</em> em uma interface moderna e rápida.
          </p>

          <p>
            Nossa plataforma integra tanto as <strong>Ferramentas Clássicas (Síncronas)</strong>, que entregam resultados instantâneos, quanto as inovadoras ferramentas da <strong>Nova Geração (NextGen Pipeline)</strong> do IEDB, voltadas para análises genômicas complexas em larga escala.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-6 border-b pb-2">Ferramentas Síncronas (Resposta Rápida)</h3>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1"><Microscope className="w-5 h-5" /></div>
              <div>
                <strong className="text-gray-900 text-lg">T Cell Prediction (Class I & Class II)</strong>
                <p className="text-sm mt-1">Predição de afinidade de ligação ao complexo principal de histocompatibilidade (MHC). Permite processar sequências FASTA inteiras, combinando-as com múltiplos alelos e comprimentos.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600 mt-1"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <strong className="text-gray-900 text-lg">B Cell Prediction</strong>
                <p className="text-sm mt-1">Predição de epítopos lineares de células B, avaliando características físico-químicas como hidrofilicidade (Parker) e acessibilidade (Emini).</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1"><GitCompare className="w-5 h-5" /></div>
              <div>
                <strong className="text-gray-900 text-lg">Variant Comparison</strong>
                <p className="text-sm mt-1">Focada na análise de mutações. Permite comparar rapidamente o peptídeo Selvagem (Wild Type) com a sua Variante (Mutante), calculando o <em>Fold Change</em> e alertando sobre possíveis escapes imunológicos.</p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b pb-2">Ferramentas NextGen (Pipeline Assíncrona)</h3>
          <p className="text-sm bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800">
            <strong>Nota:</strong> Estas ferramentas utilizam a arquitetura avançada de filas do IEDB. Por envolverem cálculos computacionais massivos contra proteomas inteiros, seus resultados podem demorar alguns minutos para serem consolidados.
          </p>

          <div className="space-y-4 mt-4">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600 mt-1"><Grid className="w-5 h-5" /></div>
              <div>
                <strong className="text-gray-900 text-lg">Epitope Cluster</strong>
                <p className="text-sm mt-1">Agrupa peptídeos com base na identidade de sequência, facilitando a identificação de padrões em grandes bibliotecas de epítopos.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-600 mt-1"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <strong className="text-gray-900 text-lg">Conservancy</strong>
                <p className="text-sm mt-1">Calcula o grau de conservação evolutiva de um conjunto de epítopos dentro de uma família de proteínas fornecida pelo usuário.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mt-1"><Search className="w-5 h-5" /></div>
              <div>
                <strong className="text-gray-900 text-lg">PEPMatch</strong>
                <p className="text-sm mt-1">Busca ocorrências exatas ou aproximadas de peptídeos em proteomas de referência globais.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1"><FlaskConical className="w-5 h-5" /></div>
              <div>
                <strong className="text-gray-900 text-lg">PepSySco</strong>
                <p className="text-sm mt-1">Prevê a viabilidade técnica e a probabilidade de um peptídeo ser sintetizado com sucesso em laboratório (Peptide Synthesis Score).</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Privacidade e Dados</h3>
          <p>
            Todo o processamento é orquestrado através de proxies seguros. Nenhuma sequência genética ou dado de pesquisa é armazenado permanentemente em nossos servidores, garantindo confidencialidade total para pesquisas não publicadas. Algoritmos removidos do nosso catálogo (como AXEL-F ou PDBs diretos) foram retirados para preservar a estabilidade da sua experiência.
          </p>
        </div>
      </div>
    </div>
  );
}
