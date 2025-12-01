# Scripts PowerShell para Proyecto Atmos
# Comandos útiles para desarrollo en Windows

function Show-Help {
    Write-Host "🌤️  Atmos - Comandos Disponibles" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend:" -ForegroundColor Yellow
    Write-Host "  .\scripts.ps1 setup-backend    - Configurar backend (venv + deps)"
    Write-Host "  .\scripts.ps1 dev-backend      - Ejecutar servidor Django"
    Write-Host "  .\scripts.ps1 migrate          - Aplicar migraciones"
    Write-Host "  .\scripts.ps1 migrations       - Crear migraciones"
    Write-Host "  .\scripts.ps1 superuser        - Crear superusuario"
    Write-Host ""
    Write-Host "Frontend:" -ForegroundColor Green
    Write-Host "  .\scripts.ps1 setup-frontend   - Instalar dependencias frontend"
    Write-Host "  .\scripts.ps1 dev-frontend     - Ejecutar servidor Vite"
    Write-Host ""
    Write-Host "General:" -ForegroundColor Magenta
    Write-Host "  .\scripts.ps1 clean            - Limpiar archivos temporales"
}

function Setup-Backend {
    Write-Host "⚙️  Configurando backend..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    Write-Host "✅ Entorno virtual creado" -ForegroundColor Green
    Write-Host "💡 Activa el entorno con: .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
    Write-Host "💡 Luego ejecuta: pip install -r requirements.txt" -ForegroundColor Cyan
    Set-Location ..
}

function Dev-Backend {
    Write-Host "🚀 Ejecutando backend Django..." -ForegroundColor Yellow
    Set-Location backend
    
    if (-not (Test-Path "manage.py")) {
        Write-Host "❌ ERROR: No se encontró manage.py" -ForegroundColor Red
        Write-Host ""
        Write-Host "Parece que no has inicializado Django todavía." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Sigue estos pasos:" -ForegroundColor Cyan
        Write-Host "1. Activa el entorno virtual: .\venv\Scripts\Activate.ps1" -ForegroundColor White
        Write-Host "2. Instala dependencias: pip install -r requirements.txt" -ForegroundColor White
        Write-Host "3. Inicializa Django: django-admin startproject config ." -ForegroundColor White
        Write-Host "4. Aplica migraciones: python manage.py migrate" -ForegroundColor White
        Write-Host ""
        Write-Host "📖 Consulta: docs/backend-setup.md para más detalles" -ForegroundColor Cyan
        Set-Location ..
        return
    }
    
    python manage.py runserver
    Set-Location ..
}

function Run-Migrate {
    Write-Host "📦 Aplicando migraciones..." -ForegroundColor Yellow
    Set-Location backend
    python manage.py migrate
    Set-Location ..
}

function Run-Migrations {
    Write-Host "📝 Creando migraciones..." -ForegroundColor Yellow
    Set-Location backend
    python manage.py makemigrations
    Set-Location ..
}

function Create-Superuser {
    Write-Host "👤 Creando superusuario..." -ForegroundColor Yellow
    Set-Location backend
    python manage.py createsuperuser
    Set-Location ..
}

function Setup-Frontend {
    Write-Host "⚙️  Instalando dependencias frontend..." -ForegroundColor Green
    Set-Location frontend
    pnpm install
    Write-Host "✅ Frontend configurado" -ForegroundColor Green
    Set-Location ..
}

function Dev-Frontend {
    Write-Host "🚀 Ejecutando frontend Vite..." -ForegroundColor Green
    Set-Location frontend
    pnpm dev
    Set-Location ..
}

function Clean-All {
    Write-Host "🧹 Limpiando archivos temporales..." -ForegroundColor Magenta
    
    # Limpiar Python
    Get-ChildItem -Path backend -Recurse -Filter "__pycache__" | Remove-Item -Recurse -Force
    Get-ChildItem -Path backend -Recurse -Filter "*.pyc" | Remove-Item -Force
    
    # Limpiar Frontend
    if (Test-Path "frontend/node_modules") {
        Remove-Item -Path "frontend/node_modules" -Recurse -Force
    }
    if (Test-Path "frontend/dist") {
        Remove-Item -Path "frontend/dist" -Recurse -Force
    }
    if (Test-Path "frontend/.vite") {
        Remove-Item -Path "frontend/.vite" -Recurse -Force
    }
    
    Write-Host "✅ Limpieza completada" -ForegroundColor Green
}

# Procesar argumentos
switch ($args[0]) {
    "setup-backend"   { Setup-Backend }
    "dev-backend"     { Dev-Backend }
    "migrate"         { Run-Migrate }
    "migrations"      { Run-Migrations }
    "superuser"       { Create-Superuser }
    "setup-frontend"  { Setup-Frontend }
    "dev-frontend"    { Dev-Frontend }
    "clean"           { Clean-All }
    default           { Show-Help }
}
