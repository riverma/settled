<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T, METHOD_INFO } from '$lib/strings';
  import { weighSums } from '$lib/core/engine';

  const screen = $derived(app.screen);
  const work = $derived(app.draftWork);
  const rows = $derived(app.weighRows);
  const order = $derived(weighSums(rows, work.criteria ?? [], work.weights ?? {}, work.scores ?? {}).slice().sort((a, b) => b.sum - a.sum));

  function back(): void {
    const prev: Record<string, string> = { 'wp-2': 'wp-1', 'wp-3': 'wp-2', 'wp-4': 'wp-3' };
    if (screen === 'wp-1') app.stopNow();
    else app.nav(prev[screen] as never);
  }
  function scoreKey(ri: number, ci: number): string {
    return `${ri}:${ci}`;
  }
  function scoreAt(ri: number, ci: number): number {
    return work.scores?.[scoreKey(ri, ci)] ?? 0;
  }
  function stepN(n: number): string {
    return `Step ${n} of 4`;
  }
</script>

<div class="screen cream">
  <div class="ah-hdr">
    <button class="back" onclick={back}><small>{screen === 'wp-1' ? T.stop : T.back}</small></button>
  </div>

  {#if screen === 'wp-1'}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">{stepN(1)}</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: 25%"></span></span></div>
      <p class="ah-heading-l">What matters here?</p>
      <p class="ah-caption caption-sub">Two to five things, in your own words.</p>
      <div style="margin-top: 6px;">
        {#each work.criteria ?? [] as c, i (i)}
          <div class="crit-row">
            <div class="ah-field">
              <input type="text" value={c} aria-label={`Criterion ${i + 1}`}
                oninput={(e) => app.critInput(i, (e.currentTarget as HTMLInputElement).value)} />
            </div>
            <button aria-label="Remove criterion" onclick={() => app.removeCrit(i)}>×</button>
          </div>
        {/each}
      </div>
      <div><button class="ah-btn ah-btn--ghost ah-btn--sm" onclick={() => app.addCrit()}>Add one</button></div>
      <div class="ah-notice" class:hidden={rows.length >= 8}>
        <span class="ah-notice__title">One more option?</span>
        <span>Sometimes the third shape is the one that fits. Curiosity, not homework.</span>
        <span class="ah-actions"><button class="ah-btn ah-btn--ghost ah-btn--sm" onclick={() => app.addOption()}>{T.addOption}</button></span>
      </div>
      <p class="ah-caption caption-sub">Why this works: <button class="mk-link" onclick={() => app.openInfo(METHOD_INFO['weigh-it-up'].title, METHOD_INFO['weigh-it-up'].body)}>a decision matrix</button>.</p>
    </div>
    <div class="footer-actions">
      <div class="ah-actions ah-actions--eq">
        <button class="ah-btn ah-btn--ghost" onclick={() => (app.sheet = 'ways')}>{T.differentWay}</button>
        <button class="ah-btn" onclick={() => app.wpToWeights()}>{T.continue}</button>
      </div>
      <button class="ah-btn ah-btn--glass ah-btn--sm" onclick={() => app.stopNow()}>{T.stopForNow}</button>
    </div>

  {:else if screen === 'wp-2'}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">{stepN(2)}</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: 50%"></span></span></div>
      <p class="ah-heading-l">How much does each one matter?</p>
      <p class="ah-caption caption-sub">Words, not numbers. The arithmetic stays underneath.</p>
      {#each work.criteria ?? [] as c (c)}
        <div class="ah-card ah-card--list">
          <p style="font-family: var(--font-display); font-size: 16px; color: var(--text-heading); margin: 0 0 12px;">{c}</p>
          <div class="ah-actions ah-actions--eq">
            <span class="ah-hit" style="flex: 1;"><button class="ah-chip" class:is-selected={work.weights?.[c] === 1} onclick={() => app.setWeight(c, 1)}>A little</button></span>
            <span class="ah-hit" style="flex: 1;"><button class="ah-chip" class:is-selected={work.weights?.[c] === 2} onclick={() => app.setWeight(c, 2)}>Somewhat</button></span>
            <span class="ah-hit" style="flex: 1;"><button class="ah-chip" class:is-selected={work.weights?.[c] === 3} onclick={() => app.setWeight(c, 3)}>A lot</button></span>
          </div>
        </div>
      {/each}
    </div>
    <div class="footer-actions">
      <button class="ah-btn ah-btn--wide" onclick={() => app.wpToScores()}>{T.continue}</button>
    </div>

  {:else if screen === 'wp-3'}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">{stepN(3)}</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: 75%"></span></span></div>
      <p class="ah-heading-l">How well does each option fit?</p>
      <p class="ah-caption caption-sub">Tap a cell to cycle: well · partly · poorly.</p>
      <div class="ah-card ah-card--flat ah-card--p0" style="overflow: auto;">
        <div class="grid-wrap" style="padding: 4px 18px 18px;">
          <table class="mk-grid">
            <thead>
              <tr>
                <th>Options</th>
                {#each work.criteria ?? [] as c (c)}<th>{c}</th>{/each}
              </tr>
            </thead>
            <tbody>
              {#each rows as r, ri (r)}
                <tr>
                  <td class="g-opt">{r}</td>
                  {#each work.criteria ?? [] as c, ci (ci)}
                    <td>
                      <button class="cell" class:is-1={scoreAt(ri, ci) === 1} class:is-2={scoreAt(ri, ci) === 2}
                        aria-label={`${r} on ${c}`} onclick={() => app.scoreCell(scoreKey(ri, ci))}>
                        <i></i><i></i>
                      </button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="footer-actions">
      <button class="ah-btn ah-btn--wide" onclick={() => app.wpToRank()}>See how they line up</button>
    </div>

  {:else}
    <div class="scroll">
      <div class="stepmark"><span class="ah-caps">{stepN(4)}</span><span class="stepmark__bar"><span class="stepmark__fill" style="width: 100%"></span></span></div>
      <p class="ah-heading-l">Here is how they line up</p>
      <p class="ah-caption caption-sub">A quiet ordering, not a scoreboard. The arithmetic is not the verdict.</p>
      <div class="rank" style="margin-top: 8px;">
        {#each order as o, i (o.name)}
          <div class="rank-item">
            <span class="ah-mono ah-mono--s20" class:ah-mono--sunk={i > 0}>{i + 1}</span>
            <span class="rank-item__t">{o.name}</span>
          </div>
        {/each}
      </div>
      <div class="ah-card">
        <p class="ah-body" style="font-weight: 600; color: var(--text-heading);">Does the top of the list change how you feel about it?</p>
        <p class="ah-caption caption-sub" style="margin: 2px 0 12px;">You can overrule it in the sentence either way.</p>
        <div class="ah-actions ah-actions--eq">
          <button class="ah-btn" onclick={() => app.nav('real')}>It fits</button>
          <button class="ah-btn ah-btn--ghost" onclick={() => app.nav('real')}>It doesn't</button>
        </div>
      </div>
    </div>
  {/if}
</div>