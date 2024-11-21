<script lang="ts">
  import OpenTabsIcon from "../assets/openTabs.svg";
  import CloseTabsIcon from "../assets/closeTabs.svg";
  import FocusTabIcon from "../assets/focusTabs.svg";
  import MuteTabsIcon from "../assets/mute.svg";
  import UnmuteTabsIcon from "../assets/unmute.svg";
  import SaveMediaIcon from "../assets/saveMedia.svg";
  import CompareTabsIcon from "../assets/compareTabs.svg";
  import CopyIcon from "../assets/copy.svg";
  import FreeMemoryIcon from "../assets/freeMemory.svg";
  import PinIcon from "../assets/pin.svg";
  import UnpinIcon from "../assets/unpin.svg";
  import { type Action } from "./actionParser";
  import { resolveAction } from "./actionResolver";

  export let action: Action;

  const resolveTabAction = (action: Action) => {
    resolveAction(action);
  };

  const iconMap = {
    openTabs: OpenTabsIcon,
    closeTabs: CloseTabsIcon,
    focusTab: FocusTabIcon,
    muteTabs: MuteTabsIcon,
    unmuteTabs: UnmuteTabsIcon,
    saveMedia: SaveMediaIcon,
    compareTabs: CompareTabsIcon,
    copyUrls: CopyIcon,
    discardTabs: FreeMemoryIcon,
    pinTabs: PinIcon,
    unpinTabs: UnpinIcon,
  };
</script>

<button on:click={() => resolveTabAction(action)} class="action">
  <img src={iconMap[action.type]} alt={action.title} />
  <div>{action.title}</div>
</button>

<style>
  .action {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    background: rgb(66, 66, 66, 0.5);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 8px;
    transform: perspective(1px) translateZ(0);
    backface-visibility: hidden;
    transition:
      transform 0.22s,
      background 0.22s;
  }

  .action > img {
    width: 20px;
    height: 20px;
  }

  .action:hover {
    transform: scale(1.025);
    background: #535353;
  }
</style>
