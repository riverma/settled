<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T, METHOD_INFO } from '$lib/strings';

  const screen = $derived(app.screen);
  const draft = $derived(app.draft);
  const current = $derived(app.geCurrentOption());
  const cleared = $derived(app.geCleared);
  const opts = $derived(draft?.options ?? []);

  function back(): void {
    if (screen === 'ge-check' || screen === 'ge-result') app.nav('ge-bar');
    else app.stopNow();
  }
</script>

<div class="screen">
  <div class="ah-hdr">
    <button class="back" onclick={back}><small>{screen === 'ge-bar' ? T.stop : T.back}</small></button>
  </div>

  {#if screen === 'ge-bar'}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">Step 1 of 2</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: 50%"></span></span></div>
      <p class="ah-heading-l">What would good enough look like?</p>
      <p class="ah-caption caption-sub">Name the smallest bar this decision would be glad to clear. When something clears it, you can stop looking and go.</p>
      <div class="ah-field ah-field--essence" style="margin-top: 8px;">
        <textarea value={draft?.work.bar ?? ''} placeholder="Close, cheap, open now" style="min-height: 70px;"
          oninput={(e) => app.geBar((e.currentTarget as HTMLTextAreaElement).value)}></textarea>
      </div>
      {#if opts.length === 0}
        <p class="ah-caption caption-sub">Since you have no options down yet, the bar is the whole test. Does what you might do clear it?</p>
      {/if}
      <p class="ah-caption caption-sub">Why this works: <button class="mk-link" onclick={() => app.openInfo(METHOD_INFO['good-enough'].title, METHOD_INFO['good-enough'].body)}>satisficing</button>.</p>
    </div>
    <div class="footer-actions">
      <div class="ah-actions ah-actions--eq">
        <button class="ah-btn ah-btn--ghost" onclick={() => (app.sheet = 'ways')}>{T.differentWay}</button>
        <button class="ah-btn" onclick={() => app.geToCheck()}>{T.continue}</button>
      </div>
      <button class="ah-btn ah-btn--glass ah-btn--sm" onclick={() => app.stopNow()}>{T.stopForNow}</button>
    </div>

  {:else if screen === 'ge-check'}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">Step 2 of 2</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: 100%"></span></span></div>
      <p class="ah-heading-l">Does it clear the bar?</p>
      <p class="ah-caption caption-sub" id="ge-check-q">
        {#if opts.length === 0}No options, so the bar is the only test. Does what you might do clear it?{:else}Checking options, in order. The first yes is yours.{/if}
      </p>
      <div class="ah-card ah-card--list">
        {#if opts.length === 0}
          <p style="font-family: var(--font-display); font-size: 18px; color: var(--text-heading); margin: 0;">{draft?.question}</p>
        {:else}
          <p style="font-family: var(--font-display); font-size: 18px; color: var(--text-heading); margin: 0;">{current ?? ''}</p>
          <p class="ah-caption caption-sub" style="margin: 8px 0 0;">Your bar: {draft?.work.bar}</p>
        {/if}
      </div>
      <div class="ah-actions ah-actions--eq">
        <button class="ah-btn ah-btn--ghost" onclick={() => app.geAnswer('no')}>No</button>
        <button class="ah-btn" onclick={() => app.geAnswer('yes')}>Yes</button>
      </div>
      <button class="ah-pill ah-pill--outline" style="align-self: flex-start; margin-top: 6px;" onclick={() => app.geAnswer('notsure')}>Not sure yet · keep it aside</button>
    </div>

  {:else}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">Settled</span></div>
      <p class="ah-heading-l" id="ge-result-title">{cleared ? 'Then take it.' : 'Nothing here clears the bar.'}</p>
      <p class="ah-quote ah-quote--md" id="ge-result-sub" style="text-align: left; color: var(--text-secondary);">
        {cleared
          ? opts.length === 0
            ? 'It clears the bar.'
            : `It clears the bar. ${draft?.work.chosen} is your answer.`
          : "That is an answer too: don't pick one of these for the sake of it."}
      </p>
    </div>
    <div class="footer-actions">
      <button class="ah-btn ah-btn--wide" onclick={() => app.nav('real')}>{T.continue}</button>
    </div>
  {/if}
</div>