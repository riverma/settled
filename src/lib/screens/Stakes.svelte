<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T } from '$lib/strings';

  const draft = $derived(app.draft);
</script>

<div class="screen">
  <div class="ah-hdr">
    <button class="back" onclick={() => app.stopNow()}><small>{T.stop}</small></button>
  </div>

  <div class="scroll">
    <p class="ah-heading-l">{T.stakesTitle}</p>
    <p class="ah-caption caption-sub">{T.stakesSub}</p>
    <div class="ah-stack" style="margin-top: 10px; gap: 10px;">
      {#each T.stakes as s}
        <button class="stake" data-stakes={s.key} class:is-selected={draft?.stakes === s.key} onclick={() => app.setStakes(s.key)}>
          <span class="stake__w">{s.word}</span>
          <span class="stake__g">{s.gloss}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="footer-actions">
    <button class="ah-btn ah-btn--wide" class:is-disabled={!draft?.stakes} onclick={() => app.startMethod()}>{T.continue}</button>
  </div>
</div>