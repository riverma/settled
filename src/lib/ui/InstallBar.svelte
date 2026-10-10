<script lang="ts">
  // The launcher's `#install` contract and the browser's own install prompt, in one quiet bar.
  import { onMount } from 'svelte';
  import { app } from '$lib/store.svelte';
  import { T } from '$lib/strings';

  let deferred: (Event & { prompt: () => Promise<void> }) | null = $state(null);
  let shown = $state(false);
  let installed = $state(false);

  const standalone = $derived(
    typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true)
  );
  const ios = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  const line = $derived(
    installed ? T.install.installed : deferred ? T.install.prompt : ios ? T.install.ios : T.install.generic
  );

  onMount(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferred = e as typeof deferred;
      if (app.installRequested && !installed) shown = true;
    });
    window.addEventListener('appinstalled', () => {
      installed = true;
      deferred = null;
      setTimeout(() => (shown = false), 3000);
    });
  });

  $effect(() => {
    if (app.installRequested && !standalone && !installed) shown = true;
  });

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    deferred = null;
    shown = false;
  }

  function close() {
    shown = false;
    app.installRequested = false;
  }
</script>

{#if shown}
  <div class="install-bar" role="status">
    <span class="ib-copy">{line}</span>
    {#if deferred && !installed}
      <button class="ah-btn ah-btn--sm" onclick={install}>{T.install.button}</button>
    {/if}
    <button class="ib-x" aria-label="Close" onclick={close}>×</button>
  </div>
{/if}

<style>
  .install-bar {
    position: fixed;
    left: 12px;
    right: 12px;
    top: calc(var(--top-pad, env(safe-area-inset-top, 0px)) + 8px);
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px 12px 10px 16px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    background: var(--surface-elevated);
    box-shadow: var(--shadow-md);
  }
  .ib-copy {
    flex: 1;
    color: var(--text-body);
    font-size: 13px;
    line-height: 1.35;
  }
  .ib-x {
    flex-shrink: 0;
    border: none;
    background: var(--surface-sunk);
    color: var(--text-secondary);
    width: 28px;
    height: 28px;
    border-radius: var(--radius-full);
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
  }
</style>
