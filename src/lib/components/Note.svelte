<script lang="ts">
  import type { Velocity } from "../state.svelte";
  import { getNoteName } from "../utils";
  import Button from "./Button.svelte";

  let {
    noteNumber,
    // velocity,
    // position,
    color = "black",
    // maxX = 100,
    // maxY = 100,
    panelPosition = "right",
    onRemove,
  }: {
    noteNumber: number;
    velocity: Velocity;
    position: { x: number; y: number };
    color?: string;
    maxX?: number;
    maxY?: number;
    panelPosition?: "left" | "right";
    onRemove?: (e: MouseEvent) => void;
  } = $props();

  // let isEditing: boolean = $state(false);
</script>

<div
  class="note-container"
  style:box-shadow={panelPosition === "right"
    ? "-1px 1px #333"
    : "0px 1px #333"}
>
  <div
    class="note-color"
    style={`background-color: ${color}`}
    role="button"
  ></div>
  <div class="note-label">
    <span>{getNoteName(noteNumber)}</span>
  </div>
  <!-- <Button
    variant="basic"
    size="small"
    type="button"
    onClick={() => (isEditing = !isEditing)}
    icon="edit"
    iconPosition="left"
    ariaLabel="Edit Note"
    style="padding: 0 2px"
  /> -->
  {#if onRemove}
    <Button
      variant="basic"
      size="small"
      type="button"
      onClick={onRemove}
      icon="trash"
      iconPosition="left"
      ariaLabel="Edit Note"
      style="padding: 0; margin-left: -4px"
    />
  {/if}
</div>

<!-- {#if isEditing}
  <form action="">
    <div class="note-color" style={`background-color: ${color}`}></div>
    <div class="note-inputs">
      <div class="note-label">
        <input value={getNoteName(noteNumber)} />
      </div>
      <div class="note-2d">
        <div class="note-dx">
          <input type="number" min="0" max="127" value={velocity.dX} />
        </div>
        <div class="note-dy">
          <input type="number" min="0" max="127" value={velocity.dY} />
        </div>
        <div class="note-x">
          <input type="number" min="0" max={maxX} value={position.x} />
        </div>
        <div class="note-y">
          <input type="number" min="0" max={maxY} value={position.y} />
        </div>
      </div>
    </div>
  </form>
{/if} -->

<style lang="scss">
  // form,
  .note-container {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border: 1px solid #1f1f1f;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
    // width: fit-content;
  }

  .note-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    flex-shrink: 0;
    // cursor: pointer;

    // &:hover {
    //   border: solid 2px #ccc;
    //   box-sizing: border-box;
    // }
  }

  // .note-dx,
  // .note-dy,
  // .note-x,
  // .note-y,
  .note-label {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // input {
  //   width: 3em;
  //   padding: 0.25rem;
  //   border-radius: 4px;
  //   border: 1px solid #ccc;
  // }
  // input[type="number"] {
  //   width: 90%;
  //   padding: 0.25rem;
  //   border-radius: 4px;
  //   border: 1px solid #ccc;
  // }

  // .note-inputs {
  //   display: flex;
  //   gap: 0.5rem;
  // }

  // .note-2d {
  //   display: grid;
  //   grid-template-columns: repeat(2, 1fr);
  //   grid-template-rows: repeat(2, 1fr);
  //   gap: 4px;
  // }
</style>
