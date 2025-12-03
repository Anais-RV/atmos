#!/usr/bin/env bash

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
tput civis

SCRIPT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS_FOLDER="$SCRIPT_ROOT/logs"
mkdir -p "$LOGS_FOLDER"

log_file() { echo "$LOGS_FOLDER/atmos_$(date +%F).log"; }
write_log() {
    local level=${2:-INFO}
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] [$USER] $1" >> "$(log_file)"
}

# =================== Funciones Backend ===================
setup_backend() {
    write_log "Iniciando setup-backend"
    [[ ! -d backend ]] && { echo "❌ /backend no existe"; write_log "Backend no encontrado" "ERROR"; return 1; }
    pushd backend > /dev/null || return 1
    [[ ! -d ".venv" ]] && {
        echo "Creando entorno virtual..."
        python3 -m venv .venv || { echo "Error creando entorno virtual"; write_log "Error creando entorno virtual" "ERROR"; popd > /dev/null; return 1; }
        write_log "Entorno virtual creado"
    }
    if [[ -f ".venv/bin/activate" ]]; then
        source .venv/bin/activate
    elif [[ -f ".venv/Scripts/activate" ]]; then
        source .venv/Scripts/activate
    else
        echo "❌ No existe entorno virtual para activar."
        write_log "No existe entorno virtual para activar" "ERROR"
        popd > /dev/null
        return 1
    fi

    if [[ -f "requirements.txt" ]]; then
        pip install -r requirements.txt || { echo "Error instalando dependencias"; write_log "Error instalando dependencias" "ERROR"; popd > /dev/null; return 1; }
        write_log "Dependencias instaladas"
    fi
    popd > /dev/null
}

dev_backend() {
    write_log "Iniciando servidor Django"
    if ! command -v python3 &>/dev/null; then
        echo "❌ Python3 no está instalado"
        write_log "Python3 no está instalado" "ERROR"
        return 1
    fi
    (cd backend && python3 manage.py runserver)
    write_log "Servidor Django detenido"
}

stop_django() {
    write_log "Deteniendo servidor Django"
    if ! command -v lsof &>/dev/null; then
        echo "❌ lsof no está instalado"
        write_log "lsof no está instalado" "ERROR"
        return 1
    fi
    pids=$(lsof -ti:8000)
    if [[ -n $pids ]]; then
        kill -9 $pids && echo "Servidor Django detenido"
        write_log "Servidor Django detenido"
    else
        echo "No hay servidor Django en ejecución"
        write_log "No hay Django corriendo" "WARNING"
    fi
}

run_migrate() {
    write_log "Aplicando migraciones"
    (cd backend && python3 manage.py migrate)
    write_log "Migraciones aplicadas"
}

run_migrations() {
    write_log "Creando migraciones"
    (cd backend && python3 manage.py makemigrations)
    write_log "Migraciones creadas"
}

activate_venv() {
    local ACTIVATE_PATH=""
    if [[ -f backend/.venv/bin/activate ]]; then
        ACTIVATE_PATH="backend/.venv/bin/activate"
    elif [[ -f backend/.venv/Scripts/activate ]]; then
        ACTIVATE_PATH="backend/.venv/Scripts/activate"
    fi

    if [[ -n $ACTIVATE_PATH ]]; then
        write_log "Activando entorno virtual"
        source "$ACTIVATE_PATH"
        echo "Entorno virtual activado."
    else
        echo "❌ No existe entorno virtual en backend/.venv"
        write_log "Intento de activar venv fallido: no existe" "ERROR"
    fi
}

create_superuser() {
    write_log "Creando superusuario"
    (cd backend && python3 manage.py createsuperuser)
    write_log "Superusuario creado"
}

# =================== Funciones Frontend ===================
setup_frontend() {
    write_log "Instalando dependencias frontend"
    if ! command -v pnpm &>/dev/null; then
        echo "❌ pnpm no está instalado"
        write_log "pnpm no está instalado" "ERROR"
        return 1
    fi
    (cd frontend && pnpm install)
    write_log "Frontend configurado"
}

dev_frontend() {
    write_log "Iniciando servidor Vite"
    if ! command -v pnpm &>/dev/null; then
        echo "❌ pnpm no está instalado"
        write_log "pnpm no está instalado" "ERROR"
        return 1
    fi
    (cd frontend && pnpm dev)
    write_log "Servidor Vite detenido"
}

stop_vite() {
    write_log "Deteniendo servidor Vite"
    if ! command -v lsof &>/dev/null; then
        echo "❌ lsof no está instalado"
        write_log "lsof no está instalado" "ERROR"
        return 1
    fi
    pids=$(lsof -ti:5173)
    if [[ -n $pids ]]; then
        kill -9 $pids && echo "Servidor Vite detenido"
        write_log "Servidor Vite detenido"
    else
        echo "No hay servidor Vite en ejecución"
        write_log "No hay Vite corriendo" "WARNING"
    fi
}

# =================== Funciones Git ===================
create_branch() {
    read -rp "Nombre de la rama: " branch
    [[ -z $branch ]] && { echo "Nombre vacío, cancelado"; return 1; }
    git checkout dev && git pull origin dev
    git checkout -b "$branch"
    git push -u origin "$branch"
    write_log "Rama $branch creada y publicada"
}

pull_dev() {
    current=$(git rev-parse --abbrev-ref HEAD)
    [[ $current == "dev" ]] && { echo "Ya estás en dev"; return 0; }
    git fetch origin dev
    git merge origin/dev
}

quick_push() {
    read -rp "Mensaje del commit: " msg
    [[ -z $msg ]] && { echo "Mensaje vacío"; return 1; }
    git add .
    git commit -m "$msg"
    branch=$(git rev-parse --abbrev-ref HEAD)
    git push origin "$branch"
}

create_pr() {
    if ! command -v gh &>/dev/null; then
        echo "❌ GitHub CLI (gh) no está instalado"
        write_log "gh no está instalado" "ERROR"
        return 1
    fi
    branch=$(git rev-parse --abbrev-ref HEAD)
    read -rp "Título PR: " title
    read -rp "Descripción PR: " body
    gh pr create --base dev --head "$branch" --title "$title" --body "$body"
}

# =================== Funciones Profes ===================
sync_dev_main() {
    git checkout main && git pull origin main
    git checkout dev && git pull origin dev
    git merge main
    git push origin dev
}

merge_root_dev() {
    read -rp "Rama origen (default main): " src
    [[ -z $src ]] && src="main"
    git fetch origin "$src"
    git fetch origin dev
    git checkout dev
    git merge origin/"$src"
    git push origin dev
}

# =================== Funciones Utilidades ===================
clean_all() {
    write_log "Limpiando temporales"
    find backend -type d -name "__pycache__" -exec rm -rf {} +
    find backend -type f -name "*.pyc" -delete
    rm -rf frontend/node_modules frontend/dist frontend/.vite
    write_log "Limpieza completada"
    echo "Limpieza completada"
}

show_help() {
    cat <<EOF
Atmos - Comandos disponibles
Backend:
  setup-backend    - Configurar backend
  dev-backend      - Ejecutar Django
  stop-django      - Detener Django
  migrate          - Aplicar migraciones
  migrations       - Crear migraciones
  virtual          - Activar venv
  superuser        - Crear superusuario
Frontend:
  setup-frontend   - Instalar dependencias frontend
  dev-frontend     - Ejecutar Vite
  stop-vite        - Detener Vite
Git:
  create-branch    - Crear rama desde dev
  pull-dev         - Traer cambios de dev
  quick-push       - Push rápido
  create-pr        - Crear Pull Request
Profes:
  sync-dev-main    - Sincronizar dev con main
  merge-root-dev   - Merge raíz a dev
Utilidades:
  clean            - Limpiar archivos temporales
  help             - Mostrar ayuda
EOF
}

# =================== Menú Interactivo ===================
RESET="\e[0m"
HILITE_BG="\e[48;5;24m"
HILITE_FG="\e[38;5;15m"
NORMAL_FG="\e[38;5;33m"

main_menu_items=("⚙ Backend" "🎨 Frontend" "🛠 Git" "👨‍🏫 Profes" "🧰 Utilidades" "❌ Salir")
main_menu_actions=("show_backend_menu" "show_frontend_menu" "show_git_menu" "show_profes_menu" "show_utilidades_menu" "exit 0")

show_backend_menu() {
    local items=("Setup Backend" "Ejecutar Django" "Detener Django" "Aplicar Migraciones" "Crear Migraciones" "Activar Venv" "Crear Superuser" "Volver")
    local actions=(setup_backend dev_backend stop_django run_migrate run_migrations activate_venv create_superuser return)
    navigate_menu "Backend" items actions
}

show_frontend_menu() {
    local items=("Setup Frontend" "Ejecutar Vite" "Detener Vite" "Volver")
    local actions=(setup_frontend dev_frontend stop_vite return)
    navigate_menu "Frontend" items actions
}

show_git_menu() {
    local items=("Crear rama" "Traer cambios de dev" "Push rápido" "Crear Pull Request" "Volver")
    local actions=(create_branch pull_dev quick_push create_pr return)
    navigate_menu "Git" items actions
}

show_profes_menu() {
    local items=("Sincronizar dev con main" "Merge raíz a dev" "Volver")
    local actions=(sync_dev_main merge_root_dev return)
    navigate_menu "Profes" items actions
}

show_utilidades_menu() {
    local items=("Limpiar archivos" "Mostrar ayuda" "Volver")
    local actions=(clean_all show_help return)
    navigate_menu "Utilidades" items actions
}

navigate_menu() {
    local title="$1"; shift
    local -n menu_items=$1
    local -n menu_actions=$2
    local index=0 key
    while true; do
        clear
        echo -e "${NORMAL_FG}====== $title ======${RESET}"
        for i in "${!menu_items[@]}"; do
            if [[ $i -eq $index ]]; then
                echo -e "${HILITE_BG}${HILITE_FG}> ${menu_items[i]}${RESET}"
            else
                echo "  ${menu_items[i]}"
            fi
        done
        read -rsn1 key
        if [[ $key == $'\x1b' ]]; then
            read -rsn2 key
            [[ $key == "[A" ]] && ((index--)) && [[ $index -lt 0 ]] && index=$((${#menu_items[@]}-1))
            [[ $key == "[B" ]] && ((index++)) && [[ $index -ge ${#menu_items[@]} ]] && index=0
        elif [[ $key == "" ]]; then
            "${menu_actions[index]}"
            echo -e "\nPresiona cualquier tecla..."
            read -rsn1
            if [[ "${menu_items[index]}" == "Volver" ]]; then
                break
            fi
        elif [[ $key == $'\x1b' ]]; then
            break
        fi
    done
}

navigate_menu "Atmos - Dashboard Principal" main_menu_items main_menu_actions
tput cnorm
