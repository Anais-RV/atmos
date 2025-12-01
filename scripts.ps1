# Scripts PowerShell para Proyecto Atmos
# Comandos utiles para desarrollo en Windows

# Crear carpeta de logs si no existe
$logsFolder = "logs"
if (-not (Test-Path $logsFolder)) {
    New-Item -ItemType Directory -Path $logsFolder | Out-Null
}

# Funcion para registrar acciones en el log
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $username = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    $logFile = Join-Path $logsFolder "atmos_$(Get-Date -Format 'yyyy-MM-dd').log"
    $logMessage = "[$timestamp] [$Level] [$username] $Message"
    Add-Content -Path $logFile -Value $logMessage
}

function Show-Help {
    Write-Host "Atmos - Comandos Disponibles" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend:" -ForegroundColor Yellow
    Write-Host "  .\scripts.ps1 setup-backend    - Configurar backend (venv + deps)"
    Write-Host "  .\scripts.ps1 dev-backend      - Ejecutar servidor Django"
    Write-Host "  .\scripts.ps1 stop-django      - Apagar servidor Django"
    Write-Host "  .\scripts.ps1 migrate          - Aplicar migraciones"
    Write-Host "  .\scripts.ps1 migrations       - Crear migraciones"
    Write-Host "  .\scripts.ps1 virtual          - Activar entorno virtual"
    Write-Host "  .\scripts.ps1 superuser        - Crear superusuario"
    Write-Host ""
    Write-Host "Frontend:" -ForegroundColor Green
    Write-Host "  .\scripts.ps1 setup-frontend   - Instalar dependencias frontend"
    Write-Host "  .\scripts.ps1 dev-frontend     - Ejecutar servidor Vite"
    Write-Host "  .\scripts.ps1 stop-vite        - Apagar servidor Vite"
    Write-Host ""
    Write-Host "Git:" -ForegroundColor Cyan
    Write-Host "  .\scripts.ps1 create-branch    - Crear rama desde dev (publica automaticamente)"
    Write-Host "  .\scripts.ps1 pull-dev         - Traer cambios de dev a rama actual"
    Write-Host "  .\scripts.ps1 check-dev        - Verificar cambios nuevos en dev"
    Write-Host ""
    Write-Host "Utilidades:" -ForegroundColor Magenta
    Write-Host "  .\scripts.ps1 start-all        - Encender todos los servidores"
    Write-Host "  .\scripts.ps1 stop-all         - Apagar todos los servidores"
    Write-Host "  .\scripts.ps1 clean            - Limpiar archivos temporales"
    Write-Host ""
    Write-Host "Nota: Todos los comandos se registran en la carpeta 'logs'" -ForegroundColor Gray
    Write-Host "Sin argumentos ejecuta el menu interactivo"
}

function Setup-Backend {
    Write-Host "Configurando backend..." -ForegroundColor Yellow
    Write-Log "Iniciando configuracion de backend"
    Set-Location backend
    python -m venv venv
    Write-Host "Entorno virtual creado" -ForegroundColor Green
    Write-Log "Entorno virtual creado"
    Write-Host "Activa el entorno con: .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
    Write-Host "Luego ejecuta: pip install -r requirements.txt" -ForegroundColor Cyan
    Set-Location ..
    Write-Log "Configuracion de backend completada"
}

function Dev-Backend {
    Write-Host "Ejecutando backend Django..." -ForegroundColor Yellow
    Write-Log "Iniciando servidor Django"
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
    Write-Log "Servidor Django detenido"
}

function Run-Migrate {
    Write-Host "Aplicando migraciones..." -ForegroundColor Yellow
    Write-Log "Aplicando migraciones"
    Set-Location backend
    python manage.py migrate
    Write-Log "Migraciones aplicadas"
    Set-Location ..
}

function Run-Migrations {
    Write-Host "Creando migraciones..." -ForegroundColor Yellow
    Write-Log "Creando migraciones"
    Set-Location backend
    python manage.py makemigrations
    Write-Log "Migraciones creadas"
    Set-Location ..
}

function Activate-VirtualEnv {
    Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
    Write-Log "Activando entorno virtual"
    Set-Location backend
    .\venv\Scripts\Activate.ps1
    Set-Location ..
}

function Create-Superuser {
    Write-Host "Creando superusuario..." -ForegroundColor Yellow
    Write-Log "Creando superusuario"
    Set-Location backend
    python manage.py createsuperuser
    Write-Log "Superusuario creado"
    Set-Location ..
}

function Create-Branch {
    Write-Host "Creando rama desde dev..." -ForegroundColor Cyan
    Write-Log "Iniciando creacion de rama"
    $branchName = Read-Host "Ingresa el nombre de la rama"
    if ([string]::IsNullOrWhiteSpace($branchName)) {
        Write-Host "Nombre de rama vacio. Operacion cancelada." -ForegroundColor Red
        Write-Log "Creacion de rama cancelada: nombre vacio" "WARNING"
        return
    }
    try {
        git checkout dev
        git pull origin dev
        git checkout -b $branchName
        Write-Host "Rama '$branchName' creada correctamente desde dev" -ForegroundColor Green
        Write-Log "Rama '$branchName' creada desde dev"
        Write-Host "Publicando rama en repositorio remoto..." -ForegroundColor Yellow
        git push -u origin $branchName
        Write-Host "Rama '$branchName' publicada correctamente" -ForegroundColor Green
        Write-Log "Rama '$branchName' publicada en repositorio remoto"
        Write-Host "Ya estas en la rama '$branchName'" -ForegroundColor Cyan
        Write-Log "Usuario trasladado a rama '$branchName'"
    }
    catch {
        Write-Host "Error al crear la rama: $_" -ForegroundColor Red
        Write-Log "Error al crear rama '$branchName': $_" "ERROR"
    }
}

function Pull-From-Dev {
    Write-Host "Trayendo cambios de dev a la rama actual..." -ForegroundColor Cyan
    Write-Log "Iniciando traer cambios de dev"
    try {
        $currentBranch = git rev-parse --abbrev-ref HEAD
        Write-Host "Rama actual: $currentBranch" -ForegroundColor Yellow
        Write-Log "Rama actual: $currentBranch"
        git fetch origin dev
        git merge origin/dev
        Write-Host "Cambios de dev traidos correctamente a $currentBranch" -ForegroundColor Green
        Write-Log "Cambios de dev traidos correctamente a $currentBranch"
    }
    catch {
        Write-Host "Error al traer cambios de dev: $_" -ForegroundColor Red
        Write-Log "Error al traer cambios de dev: $_" "ERROR"
    }
}

function Check-Dev-Changes {
    Write-Host "Verificando cambios en dev..." -ForegroundColor Cyan
    Write-Log "Verificando cambios en dev"
    try {
        $currentBranch = git rev-parse --abbrev-ref HEAD
        git fetch origin dev
        
        # Obtener cambios en dev que no estan en la rama actual
        $changes = git log --oneline $currentBranch..origin/dev
        
        if ($changes) {
            Write-Host "Se encontraron cambios nuevos en dev:" -ForegroundColor Yellow
            Write-Log "Se encontraron cambios nuevos en dev"
            Write-Host $changes -ForegroundColor Green
            Write-Log "Cambios: $changes"
            
            Write-Host ""
            Write-Host "Diferencias de archivos:" -ForegroundColor Yellow
            $fileDiff = git diff --name-only $currentBranch..origin/dev
            Write-Host $fileDiff -ForegroundColor Green
            Write-Log "Archivos diferentes: $fileDiff"
        }
        else {
            Write-Host "Tu rama esta actualizada con dev" -ForegroundColor Green
            Write-Log "Rama actualizada con dev"
        }
    }
    catch {
        Write-Host "Error al verificar cambios: $_" -ForegroundColor Red
        Write-Log "Error al verificar cambios: $_" "ERROR"
    }
}

# Menu interactivo: navegar con flechas y confirmar con Enter
function Show-Menu {
    $items = @(
        @{ Label = "=== BACKEND ==="; Action = "" }
        @{ Label = "Configurar backend (venv + deps)"; Action = "Setup-Backend" }
        @{ Label = "Ejecutar servidor Django"; Action = "Dev-Backend" }
        @{ Label = "Apagar servidor Django"; Action = "Stop-Django" }
        @{ Label = "Aplicar migraciones"; Action = "Run-Migrate" }
        @{ Label = "Crear migraciones"; Action = "Run-Migrations" }
        @{ Label = "Activar entorno virtual"; Action = "Activate-VirtualEnv" }
        @{ Label = "Crear superusuario"; Action = "Create-Superuser" }
        @{ Label = "=== FRONTEND ==="; Action = "" }
        @{ Label = "Instalar dependencias frontend"; Action = "Setup-Frontend" }
        @{ Label = "Ejecutar frontend (Vite)"; Action = "Dev-Frontend" }
        @{ Label = "Apagar servidor Vite"; Action = "Stop-Vite" }
        @{ Label = "=== GIT ==="; Action = "" }
        @{ Label = "Crear rama desde dev"; Action = "Create-Branch" }
        @{ Label = "Traer cambios de dev"; Action = "Pull-From-Dev" }
        @{ Label = "Verificar cambios en dev"; Action = "Check-Dev-Changes" }
        @{ Label = "=== UTILIDADES ==="; Action = "" }
        @{ Label = "Encender todos los servidores"; Action = "Start-All-Servers" }
        @{ Label = "Apagar todos los servidores"; Action = "Stop-All-Servers" }
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
            if ($items[$i].Label -match "^===" ) {
                Write-Host "$($items[$i].Label)" -ForegroundColor Magenta
            }
            elseif ($i -eq $index) {
                Write-Host "> $($items[$i].Label)" -ForegroundColor Yellow
            }
            else {
                Write-Host "  $($items[$i].Label)"
            }
        }

        $key = $host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
        switch ($key.VirtualKeyCode) {
            38 { 
                if ($index -gt 0) { $index-- }
                # Saltar sobre titulos
                while ($index -gt 0 -and $items[$index].Label -match "^===") {
                    $index--
                }
            }
            40 { 
                if ($index -lt $items.Count - 1) { $index++ }
                # Saltar sobre titulos
                while ($index -lt $items.Count - 1 -and $items[$index].Label -match "^===") {
                    $index++
                }
            }
            13 {
                if ($items[$index].Label -match "^===") {
                    # No hacer nada si es un titulo
                }
                else {
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
            }
            27 { Clear-Host; return } # Escape
        }
    }
}

function Setup-Frontend {
    Write-Host "Instalando dependencias frontend..." -ForegroundColor Green
    Write-Log "Iniciando instalacion de dependencias frontend"
    Set-Location frontend
    pnpm install
    Write-Host "Frontend configurado" -ForegroundColor Green
    Write-Log "Frontend configurado correctamente"
    Set-Location ..
}

function Dev-Frontend {
    Write-Host "Ejecutando frontend Vite..." -ForegroundColor Green
    Write-Log "Iniciando servidor Vite"
    Set-Location frontend
    pnpm dev
    Set-Location ..
    Write-Log "Servidor Vite detenido"
}

function Stop-Django {
    Write-Host "Deteniendo servidor Django..." -ForegroundColor Yellow
    Write-Log "Deteniendo servidor Django"
    try {
        # Buscar procesos que usen el puerto 8000 (Django)
        $netstat = netstat -ano | Select-String ":8000"
        
        if ($netstat) {
            $pids = @()
            foreach ($line in $netstat) {
                $parts = $line -split '\s+'
                $processId = $parts[-1]
                if ($processId -match '^\d+$') {
                    $pids += $processId
                }
            }
            
            $pids = $pids | Select-Object -Unique
            foreach ($processId in $pids) {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "Proceso Django (PID: $processId) detenido" -ForegroundColor Green
                Write-Log "Proceso Django (PID: $processId) detenido"
            }
            Write-Host "Servidor Django detenido correctamente" -ForegroundColor Green
            Write-Log "Servidor Django detenido correctamente"
        }
        else {
            Write-Host "No hay servidor Django en ejecucion" -ForegroundColor Yellow
            Write-Log "No hay servidor Django en ejecucion" "WARNING"
        }
    }
    catch {
        Write-Host "Error al detener Django: $_" -ForegroundColor Red
        Write-Log "Error al detener Django: $_" "ERROR"
    }
}

function Stop-Vite {
    Write-Host "Deteniendo servidor Vite..." -ForegroundColor Yellow
    Write-Log "Deteniendo servidor Vite"
    try {
        # Buscar procesos que usen el puerto 5173 (Vite)
        $netstat = netstat -ano | Select-String ":5173"
        
        if ($netstat) {
            $pids = @()
            foreach ($line in $netstat) {
                $parts = $line -split '\s+'
                $processId = $parts[-1]
                if ($processId -match '^\d+$') {
                    $pids += $processId
                }
            }
            
            $pids = $pids | Select-Object -Unique
            foreach ($processId in $pids) {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "Proceso Vite (PID: $processId) detenido" -ForegroundColor Green
                Write-Log "Proceso Vite (PID: $processId) detenido"
            }
            Write-Host "Servidor Vite detenido correctamente" -ForegroundColor Green
            Write-Log "Servidor Vite detenido correctamente"
        }
        else {
            Write-Host "No hay servidor Vite en ejecucion" -ForegroundColor Yellow
            Write-Log "No hay servidor Vite en ejecucion" "WARNING"
        }
    }
    catch {
        Write-Host "Error al detener Vite: $_" -ForegroundColor Red
        Write-Log "Error al detener Vite: $_" "ERROR"
    }
}

function Stop-All-Servers {
    Write-Host "Deteniendo todos los servidores..." -ForegroundColor Magenta
    Write-Log "Deteniendo todos los servidores"
    
    Stop-Django
    Write-Host ""
    Stop-Vite
    
    Write-Host ""
    Write-Host "Todos los servidores han sido detenidos" -ForegroundColor Green
    Write-Log "Todos los servidores detenidos"
}

function Start-All-Servers {
    Write-Host "Encendiendo todos los servidores..." -ForegroundColor Magenta
    Write-Log "Encendiendo todos los servidores"
    
    Write-Host "Iniciando servidor Django en background..." -ForegroundColor Yellow
    Write-Log "Iniciando servidor Django en background"
    try {
        $backendPath = Join-Path $PWD "backend"
        $activateScript = Join-Path $backendPath "venv\Scripts\Activate.ps1"
        
        # Crear script temporal para activar venv y ejecutar Django
        $tempScript = Join-Path $env:TEMP "start_django_$([guid]::NewGuid()).ps1"
        @"
`$VerbosePreference = 'SilentlyContinue'
Set-Location "$backendPath"
& "$activateScript"
python manage.py runserver
"@ | Set-Content $tempScript
        
        Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$tempScript`"" -WindowStyle Hidden
        Write-Host "Servidor Django iniciado correctamente" -ForegroundColor Green
        Write-Log "Servidor Django iniciado correctamente"
        
        # Limpiar script temporal después de 5 segundos
        Start-Sleep -Seconds 1
        Remove-Item $tempScript -Force -ErrorAction SilentlyContinue
    }
    catch {
        Write-Host "Error al iniciar Django: $_" -ForegroundColor Red
        Write-Log "Error al iniciar Django: $_" "ERROR"
    }
    
    Write-Host ""
    Write-Host "Iniciando servidor Vite en background..." -ForegroundColor Yellow
    Write-Log "Iniciando servidor Vite en background"
    try {
        $frontendPath = Join-Path $PWD "frontend"
        Start-Process -FilePath "cmd.exe" -ArgumentList "/c pnpm run dev" -WorkingDirectory $frontendPath -WindowStyle Hidden
        Write-Host "Servidor Vite iniciado correctamente" -ForegroundColor Green
        Write-Log "Servidor Vite iniciado correctamente"
    }
    catch {
        Write-Host "Error al iniciar Vite: $_" -ForegroundColor Red
        Write-Log "Error al iniciar Vite: $_" "ERROR"
    }
    
    Write-Host ""
    Write-Host "Todos los servidores han sido encendidos" -ForegroundColor Green
    Write-Host "Django: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Vite: http://localhost:5173" -ForegroundColor Cyan
    Write-Log "Todos los servidores encendidos"
}

function Clean-All {
    Write-Host "Limpiando archivos temporales..." -ForegroundColor Magenta
    Write-Log "Iniciando limpieza de archivos temporales"

    # Limpiar Python
    Get-ChildItem -Path backend -Recurse -Filter "__pycache__" | Remove-Item -Recurse -Force
    Get-ChildItem -Path backend -Recurse -Filter "*.pyc" | Remove-Item -Force
    Write-Log "Archivos Python limpios"

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
    Write-Log "Archivos Frontend limpios"

    Write-Host "Limpieza completada" -ForegroundColor Green
    Write-Log "Limpieza completada"
}

# Procesar argumentos
switch ($args[0]) {
    "setup-backend"   { Setup-Backend }
    "dev-backend"     { Dev-Backend }
    "stop-django"     { Stop-Django }
    "migrate"         { Run-Migrate }
    "migrations"      { Run-Migrations }
    "virtual"         { Activate-VirtualEnv }
    "superuser"       { Create-Superuser }
    "setup-frontend"  { Setup-Frontend }
    "dev-frontend"    { Dev-Frontend }
    "stop-vite"       { Stop-Vite }
    "create-branch"   { Create-Branch }
    "pull-dev"        { Pull-From-Dev }
    "check-dev"       { Check-Dev-Changes }
    "start-all"       { Start-All-Servers }
    "stop-all"        { Stop-All-Servers }
    "clean"           { Clean-All }
    default           { Show-Menu }
}
