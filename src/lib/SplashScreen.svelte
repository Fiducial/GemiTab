<script lang="ts">
  import { onMount } from "svelte";
  import Logo from "../assets/logo.svg";
  import {
    Availability,
    promptAvailability,
    summarizerAvailability,
  } from "./availabilityCheck";
  import { disableSplashScreen } from "./appState";
  import { fade } from "svelte/transition";

  let textToShow = "";
  let checkAiStatus = false;

  onMount(() => {
    setTimeout(() => {
      textToShow = "Welcome to GemiTab";
    }, 2000);

    setTimeout(() => {
      textToShow = "Navigate your Chrome tabs 10x faster";
    }, 5500);

    setTimeout(() => {
      checkAiStatus = true;
    }, 8500);

    setTimeout(() => {
      if (
        $promptAvailability === Availability.OK &&
        $summarizerAvailability === Availability.OK
      ) {
        disableSplashScreen();
      }
    }, 10000);
  });
</script>

<div class="splash">
  <div class="splash-text">
    {#key textToShow}
      <div>{textToShow}</div>
    {/key}
    {#if checkAiStatus}
      <div in:fade class="status-check">
        <div>Summarization API</div>
        <div>{$summarizerAvailability}</div>
        <div>Prompt API</div>
        <div>{$promptAvailability}</div>
      </div>
    {/if}
  </div>
  <div class="splash-bg-container">
    <img src={Logo} alt="Logo" />
    <div class="splash-bg"></div>
  </div>
</div>

<style>
  .splash {
    --orange: #ea766f;
    --purple: #ca4588;
    --dark: #11111a;
    --blusih: #3a3955;
    height: 100%;
    position: relative;
    display: grid;
    place-content: center;
    place-items: center;
    background-image: radial-gradient(
        circle 5px at top left,
        rgba(226, 226, 226, 0.1) 0%,
        rgba(226, 226, 226, 0.1) 50%,
        rgba(201, 201, 201, 0.1) 50%,
        rgba(201, 201, 201, 0.1) 30%,
        transparent 30%,
        transparent 50%
      ),
      linear-gradient(90deg, #11111a, #11111a);
    background-size: 11px 11px;
  }

  .splash-text {
    color: white;
    font-size: 32px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .splash-text > :first-child {
    max-width: 200px;
    opacity: 0;
    animation: 3s ease-in forwards text-in;
  }

  .splash-text > :nth-child(2) {
    max-width: 400px;
  }

  @keyframes text-in {
    0% {
      opacity: 0;
    }
    35% {
      opacity: 1;
    }
    55% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .status-check {
    display: grid;
    width: max-content;
    grid-template-columns: 1fr max-content;
    text-align: left;
    color: rgb(175, 175, 175);
    column-gap: 12px;
    row-gap: 4px;
    font-size: 14px;
  }

  .splash-bg-container {
    position: absolute;
    width: 50%;
    height: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: 0.75s ease-in-out 1.3s forwards move-out;
  }

  @keyframes move-out {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    60% {
      transform: translate(-50%, -115%) scale(0.575);
    }
    100% {
      transform: translate(-50%, -110%) scale(0.6);
    }
  }

  .splash-bg-container img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    background: rgb(0, 0, 0, 0.7);
    padding: 16px;
    border-radius: 32px;
    box-shadow:
      rgba(0, 0, 0, 0.16) 0px 3px 6px,
      rgba(0, 0, 0, 0.23) 0px 3px 6px;
    opacity: 0;
    animation: 1s ease-in 0.5s forwards appear;
  }

  @keyframes appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .splash-bg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    filter: blur(50px);
    background: radial-gradient(circle at center, white, transparent 40%),
      conic-gradient(
        from 0deg,
        #2374f7 0deg 35deg,
        #f48b22 35deg 125deg,
        #d378e1 125deg 130deg,
        #ff24a4 130deg 196deg,
        #14ffa9 196deg 230deg,
        #2374f7 230deg 360deg
      );
    animation:
      grow 1.5s,
      20s 1.2s infinite bg-morph;
  }

  @keyframes grow {
    0% {
      transform: scale(0);
      background-size: 50% 50%;
      -webkit-background-size: 50%;
    }
    100% {
      transform: scale(1);
      background-size: 100% 100%;
      -webkit-background-size: 100%;
    }
  }

  @keyframes bg-morph {
    0% {
      transform: scale(1), rotate(0deg);
    }
    50% {
      transform: scale(0.9) rotate(360deg);
    }
    100% {
      transform: scale(1), rotate(0deg);
    }
  }
</style>
