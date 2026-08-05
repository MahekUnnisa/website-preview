const DEFAULT_CHROME_WEBSTORE_URL =
  'https://chromewebstore.google.com/detail/zeroai-your-ai-work-assis/hplbpdkajdhlggncdpdmnkjldopmoomg';

/** Build-time config: Vite inlines `VITE_*` from `.env.local` (dev) or the Cloudflare Pages env (build). */
export function getEnv(key, fallback = '') {
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
