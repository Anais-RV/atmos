# Scripts PowerShell para Proyecto Atmos
# Comandos utiles para desarrollo en Windows

function Show-Help {
    Write-Host "Atmos - Comandos Disponibles" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend:" -ForegroundColor Yellow
    Write-Host "  .\scripts.ps1 setup-backend    - Configurar backend (venv + deps)"
    Write-Host "  .\scripts.ps1 dev-backend      - Ejecutar servidor Django"
    Write-Host "  .\scripts.ps1 migrate          - Aplicar migraciones"
    Write-Host "  .\scripts.ps1 virtual          - Activar entorno virtual"
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
    Write-Host "Configurando backend..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv venv
    Write-Host "Entorno virtual creado" -ForegroundColor Green
    Write-Host "Activa el entorno con: .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
    Write-Host "Luego ejecuta: pip install -r requirements.txt" -ForegroundColor Cyan
    Set-Location ..
}

function Dev-Backend {
    Write-Host "Ejecutando backend Django..." -ForegroundColor Yellow
    Set-Location backend
    python manage.py runserver
    Set-Location ..
}

function Run-Migrate {
    Write-Host "Aplicando migraciones..." -ForegroundColor Yellow
    Set-Location backend
    python manage.py migrate
    Set-Location ..
}

function Run-Migrations {
    Write-Host "Creando migraciones..." -ForegroundColor Yellow
    Set-Location backend
    python manage.py makemigrations
    Set-Location ..
}

function Activate-VirtualEnv {
    Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
    Set-Location backend
    .\venv\Scripts\Activate.ps1
    Set-Location ..
}

function Create-Superuser {
    Write-Host "Creando superusuario..." -ForegroundColor Yellow
    Set-Location backend
    python manage.py createsuperuser
    Set-Location ..
}

function Create-Branch {
    Write-Host "Creando rama desde dev..." -ForegroundColor Cyan
    $branchName = Read-Host "Ingresa el nombre de la rama"
    if ([string]::IsNullOrWhiteSpace($branchName)) {
        Write-Host "Nombre de rama vacío. Operación cancelada." -ForegroundColor Red
        return
    }
    try {
        git checkout dev
        git pull origin dev
        git checkout -b $branchName
        Write-Host "Rama '$branchName' creada correctamente desde dev" -ForegroundColor Green
    }
    catch {
        Write-Host "Error al crear la rama: $_" -ForegroundColor Red
    }
}

# Menu interactivo: navegar con flechas y confirmar con Enter
function Show-Menu {
    $items = @(
        @{ Label = "Configurar backend (venv + deps)"; Action = "Setup-Backend" }
        @{ Label = "Ejecutar servidor Django"; Action = "Dev-Backend" }
        @{ Label = "Aplicar migraciones"; Action = "Run-Migrate" }
        @{ Label = "Crear migraciones"; Action = "Run-Migrations" }
        @{ Label = "Activar entorno virtual"; Action = "Activate-VirtualEnv" }
        @{ Label = "Crear superusuario"; Action = "Create-Superuser" }
        @{ Label = "Instalar dependencias frontend"; Action = "Setup-Frontend" }
        @{ Label = "Ejecutar frontend (Vite)"; Action = "Dev-Frontend" }
        @{ Label = "Crear rama desde dev"; Action = "Create-Branch" }
        @{ Label = "Limpiar archivos temporales"; Action = "Clean-All" }
        @{ Label = "Mostrar ayuda"; Action = "Show-Help" }
        @{ Label = "Salir"; Action = "Exit" }
    )

    $index = 0
    while ($true) {
        Clear-Host
        Write-Host "Atmos - Menu interactivo (usa flechas ARRIBA/ABAJO y Enter)" -ForegroundColor Cyan
        Write-Host ""
        for ($i = 0; $i -lt $items.Count; $i++) {
            if ($i -eq $index) {
                Write-Host "> $($items[$i].Label)" -ForegroundColor Yellow
            }
            else {
                Write-Host "  $($items[$i].Label)"
            }
        }

        $key = $host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        switch ($key.VirtualKeyCode) {
            38 { if ($index -gt 0) { $index-- } }    # Up
            40 { if ($index -lt $items.Count - 1) { $index++ } }  # Down
            13 {
                $action = $items[$index].Action
                if ($action -eq 'Exit') { Clear-Host; return }
                Clear-Host
                Write-Host "Ejecutando: $($items[$index].Label)`n" -ForegroundColor Cyan
                try {
                    & $action
                }
                catch {
                    Write-Host "Error al ejecutar accion: $_" -ForegroundColor Red
                }
                Write-Host "`nPresiona cualquier tecla para volver al menu..."
                $null = $host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
            }
            27 { Clear-Host; return } # Escape
        }
    }
}

function Setup-Frontend {
    Write-Host "Instalando dependencias frontend..." -ForegroundColor Green
    Set-Location frontend
    pnpm install
    Write-Host "Frontend configurado" -ForegroundColor Green
    Set-Location ..
}

function Dev-Frontend {
    Write-Host "Ejecutando frontend Vite..." -ForegroundColor Green
    Set-Location frontend
    pnpm dev
    Set-Location ..
}

function Clean-All {
    Write-Host "Limpiando archivos temporales..." -ForegroundColor Magenta

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

    Write-Host "Limpieza completada" -ForegroundColor Green
}

# Procesar argumentos
switch ($args[0]) {
    "setup-backend"   { Setup-Backend }
    "dev-backend"     { Dev-Backend }
    "migrate"         { Run-Migrate }
    "migrations"      { Run-Migrations }
    "virtual"         { Activate-VirtualEnv }
    "superuser"       { Create-Superuser }
    "setup-frontend"  { Setup-Frontend }
    "dev-frontend"    { Dev-Frontend }
    "create-branch"   { Create-Branch }
    "clean"           { Clean-All }
    default           { Show-Menu }
}
