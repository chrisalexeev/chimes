<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./Button.svelte";

  let {
    color = $bindable(),
    label = "Select a color",
    showLabel = true,
    showHex = true,
    showRgb = true,
    disabled = false,
  } = $props();

  // State variables using runes
  let r = $state(255);
  let g = $state(0);
  let b = $state(0);
  let isPickerVisible = $state(false);
  let canvasContext: CanvasRenderingContext2D | null = $state(null);
  let canvas: HTMLCanvasElement | null = $state(null);
  // let sliderHue;

  $effect(() => {
    if (isPickerVisible && canvas) {
      canvasContext = canvas.getContext("2d", { willReadFrequently: true });
      drawColorPalette();
    }
  });

  // Convert hex to RGB
  function hexToRgb(hex: string) {
    console.log("hexToRgb called with:", hex);
    const result = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  // Convert RGB to hex
  function rgbToHex(r: number, g: number, b: number) {
    console.log("rgbToHex called with:", r, g, b);
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }

  // RGB values derived from the hex color
  $effect(() => {
    const rgb = hexToRgb(color);
    if (rgb) {
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
    }
  });

  // RGB sliders change the hex color
  $effect(() => {
    console.log("effect called for RGB sliders");
    const newColor = rgbToHex(r, g, b);
    console.log("RGB values changed:", r, g, b);
    console.log("New hex color:", newColor);
    color = newColor;
  });

  // When initialColor prop changes, update our state
  // $effect(() => {
  //   if (initialColor !== color) {
  //     color = initialColor;
  //   }
  // });

  // RGB string formatting for display
  // const rgbString = $derived(`rgb(${r}, ${g}, ${b})`);

  // Setup color picker canvas
  onMount(() => {
    if (canvas) {
      canvasContext = canvas.getContext("2d", { willReadFrequently: true });
      drawColorPalette();
    }
  });

  function drawColorPalette() {
    if (!canvasContext || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create gradient for hue
    const hueGradient = canvasContext.createLinearGradient(0, 0, width, 0);
    for (let i = 0; i <= 360; i += 60) {
      hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }

    // Draw hue gradient
    canvasContext.fillStyle = hueGradient;
    canvasContext.fillRect(0, 0, width, height);

    // Create saturation gradient (white to transparent)
    const satGradient = canvasContext.createLinearGradient(0, 0, 0, height);
    satGradient.addColorStop(0, "rgba(255,255,255,1)");
    satGradient.addColorStop(1, "rgba(255,255,255,0)");

    // Draw saturation gradient
    canvasContext.fillStyle = satGradient;
    canvasContext.fillRect(0, 0, width, height);

    // Create lightness gradient (black to transparent)
    const lightGradient = canvasContext.createLinearGradient(0, height, 0, 0);
    lightGradient.addColorStop(0, "rgba(0,0,0,1)");
    lightGradient.addColorStop(1, "rgba(0,0,0,0)");

    // Draw lightness gradient
    canvasContext.fillStyle = lightGradient;
    canvasContext.fillRect(0, 0, width, height);
  }

  function handleCanvasClick(event: MouseEvent) {
    if (!canvasContext || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pixel = canvasContext.getImageData(x, y, 1, 1).data;
    console.log("Pixel data:", pixel);
    r = pixel[0];
    g = pixel[1];
    b = pixel[2];
  }

  function togglePicker() {
    if (!disabled) {
      isPickerVisible = !isPickerVisible;
      if (isPickerVisible && canvas && !canvasContext) {
        setTimeout(() => drawColorPalette(), 0);
      }
    }
  }
</script>

<div class="color-picker">
  {#if showLabel}
    <label for="color-input">{label}</label>
  {/if}

  <div class="color-display-container">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="color-display"
      style="background-color: {color};"
      onclick={togglePicker}
      class:disabled
    ></div>

    <input id="color-input" type="text" bind:value={color} {disabled} />
  </div>

  {#if isPickerVisible}
    <div class="picker-popup">
      <canvas
        bind:this={canvas}
        width="200"
        height="200"
        onclick={handleCanvasClick}
      ></canvas>

      <div class="controls">
        {#if showRgb}
          <div class="rgb-sliders">
            <label>
              R: <span class="code">{r}</span>
              <input type="range" min="0" max="255" bind:value={r} />
            </label>
            <label>
              G: <span class="code">{g}</span>
              <input type="range" min="0" max="255" bind:value={g} />
            </label>
            <label>
              B: <span class="code">{b}</span>
              <input type="range" min="0" max="255" bind:value={b} />
            </label>
          </div>
        {/if}

        {#if showHex}
          <div class="hex-value">
            <label>
              HEX:
              <input type="text" bind:value={color} />
            </label>
          </div>
        {/if}

        <!-- <div class="color-preview">
          <span>Preview:</span>
          <div class="preview-box" style="background-color: {color};"></div>
          {#if showRgb}
            <span>{rgbString}</span>
          {/if}
        </div> -->

        <Button onClick={togglePicker}>Close</Button>
      </div>
    </div>
  {/if}
</div>

<style>
  .color-picker {
    font-family: Arial, sans-serif;
    position: relative;
    width: 100%;
    max-width: 300px;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    /* font-weight: bold; */
  }

  .color-display-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .color-display {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    min-height: 2rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .color-display:hover:not(.disabled) {
    transform: scale(1.1);
  }

  .color-display.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  input {
    width: 100%;
  }

  input[type="text"] {
    padding: 0.3rem;
    border-radius: 8px;
  }

  .picker-popup {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    background: #111;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 1rem;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 200px;
  }

  canvas {
    cursor: crosshair;
    border: 1px solid #eee;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .rgb-sliders {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rgb-sliders label,
  .hex-value label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  input[type="range"] {
    flex: 1;
  }

  /* .color-preview {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }

  .preview-box {
    width: 2rem;
    height: 2rem;
    border-radius: 8px;
    border: 1px solid #ccc;
  } */

  .code {
    font-family: monospace;
    font-size: 0.9rem;
    color: #fff;
  }
</style>
