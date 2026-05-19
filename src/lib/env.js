const DEFAULT_CHROME_WEBSTORE_URL =
  'https://chromewebstore.google.com/detail/zeroai-your-ai-work-assis/hplbpdkajdhlggncdpdmnkjldopmoomg';

function getRuntimeEnv(key) {
  if (typeof window === 'undefined') return undefined;
  const bag = window.__ENV__;
  if (!bag || typeof bag !== 'object') return undefined;
  const v = bag[key];
  if (v !== undefined && v !== null && String(v) !== '') return String(v);
  return undefined;
}

/** Prefer runtime config (Docker/nginx entrypoint → `/runtime-env.js`), then Vite `import.meta.env` (dev / build). */
export function getEnv(key, fallback = '') {
  const runtime = getRuntimeEnv(key);
  if (runtime !== undefined) return runtime;
  const built = import.meta.env[key];
  if (built !== undefined && built !== '') return String(built);
  return fallback;
}

export function getApiBase() {
  return getEnv('VITE_API_BASE_URL').replace(/\/$/, '');
}

export function getExtensionId() {
  return getEnv('VITE_EXTENSION_ID').trim();
}

export function getChromeWebStoreUrl() {
  return getEnv('VITE_CHROME_WEBSTORE_URL', DEFAULT_CHROME_WEBSTORE_URL).trim() || DEFAULT_CHROME_WEBSTORE_URL;
}
