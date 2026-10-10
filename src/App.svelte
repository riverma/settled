<script lang="ts">
  import { onMount } from 'svelte';
  import InstallBar from '$lib/ui/InstallBar.svelte';
  import { app } from '$lib/store.svelte';
  import Home from '$lib/screens/Home.svelte';
  import New from '$lib/screens/New.svelte';
  import Stakes from '$lib/screens/Stakes.svelte';
  import GoodEnough from '$lib/screens/GoodEnough.svelte';
  import WeighItUp from '$lib/screens/WeighItUp.svelte';
  import LookAhead from '$lib/screens/LookAhead.svelte';
  import MakeItReal from '$lib/screens/MakeItReal.svelte';
  import DecisionView from '$lib/screens/DecisionView.svelte';
  import SettingsScreen from '$lib/screens/Settings.svelte';
  import Sheets from '$lib/ui/Sheets.svelte';
  import Toast from '$lib/ui/Toast.svelte';

  const screen = $derived(app.screen);

  onMount(() => {
    const demo = new URLSearchParams(location.search).has('demo');
    void app.init(demo);
    // the launcher's #install contract: "Install" on apps.riverma.com lands here
    if (location.hash === '#install') {
      history.replaceState(null, '', location.pathname + location.search);
      app.installRequested = true;
    }
  });

  $effect(() => {
    // keep the document theme in step with the store
    app.applyTheme();
  });
</script>

{#if app.ready}
  {#if screen === 'home'}
    <Home />
  {:else if screen === 'new'}
    <New />
  {:else if screen === 'stakes'}
    <Stakes />
  {:else if screen.startsWith('ge-')}
    <GoodEnough />
  {:else if screen.startsWith('wp-')}
    <WeighItUp />
  {:else if screen.startsWith('la-')}
    <LookAhead />
  {:else if screen === 'real'}
    <MakeItReal />
  {:else if screen === 'view'}
    <DecisionView />
  {:else if screen === 'settings'}
    <SettingsScreen />
  {/if}
  <Sheets />
  <InstallBar />
  <Toast />
{/if}