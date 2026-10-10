<script lang="ts">
  import { app } from '$lib/store.svelte';

  const msg = $derived(app.toastMsg);
  const undo = $derived(app.undo);
</script>

<div class="ah-toast" class:is-visible={msg !== null} aria-live="polite">
  {#if msg !== null}
    <div>
      {msg}
      {#if undo !== null}
        <button class="ah-pill ah-pill--outline" style="margin-left: 10px; font-size: 10px;" onclick={() => app.undoDelete()}>Undo</button>
      {/if}
    </div>
  {/if}
</div>