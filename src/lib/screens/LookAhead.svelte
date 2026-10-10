<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T, METHOD_INFO } from '$lib/strings';

  const screen = $derived(app.screen);
  const work = $derived(app.draftWork);

  const step = $derived(
    screen === 'la-1' ? 1 : screen === 'la-2' ? 2 : screen === 'la-3' ? 3 : screen === 'la-4' ? 4 : 5
  );
  const steps = $derived([
    { n: '10 min', t: work.ten_minutes || 'Nothing written, and that is fine.' },
    { n: '10 months', t: work.ten_months || 'Nothing written, and that is fine.' },
    { n: '10 years', t: work.ten_years || 'Nothing written, and that is fine.' }
  ]);

  function back(): void {
    const prev: Record<string, string> = { 'la-2': 'la-1', 'la-3': 'la-2', 'la-4': 'la-3', 'la-5': 'la-4' };
    if (screen === 'la-1') app.stopNow();
    else app.nav(prev[screen] as never);
  }
  function heading(): string {
    return screen === 'la-1' ? 'In ten minutes' : screen === 'la-2' ? 'In ten months' : screen === 'la-3' ? 'In ten years' : 'The regret check';
  }
</script>

<div class="screen deeper">
  <div class="ah-hdr">
    <button class="back" onclick={back}><small>{screen === 'la-1' ? T.stop : T.back}</small></button>
  </div>

  {#if step <= 3}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">Step {step} of 5</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: {step * 20}%"></span></span></div>
      <p class="ah-heading-l">{heading()}</p>
      <p class="ah-caption caption-sub">
        {#if step === 1}How will you feel about each way it could go, ten minutes after you choose?
        {:else if step === 2}The same question, further out.
        {:else}This one usually dissolves the noise.{/if}
      </p>
      <div class="ah-field ah-field--essence" style="margin-top: 8px;">
        <textarea value={step === 1 ? (work.ten_minutes ?? '') : step === 2 ? (work.ten_months ?? '') : (work.ten_years ?? '')}
          placeholder={step === 1 ? 'Probably relieved. A bit scared.' : step === 2 ? 'Probably glad I moved.' : "I won't remember the fear."}
          oninput={(e) => app.laInput(step === 1 ? 'ten_minutes' : step === 2 ? 'ten_months' : 'ten_years', (e.currentTarget as HTMLTextAreaElement).value)}></textarea>
      </div>
      {#if step === 1}
        <p class="ah-caption caption-sub">Nothing here is required. Say as much or as little as there is.</p>
      {/if}
    </div>
    <div class="footer-actions">
      {#if step === 1}
        <div class="ah-actions ah-actions--eq">
          <button class="ah-btn ah-btn--ghost" onclick={() => (app.sheet = 'ways')}>{T.differentWay}</button>
          <button class="ah-btn" onclick={() => app.laNext()}>{T.continue}</button>
        </div>
        <button class="ah-btn ah-btn--glass ah-btn--sm" onclick={() => app.stopNow()}>{T.stopForNow}</button>
      {:else}
        <button class="ah-btn ah-btn--wide" onclick={() => app.laNext()}>{T.continue}</button>
      {/if}
    </div>

  {:else if step === 4}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">Step 4 of 5</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: 80%"></span></span></div>
      <p class="ah-heading-l">The regret check</p>
      <p class="ah-caption caption-sub">Picture it a year from now, and it went wrong. What is the most likely reason?</p>
      <div class="ah-field" style="margin-top: 8px;">
        <span class="ah-field__label">Most likely cause</span>
        <textarea value={work.regret_cause ?? ''} placeholder="The team turns out to be toxic."
          oninput={(e) => app.laInput('regret_cause', (e.currentTarget as HTMLTextAreaElement).value)}></textarea>
      </div>
      <div class="ah-field" style="margin-top: 14px;">
        <span class="ah-field__label">Can you guard against it before you decide?</span>
        <textarea value={work.regret_guard ?? ''} placeholder="Ask to meet the team first."
          oninput={(e) => app.laInput('regret_guard', (e.currentTarget as HTMLTextAreaElement).value)}></textarea>
      </div>
      <p class="ah-caption caption-sub">Why this works: a <button class="mk-link" onclick={() => app.openInfo(METHOD_INFO['look-ahead'].title, METHOD_INFO['look-ahead'].body)}>pre-mortem</button>.</p>
    </div>
    <div class="footer-actions">
      <button class="ah-btn ah-btn--wide" onclick={() => app.laNext()}>{T.continue}</button>
    </div>

  {:else}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">Step 5 of 5</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: 100%"></span></span></div>
      <p class="ah-heading-l">What the horizons said</p>
      <p class="ah-caption caption-sub">Your three horizons, side by side. The gaps are usually the message.</p>
      <div class="rank" style="margin-top: 8px;">
        {#each steps as r (r.n)}
          <div class="rank-item">
            <span class="ah-mono ah-mono--s20 ah-mono--sunk" style="width: auto; min-width: 34px; padding: 0 6px; font-size: 10px;">{r.n}</span>
            <span class="rank-item__t" style="font-weight: 400;">{r.t}</span>
          </div>
        {/each}
      </div>
      <div class="ah-notice">
        <span class="ah-notice__title">The fear has a name now</span>
        <span>Whatever you wrote, naming it is usually enough to loosen the stuck feeling.</span>
      </div>
    </div>
    <div class="footer-actions">
      <button class="ah-btn ah-btn--wide" onclick={() => app.nav('real')}>{T.continue}</button>
    </div>
  {/if}
</div>