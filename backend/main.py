import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from iedb_client import call_iedb, IEDBError
from data_engine import parse_iedb_response

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="ImmunoReport API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    sequences: str
    alleles: list[str]
    lengths: list[int]
    method: str = "netmhcpan_el"

    @field_validator("sequences")
    @classmethod
    def sequences_not_empty(cls, v: str) -> str:
        if not v.strip(): raise ValueError("Nenhuma sequência fornecida.")
        return v.strip()

    @field_validator("alleles")
    @classmethod
    def alleles_not_empty(cls, v: list[str]) -> list[str]:
        if not v: raise ValueError("Selecione ao menos um alelo.")
        return v

    @field_validator("lengths")
    @classmethod
    def lengths_not_empty(cls, v: list[int]) -> list[int]:
        if not v: raise ValueError("Selecione ao menos um comprimento.")
        return v

class PredictResponse(BaseModel):
    results: list[dict]
    total: int

class Pair(BaseModel):
    id: str
    wt: str
    mut: str

class CompareRequest(BaseModel):
    pairs: list[Pair]
    alleles: list[str]
    method: str = "netmhcpan_el"

    @field_validator("pairs")
    @classmethod
    def pairs_not_empty(cls, v: list[Pair]) -> list[Pair]:
        if not v: raise ValueError("Forneça ao menos um par de peptídeos.")
        return v

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    allele_list, length_list = [], []
    for allele in request.alleles:
        for length in request.lengths:
            allele_list.append(allele)
            length_list.append(str(length))
            
    try:
        raw = await call_iedb(request.method, request.sequences, ",".join(allele_list), ",".join(length_list))
        results = parse_iedb_response(raw)
        return PredictResponse(results=results, total=len(results))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compare")
async def compare(request: CompareRequest):
    # 1. Extrair todos os peptídeos únicos
    unique_peptides = set()
    lengths = set()
    for pair in request.pairs:
        wt, mut = pair.wt.strip().upper(), pair.mut.strip().upper()
        unique_peptides.add(wt)
        unique_peptides.add(mut)
        lengths.add(len(wt))
        lengths.add(len(mut))

    if not unique_peptides:
        raise HTTPException(status_code=400, detail="Sequências inválidas.")

    seq_text = "\n".join(unique_peptides)
    
    # 2. Preparar listas pro IEDB (Produto cartesiano Alleles x Lengths)
    allele_list, length_list = [], []
    for allele in request.alleles:
        for length in lengths:
            allele_list.append(allele)
            length_list.append(str(length))

    try:
        # 3. Chamar API
        raw = await call_iedb(request.method, seq_text, ",".join(allele_list), ",".join(length_list))
        results = parse_iedb_response(raw)
        
        # 4. Criar dicionário de busca rápida
        # Chave: (alelo, peptideo) -> melhor resultado
        lookup = {}
        for r in results:
            key = (r["allele"], r["peptide"])
            if key not in lookup or r["percentile_rank"] < lookup[key]["percentile_rank"]:
                lookup[key] = r

        # 5. Parear WT vs MUT
        comparisons = []
        for pair in request.pairs:
            wt, mut = pair.wt.strip().upper(), pair.mut.strip().upper()
            for allele in request.alleles:
                wt_res = lookup.get((allele, wt))
                mut_res = lookup.get((allele, mut))
                
                if wt_res and mut_res:
                    fold_change = wt_res["percentile_rank"] / mut_res["percentile_rank"] if mut_res["percentile_rank"] > 0 else 0
                    
                    # Classificação: Mutante escapou? (WT strong, MUT weak)
                    escape = False
                    if wt_res["percentile_rank"] <= 2.0 and mut_res["percentile_rank"] > 2.0:
                        escape = True

                    comparisons.append({
                        "id": pair.id,
                        "allele": allele,
                        "wt_peptide": wt,
                        "mut_peptide": mut,
                        "wt_rank": wt_res["percentile_rank"],
                        "mut_rank": mut_res["percentile_rank"],
                        "wt_affinity": wt_res["binding_affinity"],
                        "mut_affinity": mut_res["binding_affinity"],
                        "fold_change": fold_change,
                        "escape": escape
                    })

        return {"results": comparisons, "total": len(comparisons)}

    except Exception as e:
        logger.exception("Error in comparison")
        raise HTTPException(status_code=500, detail=str(e))

# Servir Frontend Estático (Apenas em Produção)
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.isdir(frontend_path):
    # Monta a pasta assets estática
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")
    
    # Rota genérica para SPA (React Router)
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        file_path = os.path.join(frontend_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_path, "index.html"))
else:
    logger.warning("Pasta frontend/dist não encontrada. FastAPI rodará apenas como API.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
