#!/bin/bash
# Script maestro Crumbskate
# Uso: ./start-crumbskate.sh [local|prod|stop|status|logs]
#
# Modos:
#   local  → PostgreSQL local (Docker) + Backend + Frontend (sin internet)
#   prod   → Backend + Frontend usando Neon (DATABASE_URL en .env)
#   stop   → Detiene todos los servicios
#   status → Muestra estado de contenedores y procesos
#   logs   → Muestra logs del backend

set -e
cd "$(dirname "$0")"

MODE="${1:-local}"
ENV_FILE=".env"
COMPOSE_BASE="docker-compose.yml"
COMPOSE_LOCAL="docker-compose.local.yml"

# ──────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────
has_docker() {
    command -v docker &> /dev/null && docker compose version &> /dev/null
}

print_banner() {
    echo ""
    echo "  ██████╗██████╗ ██╗   ██╗███╗   ███╗██████╗ "
    echo " ██╔════╝██╔══██╗██║   ██║████╗ ████║██╔══██╗"
    echo " ██║     ██████╔╝██║   ██║██╔████╔██║██████╔╝"
    echo " ██║     ██╔══██╗██║   ██║██║╚██╔╝██║██╔══██╗"
    echo " ╚██████╗██║  ██║╚██████╔╝██║ ╚═╝ ██║██████╔╝"
    echo "  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═════╝ "
    echo "  ███████╗██╗  ██╗ █████╗ ████████╗███████╗  "
    echo "  ██╔════╝██║ ██╔╝██╔══██╗╚══██╔══╝██╔════╝  "
    echo "  ███████╗█████╔╝ ███████║   ██║   █████╗    "
    echo "  ╚════██║██╔═██╗ ██╔══██║   ██║   ██╔══╝    "
    echo "  ███████║██║  ██╗██║  ██║   ██║   ███████╗  "
    echo "  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝  "
    echo ""
}

# Crea .env si no existe
create_env() {
    if [ ! -f "$ENV_FILE" ]; then
        echo "📝 Creando $ENV_FILE con valores por defecto..."
        cat > "$ENV_FILE" << 'EOF'
# ── Server ──────────────────────────────────
PORT=5000
NODE_ENV=development

# ── Base de datos ────────────────────────────
# MODO LOCAL (Docker PostgreSQL):
DATABASE_URL=postgresql://crumbskate_user:localpassword@localhost:5432/crumbskate

# MODO PRODUCCIÓN (Neon): descomentá esta línea y comentá la de arriba
# DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/crumbskate?sslmode=require

# ── JWT ──────────────────────────────────────
JWT_SECRET=crumbskate_secret_key_2024_CAMBIA_ESTO_EN_PRODUCCION
JWT_EXPIRES_IN=24h

# ── CORS ─────────────────────────────────────
FRONTEND_URL=http://localhost:5173

# ── Frontend (Vite) ──────────────────────────
VITE_API_URL=http://localhost:5000/api

# ── Docker / Dominio ─────────────────────────
DOMAIN=crumbskate.edu.ar
EOF
        echo "✅ .env creado. Revisalo antes de continuar."
    fi
}

# ──────────────────────────────────────────
# MODO LOCAL (PostgreSQL Docker + npm dev)
# ──────────────────────────────────────────
start_local_npm() {
    echo "🚀 Iniciando Crumbskate en modo LOCAL (npm)..."
    create_env

    if has_docker; then
        echo "🐳 Levantando PostgreSQL local..."
        docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_LOCAL" up -d postgres
        echo "⏳ Esperando que PostgreSQL esté listo..."
        sleep 5
    else
        echo "⚠️  Docker no disponible. Asegurate de tener PostgreSQL corriendo en localhost:5432"
    fi

    # Cargar DATABASE_URL desde .env para el backend local
    export $(grep -v '^#' "$ENV_FILE" | xargs)

    echo "📦 Iniciando Backend (puerto 5000)..."
    cd backend
    npm install --silent 2>/dev/null || true
    npm run dev &
    BACKEND_PID=$!
    cd ..

    echo "📦 Iniciando Frontend (puerto 5173)..."
    cd frontend
    npm install --silent 2>/dev/null || true
    npm run dev &
    FRONTEND_PID=$!
    cd ..

    echo "$BACKEND_PID" > .pids
    echo "$FRONTEND_PID" >> .pids

    echo ""
    echo "✅ ¡Crumbskate local corriendo!"
    echo "   🗄️  PostgreSQL: localhost:5432 (Docker)"
    echo "   🔧 Backend:    http://localhost:5000"
    echo "   🌐 Frontend:   http://localhost:5173"
    echo ""
    echo "   Para detener: ./start-crumbskate.sh stop"
    echo ""

    if command -v xdg-open &> /dev/null; then
        sleep 4
        xdg-open http://localhost:5173
    fi
}

# ──────────────────────────────────────────
# MODO LOCAL DOCKER COMPLETO
# ──────────────────────────────────────────
start_local_docker() {
    echo "🐳 Iniciando Crumbskate en modo LOCAL (Docker completo)..."
    create_env

    if ! has_docker; then
        echo "❌ Docker no está disponible."
        exit 1
    fi

    docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_LOCAL" up -d

    echo ""
    echo "✅ ¡Crumbskate local (Docker) corriendo!"
    echo "   🗄️  PostgreSQL: localhost:5432"
    echo "   🔧 Backend:    http://localhost:5000"
    echo "   🌐 Frontend:   http://localhost:3000"
    echo ""
    echo "   Para ver logs: ./start-crumbskate.sh logs"
    echo "   Para detener:  ./start-crumbskate.sh stop"
}

# ──────────────────────────────────────────
# MODO PRODUCCIÓN (Neon)
# ──────────────────────────────────────────
start_prod() {
    echo "🏗️  Iniciando Crumbskate en modo PRODUCCIÓN (Neon)..."
    create_env

    if ! has_docker; then
        echo "❌ Docker no está disponible."
        exit 1
    fi

    # Verificar que DATABASE_URL apunte a Neon
    source "$ENV_FILE" 2>/dev/null || true
    if [[ "$DATABASE_URL" == *"localhost"* ]] || [[ "$DATABASE_URL" == *"@postgres:"* ]]; then
        echo "⚠️  WARNING: DATABASE_URL parece apuntar a una base local."
        echo "   En producción debería apuntar a Neon (neon.tech)."
        echo "   ¿Continuar igual? (s/N)"
        read -r respuesta
        [[ "$respuesta" != "s" && "$respuesta" != "S" ]] && exit 1
    fi

    mkdir -p certbot html

    docker compose -f "$COMPOSE_BASE" up -d

    echo ""
    echo "✅ ¡Crumbskate producción corriendo!"
    echo "   🌐 Frontend: http://localhost:3000"
    echo "   🔧 Backend:  http://localhost:5000"
    echo "   ☁️  Base de datos: Neon (PostgreSQL cloud)"
    echo ""
}

# ──────────────────────────────────────────
# DETENER
# ──────────────────────────────────────────
stop_services() {
    echo "🛑 Deteniendo servicios..."

    if has_docker; then
        docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_LOCAL" down 2>/dev/null || true
        docker compose -f "$COMPOSE_BASE" down 2>/dev/null || true
    fi

    if [ -f .pids ]; then
        while read -r pid; do
            kill "$pid" 2>/dev/null || true
        done < .pids
        rm -f .pids
        echo "✅ Procesos npm detenidos."
    fi

    echo "✅ Todo detenido."
}

# ──────────────────────────────────────────
# ESTADO
# ──────────────────────────────────────────
status_services() {
    echo "📊 Estado de Crumbskate:"
    echo ""

    if has_docker; then
        echo "── Contenedores ──"
        docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_LOCAL" ps 2>/dev/null || \
        docker compose -f "$COMPOSE_BASE" ps 2>/dev/null || true
    fi

    if [ -f .pids ]; then
        echo ""
        echo "── Procesos npm ──"
        while read -r pid; do
            if kill -0 "$pid" 2>/dev/null; then
                echo "  PID $pid: ✅ corriendo"
            else
                echo "  PID $pid: ❌ detenido"
            fi
        done < .pids
    fi
}

# ──────────────────────────────────────────
# LOGS
# ──────────────────────────────────────────
show_logs() {
    SERVICE="${2:-backend}"
    if has_docker; then
        docker compose -f "$COMPOSE_BASE" -f "$COMPOSE_LOCAL" logs -f "$SERVICE" 2>/dev/null || \
        docker compose -f "$COMPOSE_BASE" logs -f "$SERVICE"
    else
        echo "Docker no disponible para ver logs de contenedores."
    fi
}

# ──────────────────────────────────────────
# Main
# ──────────────────────────────────────────
print_banner

case "$MODE" in
    local|dev)
        start_local_npm
        ;;
    local-docker)
        start_local_docker
        ;;
    prod|production)
        start_prod
        ;;
    stop)
        stop_services
        ;;
    status)
        status_services
        ;;
    logs)
        show_logs "$@"
        ;;
    *)
        echo "Uso: $0 {local|local-docker|prod|stop|status|logs [servicio]}"
        echo ""
        echo "Modos:"
        echo "  local        → PostgreSQL Docker + npm dev (sin internet)"
        echo "  local-docker → Todo en Docker con PostgreSQL local"
        echo "  prod         → Docker con Neon como base de datos"
        echo "  stop         → Detiene todo"
        echo "  status       → Estado de servicios"
        echo "  logs         → Logs de un servicio (default: backend)"
        echo ""
        echo "Ejemplos:"
        echo "  ./start-crumbskate.sh local"
        echo "  ./start-crumbskate.sh local-docker"
        echo "  ./start-crumbskate.sh logs frontend"
        exit 1
        ;;
esac