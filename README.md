# ImmunoReport — Gerador Inteligente de Relatórios Imunológicos

Uma aplicação web full-stack para predição de ligação de peptídeos a moléculas MHC Classe I,
utilizando integração com a API do IEDB (Immune Epitope Database).

## Arquitetura

```
immunoreport/
├── backend/          # FastAPI (Python) — Proxy + Data Engine
│   ├── main.py       # Rotas e configuração do servidor
│   ├── iedb_client.py  # Cliente HTTP assíncrono para o IEDB
│   └── data_engine.py  # Parser TSV + classificação semáforo
│
└── frontend/         # React (Vite) + TailwindCSS + Recharts
    └── src/
        ├── components/   # InputPanel, Dashboard, ResultsTable, etc.
        ├── utils/        # fastaParser, pdfExport
        └── constants/    # Alelos e métodos disponíveis
```

## Pré-requisitos

- **Python 3.11+**
- **Node.js 20+** (com npm)

## Instalação e Execução

### Backend (Terminal 1)

```bash
cd immunoreport/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend (Terminal 2)

```bash
cd immunoreport/frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Funcionalidades

- **Entrada de Dados**: Suporte a formato FASTA e texto simples, com validação em tempo real
- **Seleção de Parâmetros**: Multi-select de alelos HLA, comprimentos de peptídeos (8-11), métodos de predição
- **Proxy IEDB**: Backend FastAPI como proxy para evitar CORS/Mixed Content
- **Classificação Semáforo**: Strong (≤0.5), Intermediate (≤2.0), Weak (>2.0) baseado no percentile_rank
- **Dashboard Interativo**: Tabela paginada/ordenável + gráfico de linhas com eixo Y invertido
- **Exportação PDF**: Relatório acadêmico completo com logo, metadados, gráfico e tabela não-paginada
- **Upload de Logo**: Drag-and-drop para personalização do relatório PDF

## API do IEDB

Endpoint utilizado: `http://tools-cluster-interface.iedb.org/tools_api/mhci/`

Método padrão: NetMHCpan 4.1 EL (IEDB Recommended)
