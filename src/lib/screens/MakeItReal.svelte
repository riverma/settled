<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T, METHOD_INFO } from '$lib/strings';
  import type { Screen } from '$lib/store.svelte';

  const draft = $derived(app.draft);

  function back(): void {
    const lastOf: Record<string, Screen> = { 'good-enough': 'ge-result', 'weigh-it-up': 'wp-4', 'look-ahead': 'la-5' };
    app.nav(lastOf[draft?.method ?? ''] ?? 'home');
  }
</script>

<div class="screen">
  <div class="ah-hdr">
    <button class="back" onclick={back}><small>{T.back}</small></button>
  </div>

  <div class="scroll">
    <div class="stepmark"><span class="ah-caps">The close · every decision ends here</span></div>
    <p class="ah-heading-l">Make it real</p>

    <div class="ah-field ah-field--essence" style="margin-top: 8px;">
      <span class="ah-field__label">The decision, in one sentence</span>
      <input id="r-sentence" type="text" value={draft?.sentence ?? ''} placeholder="I am taking the job."
        oninput={(e) => app.realInput('sentence', (e.currentTarget as HTMLInputElement).value)} />
    </div>
    <div class="ah-field" style="margin-top: 16px;">
      <span class="ah-field__label">The first step (optional)</span>
      <input id="r-step" type="text" value={draft?.first_step ?? ''} placeholder="Reply to the offer email."
        oninput={(e) => app.realInput('first_step', (e.currentTarget as HTMLInputElement).value)} />
    </div>
    <div class="ah-field" style="margin-top: 16px;">
      <span class="ah-field__label">When (optional)</span>
      <input id="r-when" type="text" value={draft?.when ?? ''} placeholder="Monday morning"
        oninput={(e) => app.realInput('when', (e.currentTarget as HTMLInputElement).value)} />
    </div>

    <p class="ah-caption caption-sub">There are no reminders here. This is for you, not for us.</p>
    <p class="ah-caption caption-sub">Why this works: <button class="mk-link" onclick={() => app.openInfo(METHOD_INFO['make-it-real'].title, METHOD_INFO['make-it-real'].body)}>an implementation intention</button>.</p>
  </div>

  <div class="footer-actions">
    <button class="ah-btn ah-btn--wide" onclick={() => app.saveDecision()}>{T.saveDecision}</button>
  </div>
</div>