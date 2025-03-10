<script lang="ts">
  import Icon from "./Icon.svelte";

  const {
    variant = "primary",
    size = "medium", // small, medium, large
    disabled = false,
    type = "button", // button, submit, reset
    fullWidth = false,
    icon = null, // optional icon name
    iconPosition = "left", // left, right
    ariaLabel = null,
    id = null,
    name = null,
    value = null,
    form = null,
    tabindex = null,
    onClick = null,
    style = "",
  }: {
    variant?:
      | "primary"
      | "secondary"
      | "danger"
      | "success"
      | "warning"
      | "basic"
      | "outline";
    size?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
    icon?: string | null;
    iconPosition?: "left" | "right";
    ariaLabel?: string | null;
    id?: string | null;
    name?: string | null;
    value?: string | null;
    form?: string | null;
    tabindex?: number | null;
    onClick?: ((event: MouseEvent) => void) | null;
    style?: string;
  } = $props();

  let iconSize = $derived.by(() => {
    switch (size) {
      case "small":
        return 16;
      case "medium":
        return 20;
      case "large":
        return 24;
      default:
        return 20;
    }
  });

  // Click handler
  function handleClick(event: MouseEvent) {
    if (!disabled) {
      // Call the callback prop if provided
      if (onClick) onClick(event);
    }
  }

  // Dynamic classes using $effect
  let buttonClasses = $derived(
    [
      "btn",
      `btn-${variant}`,
      `btn-${size}`,
      fullWidth ? "btn-full-width" : "",
      disabled ? "btn-disabled" : "",
    ]
      .filter(Boolean)
      .join(" ")
  );
</script>

<button
  {type}
  class={buttonClasses}
  {disabled}
  onclick={handleClick}
  aria-label={ariaLabel}
  {id}
  {name}
  {value}
  {form}
  {tabindex}
  {style}
>
  {#if icon && iconPosition === "left"}
    <span class="icon icon-left"
      ><Icon
        width={iconSize}
        height={iconSize}
        name={icon}
        color="white"
      /></span
    >
  {/if}

  <span class="btn-content">
    <slot></slot>
  </span>

  {#if icon && iconPosition === "right"}
    <span class="icon icon-right"
      ><Icon
        width={iconSize}
        height={iconSize}
        name={icon}
        color="white"
      /></span
    >
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      color 0.2s,
      box-shadow 0.2s;
    border: 2px solid transparent;
  }

  .btn:focus {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  }

  /* Size variants */
  .btn-small {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    height: 2rem;
  }

  .btn-medium {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    height: 2.5rem;
  }

  .btn-large {
    font-size: 1.125rem;
    padding: 0.625rem 1.25rem;
    height: 3rem;
  }

  /* Color variants */
  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary-dark);
  }

  .btn-primary:hover:not(.btn-disabled) {
    background-color: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
  }

  .btn-secondary {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .btn-secondary:hover:not(.btn-disabled) {
    background-color: #2563eb;
    border-color: #2563eb;
  }

  .btn-danger {
    background-color: #ef4444;
    color: white;
    border-color: #ef4444;
  }

  .btn-danger:hover:not(.btn-disabled) {
    background-color: #dc2626;
    border-color: #dc2626;
  }

  .btn-success {
    background-color: #10b981;
    color: white;
    border-color: #10b981;
  }

  .btn-success:hover:not(.btn-disabled) {
    background-color: #059669;
    border-color: #059669;
  }

  .btn-warning {
    background-color: #f59e0b;
    color: white;
    border-color: #f59e0b;
  }

  .btn-warning:hover:not(.btn-disabled) {
    background-color: #d97706;
    border-color: #d97706;
  }

  .btn-basic {
    background-color: transparent;
    color: #1f2937;
    border-color: transparent;
  }
  .btn-basic:hover:not(.btn-disabled) {
    /* background-color: #f3f4f6; */
    border-color: #d1d5db;
  }
  .btn-basic:focus {
    /* background-color: #f3f4f6; */
    border-color: #d1d5db;
  }
  .btn-basic:active {
    /* background-color: #e5e7eb; */
    border-color: #d1d5db;
  }

  .btn-outline {
    background-color: transparent;
    color: #d1d5db;
    border-color: #d1d5db;
  }
  .btn-outline:hover:not(.btn-disabled) {
    background-color: rgba(59, 130, 246, 0.1);
    border-color: #d1d5db;
  }
  .btn-outline:focus {
    background-color: rgba(59, 130, 246, 0.1);
    border-color: #d1d5db;
  }
  .btn-outline:active {
    background-color: rgba(59, 130, 246, 0.2);
    border-color: #d1d5db;
  }

  /* Disabled state */
  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Full width */
  .btn-full-width {
    width: 100%;
  }

  /* Icon positioning */
  .icon {
    display: inline-flex;
    align-items: center;
  }

  /* .icon-left {
    margin-right: 0.5rem;
  }

  .icon-right {
    margin-left: 0.5rem;
  } */

  .btn-content {
    display: inline-flex;
    align-items: center;
  }
</style>
