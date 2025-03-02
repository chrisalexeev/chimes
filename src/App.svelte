<script lang="ts">
  import { onMount } from "svelte";
  import { Synth } from "./lib/synth";
  import MixBus from "./lib/mixbus";
  import { VisState } from "./lib/state";
  import Button from "./lib/components/Button.svelte";
  import Select from "./lib/components/Select.svelte";
  import { ChordParser } from "./lib/chordParser";

  let audioContext: AudioContext | null = $state(null);
  let synth: Synth | null = $state(null);
  let mixbus: MixBus | null = $state(null);
  let visState: VisState | null = $state(null);
  let canvas: HTMLCanvasElement | null = $state(null);
  let isPaused: boolean = $state(true);
  let noteMode: "chord" | "selection" = $state("chord");
  let chord: string = $state("C");
  let chordDebounce: number = $state(0);

  const getRandomVelocity: (speed: number) => { dX: number; dY: number } = (
    speed: number
  ) => {
    const angle = Math.random() * 2 * Math.PI;
    return {
      dX: Math.cos(angle) * speed,
      dY: Math.sin(angle) * speed,
    };
  };

  function getNoteName(noteNumber: number): string {
    const noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const octave = Math.floor(noteNumber / 12) - 1;
    const noteIndex = noteNumber % 12;
    return `${noteNames[noteIndex]}${octave}`;
  }

  const noteModeOptions = [
    { id: "chord", name: "Chord" },
    { id: "selection", name: "Selection" },
  ];

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
  <div class="container">
    <div class="canvas-container">
      <canvas bind:this={canvas} width="300" height="200" class="canvas"
      ></canvas>
    </div>
    <div class="control-panel">
      <div class="playback-controls">
        <Button
          fullWidth={true}
          onClick={() => {
            visState?.togglePause();
            isPaused = visState!.isPaused;
          }}>{!isPaused ? "Stop" : "Start"}</Button
        >
      </div>
      <div class="note-controls">
        <div>
          <label for="noteMode">Note Mode</label>
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
        </div>
        {#if noteMode === "chord"}
          <div>
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
            />
          </div>
          <Button
            onClick={() => {
              try {
                const notes = ChordParser.parseChordIntervals(chord);
                if (visState!.noteNodes.length === 0) {
                  notes.forEach((note) => {
                    const velocity = getRandomVelocity(2);
                    visState?.addNode(note + 60, velocity);
                  });
                  return;
                }
                if (visState!.noteNodes.length > notes.length) {
                  visState!.noteNodes = visState!.noteNodes.slice(
                    0,
                    notes.length
                  );
                }
                notes.forEach((note, index) => {
                  if (visState!.noteNodes[index]) {
                    visState!.noteNodes[index].node.noteNumber = note + 60;
                  } else {
                    const velocity = getRandomVelocity(2);
                    visState?.addNode(note + 60, velocity);
                  }
                });
              } catch (e) {
                console.error("Error parsing chord:", e);
              }
            }}>Switch</Button
          >
        {:else}
          <div>Selection mode</div>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  .canvas-container {
    border-radius: 8px;
    overflow: hidden;
    width: 300px;
    height: 200px;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .control-panel {
    width: 200px;
    height: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
  }

  .start-stop-button {
    width: 100%;
  }

  .note-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
