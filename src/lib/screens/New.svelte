<script lang="ts">
  import { app } from '$lib/store.svelte';
  import { T } from '$lib/strings';

  const draft = $derived(app.draft);
</script>

<div class="screen">
  <div class="ah-hdr">
    <button class="back" onclick={() => app.stopNow()}><small>← Home</small></button>
  </div>

  <div class="scroll">
    <p class="ah-display-m" style="margin: 8px 0 0; font-size: 32px;">{T.newTitle}</p>
    <p class="ah-caption caption-sub">{T.newSub}</p>

    <div class="ah-field ah-field--essence" style="margin-top: 8px;">
      <input
        id="f-question"
        type="text"
        value={draft?.question ?? ''}
        placeholder={T.newQuestionPlaceholder}
        oninput={(e) => app.questionInput((e.currentTarget as HTMLInputElement).value)}
      />
    </div>

    <div style="margin-top: 22px;">
      <p class="ah-caps" style="margin-bottom: 14px;">{T.optionsLabel}</p>
      <div>
        {#each draft?.options ?? [] as _, i (i)}
          <div class="opt-row">
            <div class="ah-field">
              <input
                type="text"
                value={draft?.options[i]}
                aria-label={`Option ${i + 1}`}
                oninput={(e) => app.setOption(i, (e.currentTarget as HTMLInputElement).value)}
              />
            </div>
            <button aria-label="Remove option" onclick={() => app.removeOption(i)}>×</button>
          </div>
        {/each}
      </div>
      <div class="addrow">
        <button class="ah-btn ah-btn--ghost ah-btn--sm" onclick={() => app.addOption()}>{T.addOption}</button>
        <button class="ah-btn ah-btn--glass ah-btn--sm" class:is-selected={draft?.noOptions} onclick={() => app.toggleNoOptions()}>
          {T.noOptionsYet}
        </button>
      </div>
      {#if draft?.noOptions}
        <p class="ah-caption caption-sub" style="margin-top: 10px;">{T.noOptionsNote}</p>
      {/if}
    </div>
  </div>

  <div class="footer-actions">
    <button class="ah-btn ah-btn--wide" onclick={() => app.toStakes()}>{T.continue}</button>
  </div>
</div>