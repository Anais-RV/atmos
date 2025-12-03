#!/usr/bin/env bash

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# ╔══════════════════════════════════════════════════════╗
# ║                     ATMOS GODMODE                    ║
# ╚══════════════════════════════════════════════════════╝

# =================== Estilos / Colores GODMODE ===================
RESET="\e[0m"
BOLD="\e[1m"
DIM="\e[2m"
ITALIC="\e[3m"

# Cyberpunk RGB Ramps
P1="\e[38;2;255;0;102m"
P2="\e[38;2;255;102;204m"
P3="\e[38;2;102;153;255m"
P4="\e[38;2;0;255;204m"
P5="\e[38;2;255;255;153m"

# Hacker MODE
H1="\e[38;2;0;255;0m"
H2="\e[38;2;0;200;0m"
H3="\e[38;2;0;150;0m"

# Base colors
GRAY="\e[90m"
CYAN="\e[36m"
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
MAGENTA="\e[35m"

TITLE_GRADIENT=("$P1" "$P2" "$P3" "$P4" "$P5")

# Symbols
OK="✔"
ERR="✖"
ARROW="➜"
SPARK="✦"
BLIP="▮"
DOT="•"
LINE="──────────────────────────────────────────"

tput civis 2>/dev/null  # Ocultar cursor

# ==========================================================
#                    SISTEMA DE ANIMACIONES
# ==========================================================
typewriter() {
    local text="$1"
    local delay="${2:-0.002}"
    for ((i=0; i<${#text}; i++)); do
        printf "%s" "${text:$i:1}"
        sleep "$delay"
    done
}

slide_in() {
    local text="$1"
    local width=$(tput cols)
    for ((i=width; i>=0; i--)); do
        printf "\e[2K\r%*s%s" $i "" "$text"
        sleep 0.002
    done
}

slide_center() {
    clear
    local text="$1"
    cols=$(tput cols)
    pad=$(( (cols - ${#text}) / 2 ))
    for ((i=0; i<=pad; i++)); do
        printf "\e[2K\r%*s%s" $i "" "$text"
        sleep 0.001
    done
    echo
}

loading_bar() {
    local msg="${1:-Cargando...}"
    echo -e "${P3}${BOLD}"
    typewriter "$msg" 0.01
    echo -e "${RESET}"

    local bar=""
    for i in {1..40}; do
        bar+="█"
        printf "${P4}${bar}${RESET}\r"
        sleep 0.03
    done
    echo
    sleep 0.2
    clear
}

# ==========================================================
#                      HUD GODMODE
# ==========================================================
hud() {
    cpu=$(grep 'cpu ' /proc/stat 2>/dev/null | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print int(usage)}')
    mem=$(free -m 2>/dev/null | awk '/Mem:/ {printf("%d%%", $3/$2 * 100)}')

    git_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    [[ -z $git_branch ]] && git_branch="—"

    echo -e "${DIM}${GRAY}${LINE}${RESET}"
    echo -e "${P4}${BOLD}CPU:${RESET} ${cpu:-N/A}%   ${P3}${BOLD}MEM:${RESET} ${mem:-N/A}    ${P2}${BOLD}GIT:${RESET} $git_branch   ${P5}${BOLD}TIME:${RESET} $(date +%H:%M:%S)"
    echo -e "${DIM}${GRAY}${LINE}${RESET}\n"
}

# ==========================================================
#                  BANNER GODMODE CYBERPUNK
# ==========================================================
epic_banner() {
    clear
    slide_center "${P1}${BOLD}╔═══════════════════════════════════════╗${RESET}"
    sleep 0.02
    slide_center "${P2}${BOLD}║           ATMOS GODMODE v1           ║${RESET}"
    sleep 0.02
    slide_center "${P3}${BOLD}╚═══════════════════════════════════════╝${RESET}"
    sleep 0.1
}

# ==========================================================
#                  MENÚ GODMODE SUPREME
# ==========================================================
navigate_menu() {
    local title="$1"; shift
    local -n menu_items=$1
    local -n menu_actions=$2
    local index=0 key=""

    while true; do
        clear
        hud

        # ----- TITULO GRADIENTE -----
        echo -ne "${BOLD}"
        local letters=( $(echo "$title" | fold -w1) )
        local i=0
        for l in "${letters[@]}"; do
            color=${TITLE_GRADIENT[$((i % ${#TITLE_GRADIENT[@]}))]}
            echo -ne "$color$l$RESET"
            ((i++))
            sleep 0.001
        done
        echo -e "\n"

        echo -e "${DIM}${GRAY}Usa ↑ ↓ ENTER, ESC o números${RESET}\n"

        # LISTA DE OPCIONES
        for i in "${!menu_items[@]}"; do
            if [[ $i -eq $index ]]; then
                echo -e " ${P3}${BOLD}${BLIP} ${menu_items[i]}${RESET}"
            else
                echo -e "   ${GRAY}${menu_items[i]}${RESET}"
            fi
        done

        # CAPTURAR INPUT
        IFS= read -rsn1 key

        case "$key" in
            $'\x1b')
                IFS= read -rsn2 -t 0.01 key2
                case "$key2" in
                    "[A") ((index--)); ((index<0)) && index=$((${#menu_items[@]}-1));;
                    "[B") ((index++)); ((index>=${#menu_items[@]})) && index=0;;
                    "") return ;;
                esac
                ;;
            "")
                clear
                hud
                echo -e "${P4}${BOLD}${SPARK} Ejecutando: ${RESET}${menu_items[index]}\n"
                ${menu_actions[index]}
                echo -e "\n${GREEN}${OK} Completado.${RESET}"
                echo -e "${GRAY}Presiona cualquier tecla...${RESET}"
                read -rsn1
                ;;
            [0-9])
                (( key < ${#menu_items[@]} )) && index=$key
                ;;
        esac
    done
}

# ==========================================================
#              TUS FUNCIONES ORIGINALES (sin tocar)
# ==========================================================

SCRIPT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGS_FOLDER="$SCRIPT_ROOT/logs"
mkdir -p "$LOGS_FOLDER"

log_file() { echo "$LOGS_FOLDER/atmos_$(date +%F).log"; }
write_log() { local level=${2:-INFO}; echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] [$USER] $1" >> "$(log_file)"; }

setup_backend() { write_log "Iniciando setup-backend"; [[ ! -d backend ]] && { echo "❌ /backend no existe"; write_log "Backend no encontrado" "ERROR"; return; }; pushd backend >/dev/null || return; [[ ! -d ".venv" ]] && { echo "Creando entorno virtual..."; python -m venv .venv; write_log "Entorno virtual creado"; }; source .venv/bin/activate; [[ -f "requirements.txt" ]] && { pip install -r requirements.txt; write_log "Dependencias instaladas"; }; popd >/dev/null; }
dev_backend() { write_log "Iniciando servidor Django"; (cd backend && python manage.py runserver); write_log "Servidor Django detenido"; }
stop_django() { write_log "Deteniendo servidor Django"; pids=$(lsof -ti:8000); [[ -n $pids ]] && { kill -9 $pids; echo "Servidor Django detenido"; write_log "Servidor Django detenido"; } || { echo "No hay servidor Django en ejecución"; write_log "No hay Django corriendo" "WARNING"; }; }
run_migrate() { write_log "Aplicando migraciones"; (cd backend && python manage.py migrate); write_log "Migraciones aplicadas"; }
run_migrations() { write_log "Creando migraciones"; (cd backend && python manage.py makemigrations); write_log "Migraciones creadas"; }
activate_venv() { write_log "Activando entorno virtual"; source backend/.venv/bin/activate; }
create_superuser() { write_log "Creando superusuario"; (cd backend && python manage.py createsuperuser); write_log "Superusuario creado"; }

setup_frontend() { write_log "Instalando dependencias frontend"; (cd frontend && pnpm install); write_log "Frontend configurado"; }
dev_frontend() { write_log "Iniciando servidor Vite"; (cd frontend && pnpm dev); write_log "Servidor Vite detenido"; }
stop_vite() { write_log "Deteniendo servidor Vite"; pids=$(lsof -ti:5173); [[ -n $pids ]] && { kill -9 $pids; echo "Servidor Vite detenido"; write_log "Servidor Vite detenido"; } || { echo "No hay servidor Vite en ejecución"; write_log "No hay Vite corriendo" "WARNING"; }; }

create_branch() { read -rp "Nombre de la rama: " branch; [[ -z $branch ]] && { echo "Nombre vacío, cancelado"; return; }; git checkout dev && git pull origin dev; git checkout -b "$branch"; git push -u origin "$branch"; write_log "Rama $branch creada y publicada"; }
pull_dev() { current=$(git rev-parse --abbrev-ref HEAD); [[ $current == "dev" ]] && { echo "Ya estás en dev"; return; }; git fetch origin dev; git merge origin/dev; }
quick_push() { read -rp "Mensaje del commit: " msg; [[ -z $msg ]] && { echo "Mensaje vacío"; return; }; git add .; git commit -m "$msg"; branch=$(git rev-parse --abbrev-ref HEAD); git push origin "$branch"; }
create_pr() { branch=$(git rev-parse --abbrev-ref HEAD); read -rp "Título PR: " title; read -rp "Descripción PR: " body; gh pr create --base dev --head "$branch" --title "$title" --body "$body"; }

sync_dev_main() { git checkout main && git pull origin main; git checkout dev && git pull origin dev; git merge main; git push origin dev; }
merge_root_dev() { read -rp "Rama origen (default main): " src; [[ -z $src ]] && src="main"; git fetch origin "$src"; git fetch origin dev; git checkout dev; git merge origin/"$src"; git push origin dev; }

clean_all() { write_log "Limpiando temporales"; find backend -type d -name "__pycache__" -exec rm -rf {} +; find backend -type f -name "*.pyc" -delete; rm -rf frontend/node_modules frontend/dist frontend/.vite; write_log "Limpieza completada"; echo "Limpieza completada"; }
show_help() { echo "Help screen not modified in GODMODE yet."; }

# ==========================================================
#                       MENÚS
# ==========================================================
main_menu_items=("⚙ Backend" "🎨 Frontend" "🛠 Git" "👨‍🏫 Profes" "🧰 Utilidades" "❌ Salir")
main_menu_actions=("show_backend_menu" "show_frontend_menu" "show_git_menu" "show_profes_menu" "show_utilidades_menu" "exit 0")

show_backend_menu() {
    local items=("Setup Backend" "Ejecutar Django" "Detener Django" "Aplicar Migraciones" "Crear Migraciones" "Activar Venv" "Crear Superuser" "Volver")
    local actions=(setup_backend dev_backend stop_django run_migrate run_migrations activate_venv create_superuser return)
    navigate_menu "⚙ Backend" items actions
}

show_frontend_menu() {
    local items=("Setup Frontend" "Ejecutar Vite" "Detener Vite" "Volver")
    local actions=(setup_frontend dev_frontend stop_vite return)
    navigate_menu "🎨 Frontend" items actions
}

show_git_menu() {
    local items=("Crear rama" "Traer cambios de dev" "Push rápido" "Crear Pull Request" "Volver")
    local actions=(create_branch pull_dev quick_push create_pr return)
    navigate_menu "🛠 Git" items actions
}

show_profes_menu() {
    local items=("Sincronizar dev con main" "Merge raíz a dev" "Volver")
    local actions=(sync_dev_main merge_root_dev return)
    navigate_menu "👨‍🏫 Profes" items actions
}

show_utilidades_menu() {
    local items=("Limpiar archivos" "Mostrar ayuda" "Volver")
    local actions=(clean_all show_help return)
    navigate_menu "🧰 Utilidades" items actions
}

# ==========================================================
#                    INICIO GODMODE
# ==========================================================
loading_bar "Inicializando Modo GOD..."
epic_banner
navigate_menu "🚀 ATMOS - Dashboard Principal" main_menu_items main_menu_actions
