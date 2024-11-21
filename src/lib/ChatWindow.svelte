<script lang="ts">
  import { marked } from "marked";
  import { fade, fly } from "svelte/transition";
  import { conversationHistory, updateStorageHistory } from "./chat";
  import ActionButton from "./ActionButton.svelte";
  import { format } from "date-fns";

  $: currentConversation = $conversationHistory.find((c) => c.isCurrent) ?? {
    title: "NONE",
    startedAt: 0,
    messages: [],
  };

  $: lastMessageIsUserPrompt =
    currentConversation.messages.length > 0
      ? currentConversation.messages[currentConversation.messages.length - 1]
          .isUser
      : false;

  $: {
    updateStorageHistory($conversationHistory);
  }
</script>

<div class="chat-container">
  {#if currentConversation.messages.length === 0}
    <div
      in:fade={{ duration: 600 }}
      out:fade={{ duration: 150 }}
      class="no-chat"
    >
      <div>How can I help you today?</div>
      <div>
        Ask GemiTab to open, close, mute or focus a tab, compare tab contents,
        save media from open tabs, and more.
      </div>
    </div>
  {:else}
    {#each currentConversation.messages as message (message.id)}
      <div
        in:fade|global={{
          delay: 150,
          duration: 650,
        }}
        class={message.isUser ? "msg-user" : "msg-ai"}
      >
        <div class="msg" id={message.id}>
          {@html marked.parse(message.content)}
        </div>
        <div class="timestamp">{format(message.timestamp, "HH:mm")}</div>
        {#if message.actions}
          <div class="action-container">
            {#each message.actions as action, index}
              <div
                in:fly|global={{
                  delay: (index + 1) * 100,
                  duration: 500,
                  y: 100,
                }}
              >
                <ActionButton {action} />
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
    {#if lastMessageIsUserPrompt}
      <div
        class="msg-ai"
        in:fade|global={{
          delay: 350,
          duration: 650,
        }}
      >
        <div class="msg">
          <span class="loading"> Generating response...</span>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .chat-container {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: max-content;
    overflow-y: auto;
    color: white;
    background-image: radial-gradient(
        circle at 10% 0%,
        rgba(120, 174, 255, 0.12) 0%,
        rgba(255, 255, 255, 0) 50%
      ),
      radial-gradient(
        circle at 100% 75%,
        rgba(195, 85, 255, 0.12) 0%,
        rgba(255, 255, 255, 0) 50%
      ),
      radial-gradient(
        circle at -95% 85%,
        rgba(80, 255, 179, 0.08) 0%,
        rgba(255, 255, 255, 0) 80%
      ),
      linear-gradient(90deg, #11111a, #11111a);
    gap: 8px;
    padding: 8px;
  }

  .chat-container::-webkit-scrollbar {
    background-color: #11111a;
    width: 6px;
  }

  .chat-container::-webkit-scrollbar-thumb {
    background: linear-gradient(rgb(255, 140, 120), rgb(195, 85, 255));
    border-radius: 9999px;
  }

  .no-chat {
    grid-column: 2 / 6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 64px;
  }

  .no-chat > :first-child {
    font-size: 24px;
  }

  .no-chat > :last-child {
    font-size: 16px;
    color: grey;
  }

  .msg {
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    color: black;
    padding: 8px;
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    word-break: break-all;
    word-break: break-word;
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
  }

  :global(.msg li) {
    padding-left: 16px;
    list-style-position: inside;
  }

  .action-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .msg-user,
  .msg-ai {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .msg-user {
    grid-column: 2/7;
  }

  .msg-user > .msg {
    background: linear-gradient(45deg, rgb(143, 193, 255), rgb(216, 144, 255));
    border-bottom-right-radius: 1px;
  }

  .msg-user > .timestamp {
    text-align: right;
  }

  .msg-ai {
    grid-column: 1/6;
  }

  .msg-ai > .msg {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(1px);
    color: white;
    border-bottom-left-radius: 1px;
  }

  .timestamp {
    color: rgb(145, 145, 145);
  }

  .loading {
    animation: loading 0.5s alternate infinite;
  }

  @keyframes loading {
    from {
      opacity: 0.9;
    }
    to {
      opacity: 0.4;
    }
  }
</style>
