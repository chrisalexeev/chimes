<script lang="ts">
  let {
    name,
    width = 24,
    height = 24,
    color = "white",
  }: {
    name: string;
    width?: number;
    height?: number;
    color?: string;
  } = $props();
</script>

{#if name === "edit"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {width}
    {height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-pencil"
    ><path
      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
    /><path d="m15 5 4 4" /></svg
  >
{:else if name === "panel-left"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {width}
    {height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-panel-left"
    ><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg
  >
{:else if name === "panel-right"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {width}
    {height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-panel-left"
    ><rect width="18" height="18" x="3" y="3" rx="2" /><path
      d="M15 3v18"
    /></svg
  >
{:else if name === "panel-hide"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {width}
    {height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    ><rect width="18" height="18" x="3" y="3" rx="2" /></svg
  >
{:else if name === "plus"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {width}
    {height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg
  >
{:else if name === "minus"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {width}
    {height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-minus"><path d="M5 12h14" /></svg
  >
{:else if name === "trash"}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {width}
    {height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-trash-2"
    ><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
      d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
    /><line x1="10" x2="10" y1="11" y2="17" /><line
      x1="14"
      x2="14"
      y1="11"
      y2="17"
    /></svg
  >
{/if}
