/** URL base de la API, siempre termina en /api */
export function getApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const trimmed = raw.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}
