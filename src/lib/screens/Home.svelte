<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T } from '$lib/strings';
  import { statusLabel, shortDate } from '$lib/core/types';

  const sorted = $derived(app.sorted());
</script>

<div class="screen">
  <div class="ah-hdr">
    <span class="wordmark">Settled</span>
    <span class="hdr-spacer"></span>
    <span class="ah-hit"><button class="ah-pill" onclick={() => app.nav('settings')}>Settings</button></span>
  </div>

  <div class="scroll">
    <p class="ah-caption caption-sub" style="margin: 2px 0 6px;">{T.homeLead}</p>

    {#if sorted.length > 0}
      <div class="list-grid">
        {#each sorted as d (d.id)}
          <button class="dec-row ah-card ah-card--list is-tappable" onclick={() => app.openDecision(d.id)}>
            <div class="q">{d.question}</div>
            <div class="meta">
              <span class="ah-pill ah-pill--static">{statusLabel(d)}{d.status === 'decided' ? ` · ${shortDate(d.updated)}` : ''}</span>
            </div>
            {#if d.status === 'decided' && d.sentence}
              <div class="sentence">{d.sentence}</div>
            {/if}
          </button>
        {/each}
      </div>
    {:else}
      <div class="empty">
        <p class="ah-heading-l" style="font-size: 32px;">What's on your mind?</p>
        <p class="ah-body" style="color: var(--text-secondary); max-width: 30em;">
          A decision, any size. You write it, Settled picks the lightest proven method to go with it.
        </p>
        <button class="ah-pill ah-pill--outline" style="padding: 10px 18px; font-size: 11px; margin-top: 8px;"
          onclick={() => app.startNew('Should I take the new job?')}>Take the new job?</button>
      </div>
    {/if}
  </div>

  <div class="footer-actions">
    <button class="ah-btn ah-btn--wide" onclick={() => app.startNew()}>{T.newDecision}</button>
  </div>
</div>