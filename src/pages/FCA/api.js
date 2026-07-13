const BASE = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';
const PREFIX = 'GH';

export const fcaStorage = {
  get: (key) => localStorage.getItem(`${PREFIX}-${key}`),
  set: (key, val) => localStorage.setItem(`${PREFIX}-${key}`, val),
  clear: () => ['token', 'name', 'role', 'id', 'territory', 'regional', 'manager_id'].forEach(
    (k) => localStorage.removeItem(`${PREFIX}-${k}`)
  ),
};

export const fcaFetch = async (path, options = {}) => {
  const token = fcaStorage.get('token');
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Erro ${res.status}`);
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('text/csv')) return res.blob();
  return res.json();
};

export const ROLE_LABELS = {
  admin:       'Administrador',
  gerente:     'Gerente',
  coordenacao: 'Coordenação',
  supervisao:  'Supervisão',
  tecnico:     'Técnico',
  consulta:    'Consulta',
};

export const getRedirectByRole = (role = '') => {
  if (role === 'admin')       return '/dashboard/gh-adm';
  if (role === 'consulta')    return '/dashboard/gh-adm';
  if (role === 'gerente')     return '/dashboard/gh-gerente';
  if (role === 'coordenacao') return '/dashboard/gh-coordenador';
  if (role === 'supervisao')  return '/dashboard/gh-supervisor';
  return '/dashboard/gh-viewer';
};
