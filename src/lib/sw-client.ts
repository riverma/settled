// Registers the service worker in production builds and asks for a fresh worker when
// the browser comes back to the foreground (a standalone app can sit for days).
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js');
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w?.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) {
            // a new version is ready; the next reload picks it up
            w.postMessage('skip-waiting');
          }
        });
      });
      waitForController();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    } catch (e) {
      console.warn('service worker registration failed', e);
    }
  });
}

function waitForController(): void {
  // nothing to do; reload applies the new shell automatically via skip-waiting + claim
}