export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const apiUrl = (path) => `${API_BASE}${path}`;

export const getAdminToken = () => sessionStorage.getItem('adminToken');

export const clearAdminToken = () => sessionStorage.removeItem('adminToken');

export async function authFetch(path, options = {}) {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(apiUrl(path), { ...options, headers });
  if (response.status === 401) {
    clearAdminToken();
    window.location.assign('/admin');
  }
  return response;
}

export async function readApiError(response) {
  try {
    const body = await response.json();
    if (Array.isArray(body.detail)) {
      return body.detail.map((item) => item.msg).join(', ');
    }
    return body.detail || 'Request failed';
  } catch {
    return `Request failed (${response.status})`;
  }
}
