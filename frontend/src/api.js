export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof window === 'undefined') {
    return configuredUrl || 'http://127.0.0.1:8001';
  }

  const localHosts = ['localhost', '127.0.0.1'];

  if (configuredUrl) {
    const url = new URL(configuredUrl);

    if (localHosts.includes(url.hostname) && localHosts.includes(window.location.hostname)) {
      url.hostname = window.location.hostname;
      return url.origin;
    }

    return configuredUrl;
  }

  if (localHosts.includes(window.location.hostname) && window.location.port === '5173') {
    return `${window.location.protocol}//${window.location.hostname}:8001`;
  }

  return '';
}

export const API_BASE_URL = getApiBaseUrl();
