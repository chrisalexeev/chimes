<script lang="ts">
  import { onMount } from "svelte";
  import { Synth } from "./lib/synth";
  import MixBus from "./lib/mixbus";
  import { VisState } from "./lib/state.svelte";
  import Button from "./lib/components/Button.svelte";
  import ControlPanel from "./lib/components/ControlPanel.svelte";

  let audioContext: AudioContext | null = $state(null);
  let synth: Synth | null = $state(null);
  let mixbus: MixBus | null = $state(null);
  let visState: VisState | null = $state(null);
  let canvas: HTMLCanvasElement | null = $state(null);
  let toolbarPosition: "left" | "right" = $state("right");
  let isToolbarOpen: boolean = $state(true);

  onMount(() => {
    if (!canvas) {
      console.error("Canvas element is not available");
      return;
    }

    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    synth = new Synth(audioContext);
    mixbus = new MixBus(audioContext);
    mixbus.addSource(synth.getOutputNode());

    visState = new VisState(canvas, synth);
    visState.draw();

    visState.animate();
  });
</script>

<main>
  <div
    class="container"
    style:flex-direction={toolbarPosition === "left" ? "row-reverse" : "row"}
  >
    <div class="view-controls" style:order={toolbarPosition === "left" ? 1 : 0}>
      <Button
        onClick={() => {
          toolbarPosition = "left";
          isToolbarOpen = true;
        }}
        variant="basic"
        size="small"
        icon="panel-left"
      />
      <Button
        onClick={() => {
          toolbarPosition = "right";
          isToolbarOpen = true;
        }}
        variant="basic"
        size="small"
        icon="panel-right"
      />
      <Button
        onClick={() => {
          isToolbarOpen = !isToolbarOpen;
        }}
        variant="basic"
        size="small"
        icon="panel-hide"
      />
    </div>
    <div class="canvas-container">
      <canvas bind:this={canvas} width="300" height="200" class="canvas"
      ></canvas>
    </div>
    {#if visState}
      <ControlPanel
        {visState}
        position={toolbarPosition}
        isOpen={isToolbarOpen}
      />
    {/if}
  </div>
</main>

<style>
  main {
    height: 100%;
  }

  .canvas-container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .view-controls {
    display: flex;
    gap: 4px;
    position: absolute;
    top: 0;
    padding: 1rem;
    z-index: 10;
  }

  canvas {
    border-radius: 8px;
    background-color: #000;
  }
</style>
