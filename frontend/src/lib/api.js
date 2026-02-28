/**
 * API helper — usa VITE_API_URL en producción, proxy local en dev.
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

export function apiFetch(path, options = {}) {
    return fetch(`${API_BASE}${path}`, options);
}