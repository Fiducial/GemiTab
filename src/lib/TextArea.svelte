<script lang="ts">
  import { continueConversation, startConversation } from "./chat";
  import sendIcon from "../assets/send.svg";
  import { conversationHistory } from "./chat";
  import { context, reloadContext } from "./context";
  import { appState } from "./appState";
  import { fade, fly } from "svelte/transition";

  $: currentConversation = $conversationHistory.find((c) => c.isCurrent) ?? {
    id: "none",
    isCurrent: false,
    title: "NONE",
    startedAt: 0,
    messages: [],
  };

  let inputText = "";
  const onSubmit = async () => {
    if (currentConversation.messages.length === 0) {
      await reloadContext();
      startConversation(inputText, $context, {
        temperature: $appState.temperature,
        topk: $appState.topk,
      });
    } else {
      continueConversation(inputText, $context, currentConversation, {
        temperature: $appState.temperature,
        topk: $appState.topk,
      });
    }
    inputText = "";
  };

  onMount(() => {
    const typePrompt =
      "I have too many tabs open and my browser slowed down a bit. Can you please unload all the tabs from memory except the current one?";
    let i = 0;
    const typeWriter = () => {
      if (i < typePrompt.length) {
        inputText += typePrompt.charAt(i);
        i++;
        setTimeout(typeWriter, Math.random() * 120);
      }
    };
    // setTimeout(typeWriter, 3000);
  });
</script>

<div class="pad">
  <div class="textareaWrapper">
    <textarea placeholder="Ask anything" bind:value={inputText}></textarea>
    <button on:click={onSubmit} class="confirm">
      <img src={sendIcon} alt="Send prompt" />
    </button>
  </div>
  <div class="disclaimer">
    GemiTab is a proof of concept. Do not use with anything important.
  </div>
</div>

<style>
  .pad {
    border-top: 1px solid rgb(36, 31, 36);
    background-image: radial-gradient(
        circle at 0% 0%,
        rgb(236, 92, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 35%
      ),
      radial-gradient(
        circle at 0% 100%,
        rgb(97, 92, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 35%
      ),
      radial-gradient(
        circle at 100% 0%,
        rgb(92, 174, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 35%
      ),
      radial-gradient(
        circle at 100% 100%,
        rgb(236, 92, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 35%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgb(92, 174, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 80%
      ),
      radial-gradient(
        circle at 60% 60%,
        rgb(206, 92, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 80%
      ),
      linear-gradient(90deg, #11111a, #11111a);
    padding: 8px;
    z-index: 0;
  }
  .textareaWrapper {
    display: grid;
    height: 80%;
    gap: 8px;
    padding: 8px;
    align-items: center;
    position: relative;
    border-radius: 8px;
    background-color: #ffffff;
    background: linear-gradient(#212128, #1a1a23, #212128);
    background-clip: padding-box;
    border: solid 1px transparent;
    grid-template-columns: 48px 1fr 48px;
  }

  .textareaWrapper::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    margin: -1px;
    border-radius: inherit;
    background: linear-gradient(to right, rgb(73, 129, 212), rgb(160, 67, 210));
  }

  .disclaimer {
    text-align: center;
    font-size: 13px;
    margin-top: 2px;
    color: rgb(160, 160, 160);
  }

  textarea {
    grid-column: 1/3;
    border: none;
    height: 100%;
    background-color: transparent;
    resize: none;
    color: white;
  }

  textarea:focus {
    outline: none;
  }

  textarea::-webkit-scrollbar {
    background-color: rgb(22, 22, 22);
    width: 8px;
  }

  textarea::-webkit-scrollbar-thumb {
    background: linear-gradient(rgb(255, 140, 120), rgb(195, 85, 255));
    border-radius: 9999px;
  }

  .confirm {
    display: grid;
    place-content: center;
    background-image: linear-gradient(
      -125deg,
      rgb(120, 174, 255),
      rgb(195, 85, 255)
    );
    border-radius: 8px;
    width: 36px;
    height: 36px;
    border: none;
    cursor: pointer;
    transition:
      filter 0.2s,
      transform 0.2s,
      box-shadow 0.2s;
  }

  .confirm > img {
    width: 20px;
    height: 20px;
  }

  .confirm:hover {
    filter: brightness(1.1);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  }

  .confirm:active {
    transform: scale(0.95);
    filter: brightness(1.35);
  }
</style>
