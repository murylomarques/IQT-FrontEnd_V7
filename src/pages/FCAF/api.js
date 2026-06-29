const BASE   = process.env.REACT_APP_API_BASE_URL || 'https://iqt.desktop.com.br';
const PREFIX = 'FCAF';

export const fcafStorage = {
  get:   (key) => localStorage.getItem(`${PREFIX}-${key}`),
  set:   (key, val) => localStorage.setItem(`${PREFIX}-${key}`, val),
  clear: () => ['token', 'name', 'role', 'id'].forEach(
    (k) => localStorage.removeItem(`${PREFIX}-${k}`)
  ),
};

export const fcafFetch = async (path, options = {}) => {
  const token = fcafStorage.get('token');
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Erro ${res.status}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/csv') || contentType.includes('application/octet-stream')) {
    return res.blob();
  }

  return res.json();
};

export const FCAF_ROLE_LABELS = {
  admin:     'Administrador',
  supervisao: 'Supervisor',
  consulta:  'Consulta',
};

export const fcafRedirect = (role) => {
  if (role === 'admin') return '/dashboard/fca-admin';
  if (role === 'consulta') return '/dashboard/fca-admin';
  return '/dashboard/fca-supervisor';
};
