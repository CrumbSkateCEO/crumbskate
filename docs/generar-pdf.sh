#!/bin/bash
# Genera HTML listo para imprimir como PDF (sin instalar LaTeX ni wkhtmltopdf)
set -e
cd "$(dirname "$0")/.."

echo "📄 Generando HTML desde Markdown..."
pandoc docs/DOCUMENTACION_TECNICA_CRUMBSKATE.md \
  -o docs/DOCUMENTACION_TECNICA_CRUMBSKATE.html \
  --standalone \
  --metadata title="CrumbSkate — Documentación Técnica"

echo ""
echo "✅ Listo: docs/DOCUMENTACION_TECNICA_CRUMBSKATE.html"
echo ""
echo "Para obtener el PDF:"
echo "  1. Abrí el archivo HTML en Chrome o Firefox"
echo "  2. Ctrl+P  (Imprimir)"
echo "  3. Destino → 'Guardar como PDF'"
echo "  4. Guardar"
echo ""
echo "También podés subir el .html a Google Drive y abrirlo con el navegador."
