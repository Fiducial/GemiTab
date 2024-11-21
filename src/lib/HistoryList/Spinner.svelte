<script lang="ts">
  export let animateOut: number;

  let classes = "loader";

  $: {
    if (animateOut > 0 && classes === "loader") {
      classes += " animate-out";
    }
  }
</script>

<span
  class={classes}
  style={`transition: scale ${animateOut}ms, opacity ${animateOut}ms;`}
></span>

<style>
  .loader {
    width: 48px;
    height: 48px;
    border: 5px dotted #fff;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    box-sizing: border-box;
    animation: rotation 2s linear infinite;
  }

  .animate-out {
    scale: 0.625;
    opacity: 0;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
