# Makefile para proyecto Atmos
# Compatible con Linux, Mac y Windows (con make instalado)

.PHONY: help setup backend frontend migrate migrations superuser test-backend test-frontend build clean

# Colores para output
GREEN=\033[0;32m
YELLOW=\033[1;33m
CYAN=\033[0;36m
NC=\033[0m # No Color

# Comando por defecto
help:
	@echo ""
	@echo "$(CYAN)🌤️  Atmos - Comandos Disponibles$(NC)"
	@echo ""
	@echo "$(YELLOW)Setup:$(NC)"
	@echo "  make setup              - Configurar todo (backend + frontend)"
	@echo ""
	@echo "$(GREEN)Desarrollo:$(NC)"
	@echo "  make backend            - Ejecutar servidor backend"
	@echo "  make frontend           - Ejecutar servidor frontend"
	@echo ""
	@echo "$(CYAN)Base de Datos:$(NC)"
	@echo "  make migrate            - Aplicar migraciones"
	@echo "  make migrations         - Crear migraciones"
	@echo "  make superuser          - Crear superusuario admin"
	@echo ""
	@echo "$(YELLOW)Tests:$(NC)"
	@echo "  make test-backend       - Ejecutar tests backend"
	@echo "  make test-frontend      - Ejecutar tests frontend"
	@echo ""
	@echo "$(GREEN)Build:$(NC)"
	@echo "  make build              - Build producción frontend"
	@echo ""
	@echo "$(CYAN)Utilidades:$(NC)"
	@echo "  make clean              - Limpiar archivos temporales"
	@echo ""

# Configuración completa del proyecto
setup:
	@echo ""
	@echo "$(CYAN)⚙️  Configurando Atmos...$(NC)"
	@echo ""
	@echo "$(YELLOW)📦 Configurando backend...$(NC)"
	@cd backend && python -m venv venv
	@echo "$(GREEN)   ✅ Entorno virtual creado$(NC)"
	@echo ""
	@echo "$(YELLOW)   Activar entorno virtual:$(NC)"
ifeq ($(OS),Windows_NT)
	@echo "   .\backend\venv\Scripts\Activate.ps1"
else
	@echo "   source backend/venv/bin/activate"
endif
	@echo ""
	@echo "$(YELLOW)   Instalar dependencias:$(NC)"
	@echo "   cd backend && pip install -r requirements.txt"
	@echo ""
	@echo "$(YELLOW)📦 Configurando frontend...$(NC)"
	@command -v pnpm >/dev/null 2>&1 || { echo "$(YELLOW)⚠️  pnpm no está instalado. Usa: npm install -g pnpm$(NC)"; }
	@cd frontend && pnpm install
	@echo "$(GREEN)   ✅ Dependencias instaladas$(NC)"
	@echo ""
	@echo "$(GREEN)✅ Setup completado$(NC)"
	@echo ""
	@echo "$(CYAN)Próximos pasos:$(NC)"
	@echo "  1. Activa el entorno virtual (ver arriba)"
	@echo "  2. make migrate          - Aplicar migraciones"
	@echo "  3. make superuser        - Crear admin"
	@echo "  4. make backend          - Iniciar backend"
	@echo "  5. make frontend         - Iniciar frontend (en otra terminal)"
	@echo ""

# Iniciar servidor backend Django
backend:
	@echo ""
	@echo "$(YELLOW)🚀 Iniciando backend Django...$(NC)"
	@echo ""
	@echo "Backend disponible en: $(GREEN)http://127.0.0.1:8000$(NC)"
	@echo ""
ifeq ($(OS),Windows_NT)
	@cd backend && venv\Scripts\python.exe manage.py runserver
else
	@cd backend && venv/bin/python manage.py runserver
endif

# Iniciar servidor frontend
frontend:
	@echo ""
	@echo "$(YELLOW)🚀 Iniciando frontend React + Vite...$(NC)"
	@echo ""
	@echo "Frontend disponible en: $(GREEN)http://localhost:5173$(NC)"
	@echo ""
	@cd frontend && pnpm dev

# Aplicar migraciones de base de datos
migrate:
	@echo ""
	@echo "$(CYAN)🗄️  Aplicando migraciones...$(NC)"
	@echo ""
ifeq ($(OS),Windows_NT)
	@cd backend && venv\Scripts\python.exe manage.py migrate
else
	@cd backend && venv/bin/python manage.py migrate
endif
	@echo ""
	@echo "$(GREEN)✅ Migraciones aplicadas$(NC)"
	@echo ""

# Crear nuevas migraciones
migrations:
	@echo ""
	@echo "$(CYAN)📝 Creando migraciones...$(NC)"
	@echo ""
ifeq ($(OS),Windows_NT)
	@cd backend && venv\Scripts\python.exe manage.py makemigrations
else
	@cd backend && venv/bin/python manage.py makemigrations
endif
	@echo ""

# Crear superusuario
superuser:
	@echo ""
	@echo "$(CYAN)👤 Creando superusuario...$(NC)"
	@echo ""
ifeq ($(OS),Windows_NT)
	@cd backend && venv\Scripts\python.exe manage.py createsuperuser
else
	@cd backend && venv/bin/python manage.py createsuperuser
endif

# Ejecutar tests backend
test-backend:
	@echo ""
	@echo "$(YELLOW)🧪 Ejecutando tests backend...$(NC)"
	@echo ""
ifeq ($(OS),Windows_NT)
	@cd backend && venv\Scripts\pytest.exe -v
else
	@cd backend && venv/bin/pytest -v
endif
	@echo ""

# Ejecutar tests frontend (si existen)
test-frontend:
	@echo ""
	@echo "$(YELLOW)🧪 Ejecutando tests frontend...$(NC)"
	@echo ""
	@cd frontend && pnpm test || echo "$(YELLOW)⚠️  No hay tests configurados$(NC)"
	@echo ""

# Build de producción frontend
build:
	@echo ""
	@echo "$(CYAN)📦 Construyendo frontend para producción...$(NC)"
	@echo ""
	@cd frontend && pnpm build
	@echo ""
	@echo "$(GREEN)✅ Build completado en frontend/dist$(NC)"
	@echo ""

# Limpiar archivos temporales
clean:
	@echo ""
	@echo "$(YELLOW)🧹 Limpiando archivos temporales...$(NC)"
	@echo ""
	@echo "   Limpiando Python cache..."
	@find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "   Limpiando node_modules..."
	@rm -rf frontend/node_modules 2>/dev/null || true
	@echo "   Limpiando build frontend..."
	@rm -rf frontend/dist 2>/dev/null || true
	@rm -rf frontend/.vite 2>/dev/null || true
	@echo ""
	@echo "$(GREEN)✅ Limpieza completada$(NC)"
	@echo "$(CYAN)💡 Ejecuta 'make setup' para reinstalar$(NC)"
	@echo ""
