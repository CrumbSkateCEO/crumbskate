#!/bin/bash
# Script maestro Crumbskate - Local y Producción
# Uso: ./start-crumbskate.sh [local|prod|stop|status]

set -e

cd "$(dirname "$0")"

MODE="${1:-local}"
ENV_FILE=".env"
ENV_PROD=".env.production"

# Detectar Docker
has_docker() {
    command -v docker &> /dev/null && command -v docker-compose &> /dev/null
}

# Crear .env si no existe
create_env() {
    if [ ! -f "$ENV_FILE" ]; then
        echo "📝 Creando archivo $ENV_FILE..."
        cat > "$ENV_FILE" << 'EOF'
# Server Configuration
PORT=5000

# MariaDB Database Configuration
DB_HOST=127.0.0.1
DB_USER=crumbskate_user
DB_PASSWORD=secretpassword
DB_NAME=crumbskate_db

# JWT Secret
JWT_SECRET=crumbskate_secret_key_2024_change_this_in_production

# Frontend URL (cambiar en producción)
FRONTEND_URL=http://localhost:3000

# API URL para frontend
VITE_API_URL=http://localhost:3000/api

# Dominio (solo producción)
DOMAIN=crumbskate.edu.ar
EOF
    fi
}

# Iniciar en modo local (sin Docker)
start_local() {
    echo "🚀 Iniciando Crumbskate en modo LOCAL..."

    create_env

    # Iniciar backend
    echo "📦 Iniciando Backend..."
    cd backend
    npm install 2>/dev/null || true
    npm run dev &
    BACKEND_PID=$!
    cd ..

    # Iniciar frontend
    echo "📦 Iniciando Frontend..."
    cd frontend
    npm install 2>/dev/null || true
    npm run dev &
    FRONTEND_PID=$!
    cd ..

    # Guardar PIDs
    echo "$BACKEND_PID" > .pids
    echo "$FRONTEND_PID" >> .pids

    echo "✅ Servicios iniciados"
    echo "   Backend:  http://localhost:5173"
    echo "   Frontend: http://localhost:5174"

    # Abrir navegador
    if command -v xdg-open &> /dev/null; then
        sleep 3
        xdg-open http://localhost:5174
    fi
}

# Iniciar en modo producción (Docker)
start_prod() {
    echo "🏗️  Iniciando Crumbskate en modo PRODUCCIÓN (Docker)..."

    create_env

    if has_docker; then
        echo "🐳 Usando Docker Compose..."

        # Crear directorio para certificados
        mkdir -p certbot/{etc,var/www}
        mkdir -p html

        # Configurar dominio si está definido
        if [ -z "$DOMAIN" ]; then
            export DOMAIN="crumbskate.edu.ar"
        fi

        docker compose up -d

        echo "✅ Servicios iniciados"
        echo "   Accede en: https://$DOMAIN"
        echo "   O en: http://localhost:3000 (sin SSL)"
    else
        echo "❌ Docker no está instalado. Usa el modo local."
        exit 1
    fi
}

# Detener servicios
stop_services() {
    echo "🛑 Deteniendo servicios..."

    if has_docker; then
        docker compose down
    fi

    if [ -f .pids ]; then
        while read pid; do
            kill $pid 2>/dev/null || true
        done < .pids
        rm -f .pids
    fi

    echo "✅ Servicios detenidos"
}

# Estado de servicios
status_services() {
    echo "📊 Estado de servicios:"

    if has_docker; then
        docker compose ps
    fi

    if [ -f .pids ]; then
        echo "Procesos locales:"
        cat .pids
    fi
}

# Main
case "$MODE" in
    local)
        start_local
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
    *)
        echo "Uso: $0 {local|prod|stop|status}"
        echo ""
        echo "Modos:"
        echo "  local     - Ejecuta sin Docker (desarrollo)"
        echo "  prod      - Usa Docker Compose (producción)"
        echo "  stop      - Detiene todos los servicios"
        echo "  status    - Muestra estado de servicios"
        exit 1
        ;;
esac