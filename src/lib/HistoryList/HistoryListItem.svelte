<script lang="ts">
  import { format } from "date-fns";
  import ConversationIcon from "../../assets/conversation.svg";
  import { type Conversation } from "../chat";

  export let item: Conversation;
</script>

<div class="animated-list-item-wrapper">
  <div class="icon">
    <img src={ConversationIcon} alt={item.title} />
    <div class="msg-count">{item.messages.length}</div>
  </div>
  <div class="title">
    {#if item.title.length > 1126}
      <div class="marquee">{item.title}</div>
    {:else}
      {item.title}
    {/if}
  </div>
  <div class="subtitle">{format(item.startedAt, "MMMM do yyyy HH:mm:ss")}</div>
</div>

<style>
  .animated-list-item-wrapper {
    --icon-size: 46px;
    display: grid;
    padding: 4px 8px;
    align-items: center;
    justify-content: center;
    grid-template-columns: var(--icon-size) 1fr;
    grid-template-rows: max-content max-content;
    column-gap: 8px;
    row-gap: 2px;
    border-radius: 8px;
    user-select: none;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }

  .animated-list-item-wrapper * {
    user-select: none;
  }

  .animated-list-item-wrapper:hover {
    cursor: pointer;
    background-color: rgba(100, 100, 100, 0.85);
    transform: scale(1.035);
  }

  .animated-list-item-wrapper:active {
    background-color: rgba(100, 100, 100, 0.65);
    transform: scale(0.95);
  }

  .animated-list-item-wrapper:hover img {
    filter: brightness(1.25) drop-shadow(0px 0px 5px rgb(255, 255, 255, 0.2));
  }

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--icon-size);
    width: var(--icon-size);
    grid-row: 1 / 3;
    position: relative;
  }

  .icon > img {
    width: 85%;
    height: 85%;
    border-radius: 10px;
    padding: 8px;
  }

  .msg-count {
    position: absolute;
    bottom: 3px;
    right: 3px;
    display: grid;
    place-content: center;
    border-radius: 100%;
    background-color: rgba(8, 29, 56, 0.8);
    color: rgb(139, 185, 255);
    width: 20px;
    height: 20px;
    transition:
      right 0.2s,
      bottom 0.2s;
  }

  .animated-list-item-wrapper:hover .msg-count {
    right: 13px;
    bottom: 13px;
    transform: scale(2);
    background-color: rgba(8, 29, 56, 1);
  }

  .title {
    font-size: 0.95rem;
    line-height: 18px;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .marquee {
    animation: move 10s infinite linear;
  }

  @keyframes move {
    0% {
      transform: translateX(0%);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    20% {
      transform: translateX(0%);
    }
    85% {
      opacity: 1;
    }
    100% {
      transform: translateX(-80%);
      opacity: 0;
    }
  }

  .subtitle {
    font-size: 0.75rem;
  }
</style>
