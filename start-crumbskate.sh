#!/bin/bash
cd "$(dirname "$0")"

if command -v docker compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

$COMPOSE_CMD up -d

# Esperar unos segundos a que los servicios inicien
sleep 5

# Abrir en el navegador predeterminado de Linux
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v python3 &> /dev/null; then
    python3 -m webbrowser http://localhost:3000
fi
