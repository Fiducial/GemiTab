<script lang="ts">
  import { fade } from "svelte/transition";
  import { appState, setTemperature, setTopK } from "./appState";

  let temp: number = $appState.temperature;
  let topk: number = $appState.topk;

  let tempIsValid = true;
  let topkIsValid = true;
  let tempChanged = false;
  let topkChanged = false;

  let applySuccess = false;

  $: {
    tempIsValid = temp >= 0 && temp <= 1;
    topkIsValid = topk >= 0 && topk <= 8;
    tempChanged = temp !== $appState.temperature;
    topkChanged = topk !== $appState.topk;
  }

  const onApply = () => {
    setTemperature(temp);
    setTopK(topk);
    applySuccess = true;
    setTimeout(() => {
      applySuccess = false;
    }, 1500);
  };
</script>

<div class="settings-container">
  <div class="settings-items">
    <label for="temp-setting">Temperature</label>
    <input
      class={tempChanged ? "changed" : ""}
      id="temp-setting"
      min="0"
      max="1"
      type="number"
      bind:value={temp}
    />
    <label for="topk-setting">TopK</label>
    <input
      class={topkChanged ? "changed" : ""}
      id="topk-setting"
      min="0"
      max="1"
      type="number"
      bind:value={topk}
    />
  </div>
  {#if !tempIsValid}
    <div in:fade class="invalid">Temperature must be between 0 and 1</div>
  {/if}
  {#if !topkIsValid}
    <div in:fade class="invalid">TopK must be between 0 and 8</div>
  {/if}
  <button
    disabled={!tempIsValid || !topkIsValid || (!tempChanged && !topkChanged)}
    on:click={onApply}
    class="apply">Apply</button
  >
  {#if applySuccess}
    <div transition:fade class="apply-success">
      Changes applied successfully
    </div>
  {/if}
  <!-- <Debug /> -->
</div>

<style>
  .settings-container {
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
    padding: 8px 36px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .settings-items {
    display: grid;
    grid-template-columns: max-content 32px;
    grid-auto-rows: 32px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: white;
    font-size: 16px;
    width: 320px;
    margin-top: 8px;
  }

  .settings-items > label {
    text-align: right;
  }

  .invalid {
    font-size: 14px;
    color: rgb(255, 102, 0);
  }

  input {
    width: 32px;
    height: 32px;
    background-color: rgb(51, 51, 56, 0.65);
    border-radius: 8px;
    padding: 4px;
    text-align: center;
    font-size: 14px;
    border: 1px solid rgb(80, 80, 80);
    color: white;
  }

  .changed {
    border: 1px solid rgb(255, 236, 126);
    background-color: rgba(255, 238, 126, 0.15);
  }

  input:active,
  input:focus {
    outline: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  .apply {
    border: none;
    border-radius: 16px;
    padding: 8px 36px;
    margin-top: 8px;
    color: white;
    font-size: 16px;
    background-color: rgb(51, 51, 56, 0.85);
    cursor: pointer;
    transition: filter 0.5s;
  }

  .apply:hover {
    background-color: rgb(78, 78, 78, 0.85);
  }

  .apply:disabled {
    cursor: not-allowed;
    filter: brightness(0.65);
  }

  .apply-success {
    color: #50da4c;
  }
</style>
