# Makefile para Proyecto Atmos
# Comandos útiles para desarrollo

.PHONY: help setup-backend setup-frontend dev-backend dev-frontend clean

# Ayuda por defecto
help:
	@echo "🌤️  Atmos - Comandos Disponibles"
	@echo ""
	@echo "Backend:"
	@echo "  make setup-backend    - Configurar backend (venv + deps)"
	@echo "  make dev-backend      - Ejecutar servidor Django"
	@echo "  make migrate          - Aplicar migraciones"
	@echo "  make migrations       - Crear migraciones"
	@echo "  make superuser        - Crear superusuario"
	@echo ""
	@echo "Frontend:"
	@echo "  make setup-frontend   - Instalar dependencias frontend"
	@echo "  make dev-frontend     - Ejecutar servidor Vite"
	@echo ""
	@echo "General:"
	@echo "  make dev              - Ejecutar backend + frontend"
	@echo "  make clean            - Limpiar archivos temporales"

# Backend
setup-backend:
	@echo "⚙️  Configurando backend..."
	cd backend && python -m venv venv
	@echo "✅ Entorno virtual creado"
	@echo "💡 Activa el entorno con: cd backend && .\venv\Scripts\Activate.ps1"
	@echo "💡 Luego ejecuta: pip install -r requirements.txt"

dev-backend:
	@echo "🚀 Ejecutando backend Django..."
	cd backend && python manage.py runserver

migrate:
	@echo "📦 Aplicando migraciones..."
	cd backend && python manage.py migrate

migrations:
	@echo "📝 Creando migraciones..."
	cd backend && python manage.py makemigrations

superuser:
	@echo "👤 Creando superusuario..."
	cd backend && python manage.py createsuperuser

# Frontend
setup-frontend:
	@echo "⚙️  Instalando dependencias frontend..."
	cd frontend && pnpm install
	@echo "✅ Frontend configurado"

dev-frontend:
	@echo "🚀 Ejecutando frontend Vite..."
	cd frontend && pnpm dev

# General
dev:
	@echo "🚀 Para ejecutar ambos servidores:"
	@echo "   Terminal 1: make dev-backend"
	@echo "   Terminal 2: make dev-frontend"

clean:
	@echo "🧹 Limpiando archivos temporales..."
	rm -rf backend/__pycache__
	rm -rf backend/*/__pycache__
	rm -rf backend/*/*/__pycache__
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	rm -rf frontend/.vite
	@echo "✅ Limpieza completada"
