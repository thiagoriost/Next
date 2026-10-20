export const AUTH_REDIRECT_STORAGE_KEY = 'luxeestate.auth-redirect';

export function getSafeRedirectTarget(
  target: string | null | undefined,
  fallback = '/',
): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return fallback;
  }

  return target;
}
