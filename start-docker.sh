#!/bin/bash

# Script para dockerizar y ejecutar el proyecto CrumbSkate

echo "========================================"
echo "    CrumbSkate Dockerization Script     "
echo "========================================"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null
then
    echo "❌ Error: No se encontró Docker. Por favor, instala Docker primero."
    exit 1
fi

# Determinar el comando de docker-compose
COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null; then
    if docker-compose --version &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        echo "❌ Error: No se encontró Docker Compose. Por favor, instálalo."
        exit 1
    fi
fi

echo "🚀 Construyendo y levantando los contenedores de Docker..."
echo "Esto puede tardar unos minutos la primera vez."
echo "----------------------------------------"

# Asegurarnos de estar en el directorio del script
cd "$(dirname "$0")"

# Bajar contenedores existentes y limpiar huerfanos (opcional, ayuda a tener un estado limpio)
echo "Deteniendo contenedores anteriores (si existen)..."
$COMPOSE_CMD down --remove-orphans

# Construir e iniciar en modo "detached"
echo "Iniciando contenedores..."
$COMPOSE_CMD up --build -d

echo "----------------------------------------"
echo "✅ ¡Contenedores de Docker iniciados correctamente!"
echo "Para ver los logs en tiempo real, ejecuta: $COMPOSE_CMD logs -f"
echo ""
echo "Puedes acceder a la aplicación en:"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5000"
echo "========================================"
