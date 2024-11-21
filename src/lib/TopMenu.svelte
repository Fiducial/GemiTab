<script lang="ts">
  import ChatHistory from "../assets/chatHistory.svg";
  import SettingsIcon from "../assets/settings.svg";
  import NewChatIcon from "../assets/newChat.svg";
  import { appState, routeTo } from "./appState";
  import {
    type Conversation,
    conversationHistory,
    resumeConversation,
    stopConversation,
  } from "./chat";
  import { fade, fly } from "svelte/transition";
  import HistoryList from "./HistoryList/HistoryList.svelte";

  const onSettingsClick = () => {
    if ($appState.currentScreen === "settings") {
      routeTo("chat");
    } else {
      routeTo("settings");
    }
  };

  let showHistoryPane = false;

  const onMenuClick = () => {
    showHistoryPane = true;
  };

  const onNewChatClick = () => {
    stopConversation();
  };

  const onHistoryItemSelect = (conversation: Conversation) => {
    resumeConversation(conversation);
    setTimeout(() => {
      showHistoryPane = false;
    }, 700);
  };
</script>

<div class="topmenu">
  <div>
    <button on:click={onMenuClick}>
      <img src={ChatHistory} alt="Settings" />
    </button>
    <button
      disabled={$appState.currentScreen === "settings"}
      on:click={onNewChatClick}
    >
      <img src={NewChatIcon} alt="Settings" />
    </button>
  </div>
  <div>GemiTab</div>
  <div>
    <button
      class={$appState.currentScreen === "settings" ? "active" : ""}
      on:click={onSettingsClick}
      ><img src={SettingsIcon} alt="Settings" /></button
    >
  </div>
</div>
{#if showHistoryPane}
  <div in:fly={{ x: -300 }} out:fly={{ x: -300 }} class="history">
    <div>Chat history</div>
    <HistoryList items={$conversationHistory} {onHistoryItemSelect} />
  </div>
  <div
    transition:fade
    on:click={() => {
      showHistoryPane = false;
    }}
    class="backdrop"
  ></div>
{/if}

<style>
  .topmenu {
    display: grid;
    grid-template-columns: 96px 1fr 96px;
    align-items: center;
    padding: 0 16px;
    font-weight: 600;
    font-size: 22px;
    background-color: #000000;
    color: #ffffff;
    z-index: 99;
    box-shadow:
      rgba(108, 189, 255, 0.12) 0px 1px 3px,
      rgba(255, 100, 255, 0.24) 0px 1px 2px;
  }

  .topmenu > :first-child {
    justify-self: flex-start;
    display: flex;
    gap: 8px;
  }

  .topmenu > :nth-child(2) {
    text-align: center;
    background-image: linear-gradient(
      90deg,
      rgb(129, 180, 255) 30%,
      rgb(205, 113, 255)
    );
    color: transparent;
    background-clip: text;
  }

  .topmenu > :last-child {
    justify-self: flex-end;
  }

  button {
    width: 36px;
    height: 36px;
    display: grid;
    place-content: center;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  button > img {
    width: 22px;
    height: 22px;
  }

  button:hover,
  button.active {
    background: #383838;
  }

  button:disabled {
    cursor: not-allowed;
  }

  .history {
    position: absolute;
    height: 100dvh;
    width: 320px;
    z-index: 101;
    background: black;
    color: white;
    box-shadow: 10px 0 5px -2px #000;
  }

  .history > :first-child {
    font-size: 20px;
    padding: 8px 8px 0 8px;
  }

  .backdrop {
    background: rgb(0, 0, 0, 0.5);
    position: absolute;
    width: 100dvw;
    height: 100dvh;
    z-index: 100;
    backdrop-filter: blur(3px);
  }
</style>
