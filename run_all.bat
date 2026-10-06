@echo off
echo ==============================================
echo Inciando ImmunoReport (Frontend e Backend)
echo ==============================================

echo Instalando dependencias do backend...
cd backend
pip install -r requirements.txt
playwright install chromium

echo Iniciando Backend na porta 8000...
start cmd /k "python main.py"

cd ..\frontend
echo Instalando dependencias do frontend...
npm install

echo Iniciando Frontend (Vite)...
start cmd /k "npm run dev"

echo Tudo iniciado! O Frontend abrira em http://localhost:5173
