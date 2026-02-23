const MONITOR_MAGIC_STORAGE_KEY = 'monitor.magic.token';

export function readMonitorMagicToken(search = '') {
  if (typeof window === 'undefined') return '';

  const params = new URLSearchParams(search || window.location.search);
  const fromQuery = String(params.get('ml') || '').trim();
  if (fromQuery) {
    window.sessionStorage.setItem(MONITOR_MAGIC_STORAGE_KEY, fromQuery);
    return fromQuery;
  }

  return String(window.sessionStorage.getItem(MONITOR_MAGIC_STORAGE_KEY) || '').trim();
}

export function withMonitorMagic(path, token) {
  if (!token) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}ml=${encodeURIComponent(token)}`;
}

