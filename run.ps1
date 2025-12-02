# run.ps1 - Script unificado para Atmos
# Uso: .\run.ps1 [comando]

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host ""
    Write-Host "🌤️  Atmos - Comandos Disponibles" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Setup:" -ForegroundColor Yellow
    Write-Host "  .\run.ps1 setup             - Configurar todo (backend + frontend)"
    Write-Host ""
    Write-Host "Desarrollo:" -ForegroundColor Green
    Write-Host "  .\run.ps1 backend           - Ejecutar servidor backend"
    Write-Host "  .\run.ps1 frontend          - Ejecutar servidor frontend"
    Write-Host ""
    Write-Host "Base de Datos:" -ForegroundColor Blue
    Write-Host "  .\run.ps1 migrate           - Aplicar migraciones"
    Write-Host "  .\run.ps1 migrations        - Crear migraciones"
    Write-Host "  .\run.ps1 superuser         - Crear superusuario admin"
    Write-Host ""
    Write-Host "Tests:" -ForegroundColor Magenta
    Write-Host "  .\run.ps1 test-backend      - Ejecutar tests backend"
    Write-Host "  .\run.ps1 test-frontend     - Ejecutar tests frontend (si existen)"
    Write-Host ""
    Write-Host "Build:" -ForegroundColor DarkYellow
    Write-Host "  .\run.ps1 build             - Build producción frontend"
    Write-Host ""
    Write-Host "Utilidades:" -ForegroundColor Gray
    Write-Host "  .\run.ps1 clean             - Limpiar archivos temporales"
    Write-Host "  .\run.ps1 help              - Mostrar esta ayuda"
    Write-Host ""
}

function Setup-All {
    Write-Host ""
    Write-Host "⚙️  Configurando Atmos..." -ForegroundColor Cyan
    Write-Host ""
    
    # Backend
    Write-Host "📦 Configurando backend..." -ForegroundColor Yellow
    if (!(Test-Path "backend/venv")) {
        Write-Host "   Creando entorno virtual..." -ForegroundColor Gray
        python -m venv backend/venv
        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "❌ Error al crear entorno virtual" -ForegroundColor Red
            Write-Host "💡 Asegúrate de tener Python 3.10+ instalado" -ForegroundColor Cyan
            Write-Host "💡 Ejecuta: python --version" -ForegroundColor Cyan
            return
        }
        Write-Host "   ✅ Entorno virtual creado" -ForegroundColor Green
    } else {
        Write-Host "   ✅ Entorno virtual ya existe" -ForegroundColor Green
    }
    
    Write-Host "   Instalando dependencias..." -ForegroundColor Gray
    & backend/venv/Scripts/python.exe -m pip install --quiet --upgrade pip
    & backend/venv/Scripts/pip.exe install --quiet -r backend/requirements.txt
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        Write-Host "💡 Revisa el archivo backend/requirements.txt" -ForegroundColor Cyan
        return
    }
    Write-Host "   ✅ Dependencias instaladas" -ForegroundColor Green
    
    Write-Host "   Aplicando migraciones..." -ForegroundColor Gray
    & backend/venv/Scripts/python.exe backend/manage.py migrate --no-input
    Write-Host "   ✅ Migraciones aplicadas" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "✅ Backend configurado correctamente" -ForegroundColor Green
    Write-Host ""
    
    # Frontend
    Write-Host "📦 Configurando frontend..." -ForegroundColor Yellow
    
    # Verificar pnpm
    $pnpmCheck = Get-Command pnpm -ErrorAction SilentlyContinue
    if (!$pnpmCheck) {
        Write-Host ""
        Write-Host "❌ pnpm no está instalado" -ForegroundColor Red
        Write-Host "💡 Instálalo con: npm install -g pnpm" -ForegroundColor Cyan
        Write-Host "💡 O usa npm en su lugar (más lento)" -ForegroundColor Cyan
        return
    }
    
    Write-Host "   Instalando dependencias..." -ForegroundColor Gray
    Set-Location frontend
    pnpm install --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        Write-Host "💡 Intenta: rm -r node_modules; pnpm install" -ForegroundColor Cyan
        Set-Location ..
        return
    }
    Set-Location ..
    Write-Host "   ✅ Dependencias instaladas" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "✅ Frontend configurado correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 ¡Todo listo!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor White
    Write-Host "  1. Inicia el backend:  .\run.ps1 backend" -ForegroundColor Gray
    Write-Host "  2. Inicia el frontend: .\run.ps1 frontend  (en otra terminal)" -ForegroundColor Gray
    Write-Host ""
}

function Start-Backend {
    Write-Host ""
    Write-Host "🚀 Iniciando backend Django..." -ForegroundColor Yellow
    Write-Host ""
    
    if (!(Test-Path "backend/venv")) {
        Write-Host "❌ Entorno virtual no encontrado" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        Write-Host ""
        return
    }
    
    if (!(Test-Path "backend/manage.py")) {
        Write-Host "❌ No se encontró manage.py" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Verifica que estés en la raíz del proyecto" -ForegroundColor Cyan
        Write-Host ""
        return
    }
    
    Write-Host "Backend disponible en: http://127.0.0.1:8000" -ForegroundColor Green
    Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
    Write-Host ""
    & backend/venv/Scripts/python.exe backend/manage.py runserver
}

function Start-Frontend {
    Write-Host ""
    Write-Host "🚀 Iniciando frontend Vite..." -ForegroundColor Green
    Write-Host ""
    
    if (!(Test-Path "frontend/node_modules")) {
        Write-Host "❌ Dependencias no encontradas" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        Write-Host ""
        return
    }
    
    Write-Host "Frontend disponible en: http://localhost:5173" -ForegroundColor Green
    Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
    Write-Host ""
    Set-Location frontend
    pnpm dev
    Set-Location ..
}

function Run-Migrate {
    Write-Host ""
    Write-Host "🗄️  Aplicando migraciones..." -ForegroundColor Blue
    Write-Host ""
    
    if (!(Test-Path "backend/venv")) {
        Write-Host "❌ Entorno virtual no encontrado" -ForegroundColor Red
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        return
    }
    
    & backend/venv/Scripts/python.exe backend/manage.py migrate
    Write-Host ""
    Write-Host "✅ Migraciones aplicadas" -ForegroundColor Green
    Write-Host ""
}

function Create-Migrations {
    Write-Host ""
    Write-Host "📝 Creando migraciones..." -ForegroundColor Blue
    Write-Host ""
    
    if (!(Test-Path "backend/venv")) {
        Write-Host "❌ Entorno virtual no encontrado" -ForegroundColor Red
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        return
    }
    
    & backend/venv/Scripts/python.exe backend/manage.py makemigrations
    Write-Host ""
}

function Create-Superuser {
    Write-Host ""
    Write-Host "👤 Creando superusuario..." -ForegroundColor Blue
    Write-Host ""
    
    if (!(Test-Path "backend/venv")) {
        Write-Host "❌ Entorno virtual no encontrado" -ForegroundColor Red
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        return
    }
    
    & backend/venv/Scripts/python.exe backend/manage.py createsuperuser
}

function Test-Backend {
    Write-Host ""
    Write-Host "🧪 Ejecutando tests backend..." -ForegroundColor Magenta
    Write-Host ""
    
    if (!(Test-Path "backend/venv")) {
        Write-Host "❌ Entorno virtual no encontrado" -ForegroundColor Red
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        return
    }
    
    & backend/venv/Scripts/python.exe -m pytest backend/ -v
    Write-Host ""
}

function Test-Frontend {
    Write-Host ""
    Write-Host "🧪 Ejecutando tests frontend..." -ForegroundColor Magenta
    Write-Host ""
    
    if (!(Test-Path "frontend/node_modules")) {
        Write-Host "❌ Dependencias no encontradas" -ForegroundColor Red
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        return
    }
    
    Set-Location frontend
    
    # Verificar si existe script de test
    $packageJson = Get-Content package.json | ConvertFrom-Json
    if ($packageJson.scripts.test) {
        pnpm test
    } else {
        Write-Host "⚠️  No hay tests configurados todavía" -ForegroundColor Yellow
        Write-Host "💡 Añade un script 'test' en package.json" -ForegroundColor Cyan
    }
    
    Set-Location ..
    Write-Host ""
}

function Build-Frontend {
    Write-Host ""
    Write-Host "🏗️  Construyendo frontend para producción..." -ForegroundColor DarkYellow
    Write-Host ""
    
    if (!(Test-Path "frontend/node_modules")) {
        Write-Host "❌ Dependencias no encontradas" -ForegroundColor Red
        Write-Host "💡 Ejecuta primero: .\run.ps1 setup" -ForegroundColor Cyan
        return
    }
    
    Set-Location frontend
    pnpm build
    Set-Location ..
    
    Write-Host ""
    Write-Host "✅ Build completado" -ForegroundColor Green
    Write-Host "📁 Archivos en: frontend/dist/" -ForegroundColor Gray
    Write-Host ""
}

function Clean-All {
    Write-Host ""
    Write-Host "🧹 Limpiando archivos temporales..." -ForegroundColor Gray
    Write-Host ""
    
    # Python
    Write-Host "   Limpiando archivos Python..." -ForegroundColor Gray
    Get-ChildItem -Path backend -Recurse -Filter "__pycache__" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force
    Get-ChildItem -Path backend -Recurse -Filter "*.pyc" -ErrorAction SilentlyContinue | Remove-Item -Force
    
    # Node
    Write-Host "   Limpiando archivos Node..." -ForegroundColor Gray
    if (Test-Path "frontend/node_modules") {
        Remove-Item "frontend/node_modules" -Recurse -Force
    }
    if (Test-Path "frontend/dist") {
        Remove-Item "frontend/dist" -Recurse -Force
    }
    if (Test-Path "frontend/.vite") {
        Remove-Item "frontend/.vite" -Recurse -Force
    }
    
    Write-Host ""
    Write-Host "✅ Limpieza completada" -ForegroundColor Green
    Write-Host "💡 Ejecuta .\run.ps1 setup para reinstalar" -ForegroundColor Cyan
    Write-Host ""
}

# Router de comandos
switch ($Command.ToLower()) {
    "setup"         { Setup-All }
    "backend"       { Start-Backend }
    "frontend"      { Start-Frontend }
    "migrate"       { Run-Migrate }
    "migrations"    { Create-Migrations }
    "superuser"     { Create-Superuser }
    "test-backend"  { Test-Backend }
    "test-frontend" { Test-Frontend }
    "build"         { Build-Frontend }
    "clean"         { Clean-All }
    "help"          { Show-Help }
    default {
        Write-Host ""
        Write-Host "❌ Comando desconocido: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
