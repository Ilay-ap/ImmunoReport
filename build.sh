#!/usr/bin/env bash
# Exit on error
set -o errexit

echo ">>> Building Frontend (React/Vite)..."
cd frontend
npm install
npm run build
cd ..

echo ">>> Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo ">>> Build Complete!"
