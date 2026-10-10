<script lang="ts">
  import { app } from '$lib/store.svelte';

  const theme = $derived(app.theme);
</script>

<div class="screen">
  <div class="ah-hdr">
    <button class="back" onclick={() => app.nav('home')}><small>← Home</small></button>
    <span class="hdr-spacer"></span>
    <span class="wordmark" style="font-size: 16px;">Settings</span>
  </div>

  <div class="scroll">
    <div class="ah-card ah-card--list">
      <p class="ah-caps" style="margin-bottom: 12px;">Appearance</p>
      <div class="ah-actions ah-actions--eq">
        <span class="ah-hit" style="flex: 1;"><button class="ah-chip" class:is-selected={theme === 'day'} onclick={() => app.setTheme('day')}>Day</button></span>
        <span class="ah-hit" style="flex: 1;"><button class="ah-chip" class:is-selected={theme === 'night'} onclick={() => app.setTheme('night')}>Night</button></span>
      </div>
    </div>

    <div class="ah-card ah-card--list">
      <p class="ah-caps" style="margin-bottom: 12px;">Data</p>
      <div class="ah-actions">
        <button class="ah-btn ah-btn--ghost ah-btn--sm" onclick={() => app.exportAll()}>Back up now</button>
        <button class="ah-btn ah-btn--ghost ah-btn--sm" onclick={() => app.openImport()}>Import decisions</button>
      </div>
      <p class="ah-caption caption-sub" style="margin: 12px 0 0;">Every export is one plain YAML file, yours to keep anywhere. Nothing ever leaves the device unless you choose to.</p>
    </div>

    <button class="ah-card ah-card--list is-tappable" style="text-align:left;width:100%;background:var(--surface-elevated);" onclick={() => (app.sheet = 'about')}>
      <p class="ah-caps" style="margin-bottom: 6px;">About</p>
      <p class="ah-body" style="color: var(--text-secondary);">Settled v{__APP_VERSION__} · AGPL-3.0 · offline · no accounts · no analytics</p>
    </button>

    <button class="ah-card ah-card--list is-tappable" style="text-align:left;width:100%;background:var(--surface-elevated);" onclick={() => (app.sheet = 'erase-1')}>
      <p class="ah-caps" style="color: var(--accent-warning); margin-bottom: 6px;">Start over</p>
      <p class="ah-body" style="color: var(--text-secondary);">Erase all data</p>
    </button>
  </div>
</div>