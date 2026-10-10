<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T } from '$lib/strings';
  import { otherWays } from '$lib/core/engine';
  import { yamlFileName } from '$lib/formats';

  const sheet = $derived(app.sheet);
  const draft = $derived(app.draft);
  const ways = $derived(otherWays(draft?.method));

  function copy(): void {
    const t = app.exportText;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(t).then(() => app.toast('Copied to the clipboard.'));
    } else {
      app.toast('Select the text above and copy it.');
    }
  }

  function download(): void {
    const blob = new Blob([app.exportText], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = app.exportName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    app.toast(`Downloaded ${app.exportName}. Plain YAML, yours to keep.`);
  }
</script>

<div class="ah-scrim" role="presentation" class:hidden={sheet === null} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={() => (app.sheet = null)}>
  <!-- A different way -->
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-label="A different way" tabindex="-1" class:is-open={sheet === 'ways'} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={(e) => e.stopPropagation()}>
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h3 class="ah-sheet__title">A different way</h3>
      <button class="ah-sheet__close" onclick={() => (app.sheet = null)}>×</button>
    </div>
    <p class="ah-caption caption-sub" style="margin-bottom: 12px;">Each method is one proven tool. Nothing you wrote is lost.</p>
    <div class="ah-list">
      {#each ways as w (w.method)}
        <button class="ah-card ah-card--list" onclick={() => app.switchMethod(w.method)}>
          <span class="t" style="display: block; font-size: 14px; font-weight: 600; color: var(--text-heading);">{w.title}</span>
          <span class="d" style="display: block; font-size: 11.5px; color: var(--text-muted); margin-top: 3px; line-height: 1.4;">{w.why}</span>
        </button>
      {/each}
    </div>
    <div class="ah-actions" style="margin-top: 14px;"><button class="ah-btn ah-btn--ghost" style="flex: 1;" onclick={() => (app.sheet = null)}>{T.dontAsk}</button></div>
  </div>

  <!-- Why this works -->
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-label="Why this works" tabindex="-1" class:is-open={sheet === 'info'} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={(e) => e.stopPropagation()}>
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h3 class="ah-sheet__title">{app.sheetInfo?.title ?? 'Why this works'}</h3>
      <button class="ah-sheet__close" onclick={() => (app.sheet = null)}>×</button>
    </div>
    <p class="ah-body" style="line-height: 1.6; color: var(--text-secondary); font-size: 13.5px;">{app.sheetInfo?.body}</p>
    <div class="ah-actions" style="margin-top: 14px;"><button class="ah-btn" style="flex: 1;" onclick={() => (app.sheet = null)}>{T.continue}</button></div>
  </div>

  <!-- Export -->
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-label="Export" tabindex="-1" class:is-open={sheet === 'export'} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={(e) => e.stopPropagation()}>
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h3 class="ah-sheet__title">Export</h3>
      <button class="ah-sheet__close" onclick={() => (app.sheet = null)}>×</button>
    </div>
    <p class="ah-caption caption-sub" style="margin-bottom: 12px;">Plain YAML, no custom format. Any YAML tool reads it; the app reads it back.</p>
    <p class="yaml-caps">{app.exportName}</p>
    <pre class="yaml" id="exp-yaml" data-testid="exp-yaml">{app.exportText}</pre>
    <div class="ah-actions" style="margin-top: 12px;">
      <button class="ah-btn ah-btn--ghost" onclick={copy}>Copy</button>
      <button class="ah-btn ah-btn--ghost" onclick={download}>Download</button>
      <button class="ah-btn" onclick={() => (app.sheet = null)}>{T.done}</button>
    </div>
  </div>

  <!-- Import -->
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-label="Import" tabindex="-1" class:is-open={sheet === 'import'} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={(e) => e.stopPropagation()}>
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h3 class="ah-sheet__title">Import</h3>
      <button class="ah-sheet__close" onclick={() => (app.sheet = null)}>×</button>
    </div>
    <p class="ah-caption caption-sub" style="margin-bottom: 12px;">Paste a Settled YAML file. Nothing already here is overwritten.</p>
    <textarea class="import-area" value={app.importText}
      oninput={(e) => (app.importText = (e.currentTarget as HTMLTextAreaElement).value)}></textarea>
    <div class="ah-actions" style="margin-top: 12px;">
      <button class="ah-btn ah-btn--ghost" onclick={() => app.parseImport(app.importText)}>Read the file</button>
    </div>
    {#if app.importError}
      <p class="ah-notice" style="margin-top: 10px;"><span class="ah-notice__title">That file could not be read</span><span>{app.importError}</span></p>
    {/if}
    {#if app.importPreview}
      <div class="ah-card ah-card--list" style="margin-top: 10px;">
        <p class="ah-caps" style="margin-bottom: 6px;">Found {app.importPreview.length} decision{app.importPreview.length === 1 ? '' : 's'}</p>
        {#each app.importPreview.slice(0, 5) as p (p.id)}
          <p class="ah-body" style="margin: 4px 0; color: var(--text-heading);">{p.question}</p>
        {/each}
        <button class="ah-btn" style="width: 100%; margin-top: 10px;" onclick={() => app.commitImport()}>Add them</button>
      </div>
    {/if}
  </div>

  <!-- Delete a decision -->
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-label="Delete this decision?" tabindex="-1" class:is-open={sheet === 'confirm-delete'} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={(e) => e.stopPropagation()}>
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h3 class="ah-sheet__title">Delete this decision?</h3>
      <button class="ah-sheet__close" onclick={() => (app.sheet = null)}>×</button>
    </div>
    <p class="ah-body" style="color: var(--text-secondary);">Everything you wrote for it goes. It is not kept anywhere.</p>
    <div class="ah-actions" style="margin-top: 14px;">
      <button class="ah-btn ah-btn--ghost" style="flex: 1;" onclick={() => (app.sheet = null)}>{T.keepIt}</button>
      <button class="ah-btn ah-btn--danger" style="flex: 1;" onclick={() => app.doDelete()}>Delete it</button>
    </div>
  </div>

  <!-- Erase all, step one -->
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-label="Erase all data?" tabindex="-1" class:is-open={sheet === 'erase-1'} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={(e) => e.stopPropagation()}>
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h3 class="ah-sheet__title">Erase all data?</h3>
      <button class="ah-sheet__close" onclick={() => (app.sheet = null)}>×</button>
    </div>
    <p class="ah-body" style="color: var(--text-secondary);">Every decision goes. Consider a backup first.</p>
    <div class="ah-actions" style="margin-top: 14px;">
      <button class="ah-btn ah-btn--ghost" style="flex: 1;" onclick={() => { app.exportAll(); }}>Back up first</button>
      <button class="ah-btn ah-btn--danger" style="flex: 1;" onclick={() => (app.sheet = 'erase-2')}>Continue</button>
    </div>
  </div>

  <!-- Erase all, step two -->
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-label="This is the last time it asks" tabindex="-1" class:is-open={sheet === 'erase-2'} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={(e) => e.stopPropagation()}>
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h3 class="ah-sheet__title">This is the last time it asks</h3>
      <button class="ah-sheet__close" onclick={() => (app.sheet = null)}>×</button>
    </div>
    <p class="ah-body" style="color: var(--text-secondary);">After this, there is no undo. That is on purpose.</p>
    <div class="ah-actions" style="margin-top: 14px;">
      <button class="ah-btn ah-btn--ghost" style="flex: 1;" onclick={() => (app.sheet = null)}>Keep everything</button>
      <button class="ah-btn ah-btn--danger" style="flex: 1;" onclick={() => app.doErase()}>Erase all data</button>
    </div>
  </div>

  <!-- About -->
  <div class="ah-sheet" role="dialog" aria-modal="true" aria-label="About Settled" tabindex="-1" class:is-open={sheet === 'about'} onkeydown={(e) => { if ((e as KeyboardEvent).key === "Escape") app.sheet = null; }} onclick={(e) => e.stopPropagation()}>
    <div class="ah-sheet__grab"></div>
    <div class="ah-sheet__head">
      <h3 class="ah-sheet__title">Settled</h3>
      <button class="ah-sheet__close" onclick={() => (app.sheet = null)}>×</button>
    </div>
    <p class="ah-body" style="line-height: 1.65; color: var(--text-secondary); font-size: 13.5px;">
      A pocket decision coach. It never recommends an option and never implies being torn is a failing.
      Every method here is a real, named, evidence-backed tool: satisficing, the decision matrix,
      10/10/10 with a pre-mortem, and the implementation intention.<br /><br />
      Runs entirely on your device. No accounts, no ads, no analytics.<br /><br />
      Created by Rishi Verma · © 2026 · AGPL-3.0
    </p>
    <div class="ah-actions" style="margin-top: 14px;"><button class="ah-btn" style="flex: 1;" onclick={() => (app.sheet = null)}>{T.continue}</button></div>
  </div>
</div>
