<script lang="ts">
  import { onMount } from "svelte";
  import HistoryListItem from "./HistoryListItem.svelte";
  import { type Conversation } from "../chat";
  import Spinner from "./Spinner.svelte";
  import HistoryIcon from "../../assets/history.svg";
  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { expoInOut } from "svelte/easing";

  export let items: Conversation[];
  export let onHistoryItemSelect: (conversation: Conversation) => void;

  let itemElements: HTMLDivElement[] = [];

  let introPlayed = false;
  let animateOutSpinner = 0;

  let scrollAreaRef: HTMLDivElement;

  let selectedItemId: undefined | string = undefined;

  const onItemSelect = (item: Conversation) => {
    selectedItemId = item.id;
    onHistoryItemSelect(item);
  };

  onMount(() => {
    const spinnerDuration = 600;
    const spinnerFadeOutDuration = 360;
    const spinnerFadeOutDelay = spinnerDuration - spinnerFadeOutDuration;
    setTimeout(() => {
      animateOutSpinner = spinnerFadeOutDuration;
    }, spinnerFadeOutDelay);
    setTimeout(() => {
      isAnimating = true;
      setTimeout(() => {
        isAnimating = false;
        introPlayed = true;
        items.forEach((item) => {
          const itemEl = document.querySelector(`#${item.id}`);
          if (itemEl) {
            itemElements.push(itemEl as HTMLDivElement);
          }
        });
      }, 500);
    }, spinnerDuration);
  });

  let isAnimating = false;

  let scrollInProcess = false;

  const handleScroll = () => {
    if (!scrollInProcess) {
      window.requestAnimationFrame(() => {
        const containerRect = scrollAreaRef.getBoundingClientRect();
        itemElements.forEach((itemEl) => {
          const targetRect = itemEl.getBoundingClientRect();
          const visibleHeight =
            Math.min(containerRect.bottom, targetRect.bottom) -
            Math.max(containerRect.top, targetRect.top);
          const visibleRatio = Math.max(0, visibleHeight / targetRect.height);
          const gog = 0.6 + visibleRatio * 0.4;
          itemEl.style.transform = `scale(${gog})`;
          itemEl.style.filter = `brightness(${visibleRatio}) opacity(${visibleRatio})`;
        });
        scrollInProcess = false;
      });
    }
    scrollInProcess = true;
  };
</script>

<div class="animated-list-wrapper">
  {#if items.length === 0}
    <div class="no-items">
      <img src={HistoryIcon} alt="Conversation History" />
      <div>Your previous conversations will appear here</div>
    </div>
  {:else}
    <div
      bind:this={scrollAreaRef}
      class="scrollable-wrapper"
      on:scroll={handleScroll}
    >
      {#if !introPlayed && !isAnimating}
        <div
          style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"
        >
          <Spinner animateOut={animateOutSpinner} />
        </div>
      {:else}
        {#each items.filter((i) => selectedItemId === undefined || selectedItemId === i.id) as item, itemIndex (item.id)}
          <div
            id={item.id}
            class={`list-item ${isAnimating ? "animating" : "fake-loading"} ${selectedItemId === item.id ? "selected-item" : ""}`}
            style={`animation-delay: ${itemIndex * 25}ms;`}
            on:click={() => onItemSelect(item)}
            on:keydown={() => onItemSelect(item)}
            role="button"
            tabindex={-9}
            out:fly={{
              duration: 600,
              delay: itemIndex * 25,
              x: -225,
            }}
            animate:flip={{ duration: 700, delay: 0, easing: expoInOut }}
          >
            <HistoryListItem {item} />
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .no-items {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #cccccc;
    margin: 36px auto;
    text-align: center;
    max-width: 224px;
  }
  .no-items > img {
    width: 36px;
    height: 36px;
  }

  .animated-list-wrapper {
    width: 320px;
    height: 94%;
    border-radius: 0px 24px 24px 0px;
    padding: 8px 0px;
    position: relative;
  }

  .scrollable-wrapper {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    padding: 8px 16px;
  }

  .scrollable-wrapper::-webkit-scrollbar {
    width: 4px;
  }

  .scrollable-wrapper::-webkit-scrollbar-thumb {
    background-color: rgb(75, 75, 75);
    border-radius: 9999px;
  }

  .list-item {
    border-radius: 8px;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  .animating {
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.25),
      transparent 50%
    );
    background-size: 500px 500px;
    background-repeat: no-repeat;
    animation: shine 0.5s linear;
  }

  @keyframes shine {
    0% {
      transform: scale(1) translateY(0);
      background-position: center 100%;
      filter: brightness(1);
    }

    25% {
      transform: scale(0.95) translateY(-4px);
    }

    50% {
      transform: scale(1.025) translateY(2px);
      filter: brightness(1.3);
    }

    100% {
      transform: scale(1) translateY(0);
      background-position: center -100%;
      filter: brightness(1);
    }
  }
</style>
