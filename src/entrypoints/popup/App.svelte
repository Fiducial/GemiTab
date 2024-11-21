<script lang="ts">
  import { onMount } from "svelte";
  import {
    checkPromptAPIAvailability,
    checkSummarizerAvailability,
  } from "@/lib/availabilityCheck";
  import { appState } from "@/lib/appState";
  import TextArea from "@/lib/TextArea.svelte";
  import ChatWindow from "@/lib/ChatWindow.svelte";
  import SplashScreen from "@/lib/SplashScreen.svelte";
  import { fade } from "svelte/transition";
  import TopMenu from "@/lib/TopMenu.svelte";
  import Settings from "@/lib/Settings.svelte";
  import { loadHistoryFromStorage } from "@/lib/chat";

  onMount(() => {
    checkSummarizerAvailability();
    checkPromptAPIAvailability();
    loadHistoryFromStorage();
  });
</script>

{#if $appState.showSplash}
  <SplashScreen />
{:else}
  <main in:fade={{ duration: 300 }}>
    <TopMenu />
    {#if $appState.currentScreen === "chat"}
      <ChatWindow />
    {:else if $appState.currentScreen === "settings"}
      <Settings />
    {/if}
    <TextArea />
  </main>
{/if}

<style>
  main {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 48px 1fr 96px;
    height: 100%;
  }
</style>
