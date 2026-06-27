import { getApiUrl } from './apiUrl';

const API_URL = getApiUrl();

/** Base URL del backend (sin /api). Usar para imágenes y archivos estáticos. */
export const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
