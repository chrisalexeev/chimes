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
{/if}
