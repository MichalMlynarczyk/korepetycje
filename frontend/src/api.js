export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof window === 'undefined') {
    return configuredUrl ?? 'http://127.0.0.1:8000';
  }

  if (!configuredUrl) {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  const url = new URL(configuredUrl);
  const localHosts = ['localhost', '127.0.0.1'];

  if (localHosts.includes(url.hostname) && localHosts.includes(window.location.hostname)) {
    url.hostname = window.location.hostname;
    return url.origin;
  }

  return configuredUrl;
}

export const API_BASE_URL = getApiBaseUrl();
