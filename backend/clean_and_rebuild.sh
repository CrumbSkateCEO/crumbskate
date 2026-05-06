#!/bin/bash

echo "Limpiando el directorio backend..."
cd /home/mi-alcantarilla/Escritorio/crumbskate/backend

# Eliminar todo excepto los archivos que acabamos de crear en la raíz
rm -rf src/node_modules
rm -f src/package.json
rm -f src/package-lock.json
rm -f src/server.js
rm -rf src/old_js_backend_backup

echo "Instalando las dependencias en la raíz..."
npm install

echo "¡Listo! Los errores en TypeScript deberían desaparecer ahora."
