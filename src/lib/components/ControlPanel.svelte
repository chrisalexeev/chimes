<script lang="ts">
  import { onMount } from "svelte";
  import { ChordParser } from "../chordParser";
  import type { VisState } from "../state.svelte";
  import { getRandomColor, getRandomVelocity } from "../utils";
  import Button from "./Button.svelte";
  import Select from "./Select.svelte";
  import Note from "./Note.svelte";
  import ColorPicker from "./ColorPicker.svelte";

  let {
    visState,
    position = "right",
    isOpen = true,
  }: {
    visState: VisState;
    position?: "left" | "right";
    isOpen?: boolean;
  } = $props();

  let width = $state(500);
  let noteMode: "chord" | "selection" = $state("chord");
  let chord: string = $state("C");
  let chordDebounce: number = $state(0);
  let canvasWidth = $state(0);
  let canvasHeight = $state(0);
  let canvasColor = $state("FFFFFF");
  let startingSpeed: number | string = $state(1.5);
  let isDragging = $state(false);
  let initialX = 0;
  let initialWidth = 0;
  let octave = $state(3);
  let realOctave = $derived(octave + 2);

  $effect(() => {
    visState.canvasColor = canvasColor;
    visState.draw();
  });

  const reset = () => {
    visState.reset();
  };

  const switchChord = () => {
    const speed = parseFloat(startingSpeed.toString());
    const notes = ChordParser.parseChordIntervals(chord);
    if (visState.noteNodes.length === 0) {
      notes.forEach((note) => {
        const velocity = getRandomVelocity(speed);
        visState.addNode(note + (realOctave * 12), velocity, getRandomColor());
      });
      return;
    }
    if (visState.noteNodes.length > notes.length) {
      visState.noteNodes = visState!.noteNodes.slice(0, notes.length);
    }
    notes.forEach((note, index) => {
      if (visState.noteNodes[index]) {
        visState.noteNodes[index].noteNumber = note + (realOctave * 12);
      } else {
        visState.addNode(note + (realOctave * 12), getRandomVelocity(speed), getRandomColor());
      }
    });
  };

  const noteModeOptions = [
    { id: "chord", name: "Chord" },
    { id: "selection", name: "Selection" },
  ];

  onMount(() => {
    if (visState) {
      canvasWidth = visState.canvas.width;
      canvasHeight = visState.canvas.height;
    }

    if (noteMode === "chord") {
      switchChord();
    }

    // Add global event listeners for resize dragging
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      // Clean up event listeners when component is destroyed
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  const handleMouseDown = (e: MouseEvent) => {
    isDragging = true;
    initialX = e.clientX;
    initialWidth = width;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX =
      position === "right" ? initialX - e.clientX : e.clientX - initialX;
    const newWidth = initialWidth + deltaX * 2;
    width = Math.max(Math.min(newWidth, 1200), 300); // Set maximum width to 800px
  };

  const handleMouseUp = () => {
    isDragging = false;
  };
</script>

<div
  class="control-panel-container"
  style:border-radius={position === "right" ? "8px 0 0 8px" : "0 8px 8px 0"}
  style:width={width + "px"}
  style:display={!isOpen ? "none" : "flex"}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="resize-handle"
    style:border-radius={position === "right" ? "8px 0 0 8px" : "0 8px 8px 0"}
    style:left={position === "right" ? "0" : "auto"}
    style:right={position === "left" ? "0" : "auto"}
    style:cursor={position === "right" ? "w-resize" : "e-resize"}
    onmousedown={handleMouseDown}
  ></div>
  <div class="playback controls">
    <Button fullWidth={true} onClick={reset}>Reset</Button>
    <Button
      fullWidth={true}
      onClick={() => {
        visState.togglePause();
      }}
    >
      {!visState.isPaused ? "Pause" : "Start"}
    </Button>
  </div>
  <div class="canvas controls">
    <span class="section-header">Canvas</span>
    <table>
      <colgroup>
        <col span="1" style="width: 120px;" />
        <col span="1" />
      </colgroup>
      <tbody>
        <tr>
          <td>
            <label for="canvasWidth">Canvas width:</label>
          </td>
          <td>
            <div class="controller">
              <span>{canvasWidth}px</span>
              <input
                type="range"
                id="canvasWidth"
                bind:value={canvasWidth}
                defaultValue={visState.canvas.width}
                min="0"
                max="1000"
                step="1"
                onchange={(e) => {
                  const width = parseInt((e.target as HTMLInputElement).value);
                  if (width > 0) {
                    visState.resizeCanvas({
                      width,
                      height: visState.canvas.height,
                    });
                  }
                }}
              />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <label for="canvasHeight">Canvas height:</label>
          </td>
          <td>
            <div class="controller">
              <span>{canvasHeight}px</span>
              <input
                type="range"
                id="canvasHeight"
                bind:value={canvasHeight}
                defaultValue={visState.canvas.height}
                min="0"
                max="1000"
                step="1"
                onchange={(e) => {
                  const height = parseInt((e.target as HTMLInputElement).value);
                  if (height > 0) {
                    visState.resizeCanvas({
                      width: visState.canvas.width,
                      height,
                    });
                  }
                }}
              />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <label for="canvasBackgroundColor">Background color:</label>
          </td>
          <td>
            <ColorPicker bind:color={canvasColor} showLabel={false} />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="note controls">
    <span class="section-header">Notes</span>
    <table>
      <colgroup>
        <col span="1" style="width: 100px;" />
        <col span="1" />
      </colgroup>
      <tbody>
        <tr>
          <td>
            <label for="noteMode">Note mode:</label>
          </td>
          <td>
            <Select
              id="noteMode"
              options={noteModeOptions}
              bind:value={noteMode}
              valueKey="id"
              labelKey="name"
              onchange={({ detail }) => {
                noteMode = detail.value;
              }}
            />
          </td></tr
        >
        {#if noteMode === "chord"}
          <tr>
            <td>Chord:</td>
            <td style="">
              <form
                action="javascript:void(0)"
                style="width: 100%; display: flex; gap: 1rem;"
              >
                <input
                  type="text"
                  bind:value={chord}
                  placeholder="Cmaj7"
                  oninput={(e) => {
                    chord = (e.target as HTMLInputElement).value;
                    clearTimeout(chordDebounce);
                    chordDebounce = setTimeout(() => {
                      console.log("Chord:", ChordParser.parseChord(chord));
                    }, 500);
                  }}
                  style="width: 100%;"
                />
                <Button
                  type="submit"
                  onClick={() => {
                    try {
                      switchChord();
                      visState.draw();
                    } catch (e) {
                      console.error("Error parsing chord:", e);
                    }
                  }}>Switch</Button
                >
              </form>
            </td>
          </tr>
          <tr>
            <td>Octave:</td>
            <td style="">
              <Button
                icon="minus"
                onClick={() => {
                  try {
                    // TODO: this could probably be better
                    octave = Math.max(-2, octave - 1);
                    visState.shiftNotes(-12);
                  } catch (e) {
                    console.error("Error shifting notes:", e);
                  }
                }}
              />
              <Button
                icon="plus"
                onClick={() => {
                  try {
                    // TODO: this could probably be better
                    octave = Math.min(8, octave + 1);
                    visState.shiftNotes(12);
                  } catch (e) {
                    console.error("Error parsing chord:", e);
                  }
                }}
              />
            </td>
          </tr>
        {:else}
          <tr>
            <td>Selection mode</td>
          </tr>
        {/if}
        <tr>
          <td>Notes:</td>
          <td
            class="note-list"
            style:box-shadow={position === "right"
              ? "inset -1px 1px #333"
              : "inset 0px 1px #333"}
          >
            {#each visState.noteNodes as note}
              <Note
                panelPosition={position}
                noteNumber={note.noteNumber}
                velocity={note.velocity}
                position={note.position}
                color={note.color}
                maxX={canvasWidth}
                maxY={canvasHeight}
              />
            {/each}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="physics controls">
    <span class="section-header">Physics</span>
    <table>
      <colgroup>
        <col span="1" style="width: 140px;" />
        <col span="1" />
      </colgroup>
      <tbody>
        <tr>
          <td>
            <label for="startingSpeed">Starting speed:</label>
          </td>
          <td>
            <div class="controller">
              <span>{startingSpeed}</span>
              <input
                type="range"
                id="startingSpeed"
                bind:value={startingSpeed}
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  .control-panel-container {
    box-sizing: border-box;
    background-color: rgb(89, 89, 89);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding: 2rem;
    gap: 1rem;

    width: 100%;
    min-width: 300px;
    height: 100%;

    text-align: left;
    position: relative;
  }

  .resize-handle {
    position: absolute;
    top: 0;
    width: 10px;
    height: 100%;
    background-color: transparent;
    z-index: 10;
    cursor: col-resize;
    transition: background-color 0.2s;

    &:hover,
    &:active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .controls {
    display: flex;
    width: 100%;

    &.playback {
      gap: 1rem;
    }

    &.canvas,
    &.physics {
      .controller {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;

        span {
          font-family: monospace;
        }
      }
    }

    &.note,
    &.physics,
    &.canvas {
      flex-direction: column;
    }
  }

  table {
    width: 100%;
  }

  input[type="range"] {
    width: 100%;
  }

  .section-header {
    width: 100%;
    font-style: italic;
    opacity: 0.8;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.196);
  }

  table,
  tbody,
  tr,
  td {
    border-spacing: 0 10px;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    background: transparent;
  }

  table {
    margin-top: -10px;
  }

  .note-list {
    box-sizing: border-box;
    border-radius: 8px;
    border: solid 1px #000;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.5rem;
    gap: 0.5rem;
    min-height: 1.5em;
  }
</style>
