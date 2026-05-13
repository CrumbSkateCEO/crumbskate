#!/usr/bin/env bash
# ==============================================================================
# export-docker-images.sh
# Construye las imágenes Docker del proyecto CrumbSkate, las exporta como
# archivos .tar locales Y las transfiere por stream SSH a un servidor Proxmox.
#
# Uso:
#   ./export-docker-images.sh                          # solo exporta .tar locales
#   ./export-docker-images.sh --push                   # exporta + sube a Proxmox
#   ./export-docker-images.sh --push --compress        # sube con gzip (conexión lenta)
#   ./export-docker-images.sh --push --key ~/.ssh/id_rsa  # llave SSH personalizada
#   ./export-docker-images.sh --push --no-build        # salta el build (usa imágenes existentes)
#
# Variables de entorno opcionales:
#   REMOTE_HOST   IP/hostname del servidor  (default: 192.168.0.47)
#   REMOTE_USER   Usuario SSH               (default: ubuntu)
#   EXPORT_DIR    Carpeta local de salida   (default: ./docker-exports)
# ==============================================================================

set -euo pipefail

# ── Colores ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

log()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()   { echo -e "${GREEN}[OK]${NC}    $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()  { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }
step() { echo -e "\n${MAGENTA}${BOLD}▶ $*${NC}"; }

# ── Configuración por defecto ─────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTE_HOST="${REMOTE_HOST:-192.168.0.47}"
REMOTE_USER="${REMOTE_USER:-ubuntu}"
EXPORT_DIR="${EXPORT_DIR:-${SCRIPT_DIR}/docker-exports}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

# ── Flags (parse de argumentos) ───────────────────────────────────────────────
DO_PUSH=false
USE_COMPRESS=false
SSH_KEY_FLAG=""
DO_BUILD=true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --push)       DO_PUSH=true ;;
    --compress)   USE_COMPRESS=true ;;
    --no-build)   DO_BUILD=false ;;
    --key)        shift; SSH_KEY_FLAG="-i $1" ;;
    --host)       shift; REMOTE_HOST="$1" ;;
    --user)       shift; REMOTE_USER="$1" ;;
    --dir)        shift; EXPORT_DIR="$1" ;;
    -h|--help)
      grep '^#' "$0" | head -20 | sed 's/^# \{0,2\}//'
      exit 0 ;;
    *) warn "Argumento desconocido: $1" ;;
  esac
  shift
done

SSH_CMD="ssh ${SSH_KEY_FLAG} ${REMOTE_USER}@${REMOTE_HOST}"

# ── Imágenes del proyecto: nombre → carpeta de contexto ──────────────────────
declare -A IMAGES=(
  ["crumbskate-backend"]="backend"
  ["crumbskate-frontend"]="frontend"
)

# ── Verificaciones previas ────────────────────────────────────────────────────
command -v docker &>/dev/null || err "Docker no está instalado o no está en el PATH."
if $DO_PUSH; then
  command -v ssh &>/dev/null || err "ssh no está disponible."
fi

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║     CrumbSkate — Docker Export & Deploy          ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════╝${NC}"
echo ""
log "Exportación local : ${EXPORT_DIR}"
log "Timestamp         : ${TIMESTAMP}"
if $DO_PUSH; then
  log "Destino remoto    : ${REMOTE_USER}@${REMOTE_HOST}"
  $USE_COMPRESS && log "Compresión gzip   : activada" || log "Compresión gzip   : desactivada"
fi
echo ""

# ── Crear estructura de carpetas locales ──────────────────────────────────────
for IMAGE_NAME in "${!IMAGES[@]}"; do
  mkdir -p "${EXPORT_DIR}/${IMAGE_NAME}"
done

# ── Verificar conectividad SSH (solo si se va a pushear) ─────────────────────
if $DO_PUSH; then
  step "Verificando conexión SSH a ${REMOTE_USER}@${REMOTE_HOST}..."
  if ! ${SSH_CMD} -o ConnectTimeout=5 -o BatchMode=yes "echo ok" &>/dev/null; then
    err "No se puede conectar al servidor ${REMOTE_HOST} como '${REMOTE_USER}'.\n    Verifica:\n      • El servidor está encendido\n      • Tu llave SSH está autorizada (ssh-copy-id ${REMOTE_USER}@${REMOTE_HOST})\n      • El usuario pertenece al grupo docker (groups ${REMOTE_USER})"
  fi
  ok "Conexión SSH exitosa."

  # Verificar que el grupo docker está disponible en el servidor
  REMOTE_GROUPS=$(${SSH_CMD} "groups" 2>/dev/null || echo "")
  if echo "${REMOTE_GROUPS}" | grep -qw "docker"; then
    ok "Usuario '${REMOTE_USER}' pertenece al grupo docker en el servidor."
  else
    warn "El usuario '${REMOTE_USER}' puede NO tener permisos de Docker en el servidor."
    warn "Ejecuta en el servidor: sudo usermod -aG docker ${REMOTE_USER} && newgrp docker"
  fi
fi

# ── Procesar cada imagen ──────────────────────────────────────────────────────
FAILED_IMAGES=()

for IMAGE_NAME in "${!IMAGES[@]}"; do
  CONTEXT_DIR="${SCRIPT_DIR}/${IMAGES[$IMAGE_NAME]}"
  DEST_DIR="${EXPORT_DIR}/${IMAGE_NAME}"
  TAR_FILE="${DEST_DIR}/${IMAGE_NAME}_${TIMESTAMP}.tar"
  DOCKERFILE="${CONTEXT_DIR}/Dockerfile"

  echo ""
  echo -e "${BOLD}════ ${IMAGE_NAME} ════════════════════════════════════════${NC}"

  # Verificar Dockerfile
  if [[ ! -f "${DOCKERFILE}" ]]; then
    warn "No se encontró ${DOCKERFILE}, saltando..."
    FAILED_IMAGES+=("${IMAGE_NAME} (Dockerfile no encontrado)")
    continue
  fi

  # ── BUILD ────────────────────────────────────────────────────────────────
  if $DO_BUILD; then
    step "Build: ${IMAGE_NAME}:latest"
    if docker build \
        --tag "${IMAGE_NAME}:latest" \
        --file "${DOCKERFILE}" \
        "${CONTEXT_DIR}"; then
      ok "Build completado."
    else
      warn "Build fallido para '${IMAGE_NAME}'. Saltando..."
      FAILED_IMAGES+=("${IMAGE_NAME} (build fallido)")
      continue
    fi
  else
    # Verificar que la imagen existe si saltamos el build
    if ! docker image inspect "${IMAGE_NAME}:latest" &>/dev/null; then
      err "Imagen '${IMAGE_NAME}:latest' no existe localmente. Elimina --no-build."
    fi
    log "Usando imagen existente '${IMAGE_NAME}:latest' (--no-build activo)."
  fi

  # ── SAVE local .tar ──────────────────────────────────────────────────────
  step "Guardando .tar local: ${TAR_FILE}"
  if docker save --output "${TAR_FILE}" "${IMAGE_NAME}:latest"; then
    SIZE="$(du -sh "${TAR_FILE}" | cut -f1)"
    ok "Guardado: ${TAR_FILE}  [${SIZE}]"
  else
    warn "Falló el guardado local de '${IMAGE_NAME}'."
    FAILED_IMAGES+=("${IMAGE_NAME} (save local fallido)")
    continue
  fi

  # Symlink al .tar más reciente
  SYMLINK="${DEST_DIR}/${IMAGE_NAME}_latest.tar"
  ln -sf "$(basename "${TAR_FILE}")" "${SYMLINK}"
  log "Symlink: ${IMAGE_NAME}_latest.tar → $(basename "${TAR_FILE}")"

  # ── PUSH por SSH stream ──────────────────────────────────────────────────
  if $DO_PUSH; then
    step "Transfiriendo '${IMAGE_NAME}' → ${REMOTE_USER}@${REMOTE_HOST} (stream)"

    if $USE_COMPRESS; then
      log "Modo: docker save | gzip | ssh | gunzip | docker load"
      docker save "${IMAGE_NAME}:latest" \
        | gzip \
        | ${SSH_CMD} "gunzip | docker load"
    else
      log "Modo: docker save | ssh | docker load"
      docker save "${IMAGE_NAME}:latest" \
        | ${SSH_CMD} "docker load"
    fi

    if [[ $? -eq 0 ]]; then
      ok "Imagen '${IMAGE_NAME}' cargada en el servidor remoto."
    else
      warn "La transferencia de '${IMAGE_NAME}' puede haber fallado."
      FAILED_IMAGES+=("${IMAGE_NAME} (push fallido)")
    fi
  fi

done

# ── Verificación post-envío ───────────────────────────────────────────────────
if $DO_PUSH; then
  echo ""
  step "Verificando imágenes en el servidor remoto (${REMOTE_HOST})..."
  echo ""
  ${SSH_CMD} "docker images --format 'table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}'" \
    | grep -E "(REPOSITORY|crumbskate)" \
    || warn "No se encontraron imágenes de crumbskate en el servidor."
fi

# ── Resumen final ─────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD} Resumen de exportación${NC}"
echo -e "${BOLD}══════════════════════════════════════════════════${NC}"
echo ""
echo "Archivos .tar locales generados:"
find "${EXPORT_DIR}" -type f -name "*.tar" | sort | while read -r f; do
  SIZE="$(du -sh "$f" | cut -f1)"
  echo -e "  ${GREEN}✔${NC}  ${f}  [${SIZE}]"
done

if [[ ${#FAILED_IMAGES[@]} -gt 0 ]]; then
  echo ""
  echo -e "${RED}Imágenes con errores:${NC}"
  for img in "${FAILED_IMAGES[@]}"; do
    echo -e "  ${RED}✖${NC}  ${img}"
  done
fi

echo ""
if $DO_PUSH; then
  echo -e "Las imágenes fueron transferidas a ${CYAN}${REMOTE_USER}@${REMOTE_HOST}${NC}."
  echo -e "Para correr en el servidor:"
  echo -e "  ${CYAN}ssh ${REMOTE_USER}@${REMOTE_HOST} 'docker run -d crumbskate-backend:latest'${NC}"
else
  echo -e "Para transferir al servidor Proxmox (stream directo, sin archivos temporales):"
  echo -e "  ${CYAN}./export-docker-images.sh --push${NC}"
  echo -e "  ${CYAN}./export-docker-images.sh --push --compress   ${NC}# conexión lenta"
  echo -e "  ${CYAN}./export-docker-images.sh --push --no-build   ${NC}# sin re-build"
fi
echo ""
