<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T } from '$lib/strings';
  import { statusLabel, shortDate, methodName } from '$lib/core/types';
  import { STAKES } from '$lib/strings';

  const stakeWord = (k?: string) => STAKES.find((s) => s.key === k)?.word;

  const d = $derived(app.viewed());
  const label = $derived.by(() => (d ? `${statusLabel(d)} · ${shortDate(d.updated)}` : ''));

  const workRows = $derived.by(() => {
    if (!d) return [];
    const rows: { label: string; value: string }[] = [];
    if (d.stakes) rows.push({ label: 'Stakes', value: `${stakeWord(d.stakes) ?? d.stakes} · Method: ${methodName(d.method)}` });
    if (d.options.length) rows.push({ label: 'Options', value: d.options.join(' · ') });
    if (d.noOptions && !d.options.length) rows.push({ label: 'Options', value: 'none, just thinking' });
    const w = d.work ?? {};
    for (const k of Object.keys(w)) {
      if (['criteria', 'weights', 'scores', 'rowsSeeded'].includes(k)) continue;
      const v = Array.isArray(w[k as keyof typeof w]) ? (w[k as keyof typeof w] as unknown[]).join(' · ') : String(w[k as keyof typeof w]);
      const labelMap: Record<string, string> = {
        bar: 'Bar', chosen: 'Chosen', ten_minutes: 'Ten minutes', ten_months: 'Ten months', ten_years: 'Ten years',
        regret_cause: 'Most likely cause', regret_guard: 'Guard'
      };
      rows.push({ label: labelMap[k] ?? k, value: v });
    }
    return rows;
  });
</script>

<div class="screen">
  <div class="ah-hdr">
    <button class="back" onclick={() => app.nav('home')}><small>{T.home}</small></button>
  </div>

  {#if d}
    <div class="scroll">
      <div class="meta" style="display: flex; align-items: center; gap: 7px; margin: 4px 0 6px;">
        <span class="ah-pill ah-pill--static">{label}</span>
      </div>
      <p class="ah-heading-l" style="font-size: 23px;">{d.question}</p>

      {#if d.status === 'decided'}
        <div class="ah-card" style="margin-top: 14px;">
          <p class="ah-caps" style="margin-bottom: 8px;">The decision</p>
          <p class="ah-quote ah-quote--md" style="text-align: left; font-size: 19px;">{d.sentence}</p>
          {#if d.first_step}
            <p class="ah-body" style="margin-top: 14px; color: var(--text-secondary);"><strong>First step:</strong> {d.first_step}</p>
          {/if}
          {#if d.when}
            <p class="ah-body" style="margin-top: 4px; color: var(--text-secondary);"><strong>When:</strong> {d.when}</p>
          {/if}
          <p class="ah-caption caption-sub" style="margin-top: 14px;">Reopening is free. Changing your mind is not failing.</p>
        </div>
      {/if}

      <div class="ah-card ah-card--list">
        <p class="ah-caps" style="margin-bottom: 8px;">What it held</p>
        {#if workRows.length === 0}
          <p class="ah-body" style="color: var(--text-muted);">Nothing yet. It was a draft.</p>
        {:else}
          {#each workRows as r (r.label + r.value)}
            <p class="ah-body" style="color: var(--text-secondary);">
              <strong>{r.label}:</strong> <span style="color: var(--text-body);">{r.value}</span>
            </p>
          {/each}
        {/if}
      </div>
    </div>

    <div class="footer-actions">
      <div class="ah-actions ah-actions--eq">
        <button class="ah-btn ah-btn--ghost" onclick={() => app.openExport()}>{T.export}</button>
        <button class="ah-btn ah-btn--danger" onclick={() => app.requestDelete()}>Delete</button>
      </div>
    </div>
  {/if}
</div>