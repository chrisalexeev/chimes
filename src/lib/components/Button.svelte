<script lang="ts">
  const {
    variant = "primary", // primary, secondary, danger, success, warning
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
  }: {
    variant?: string;
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
  } = $props();

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
  on:click={handleClick}
  aria-label={ariaLabel}
  {id}
  {name}
  {value}
  {form}
  {tabindex}
>
  {#if icon && iconPosition === "left"}
    <span class="icon icon-left">{icon}</span>
  {/if}

  <span class="btn-content">
    <slot></slot>
  </span>

  {#if icon && iconPosition === "right"}
    <span class="icon icon-right">{icon}</span>
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 500;
    border-radius: 0.375rem;
    cursor: pointer;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      color 0.2s,
      box-shadow 0.2s;
    border: 1px solid transparent;
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
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .btn-primary:hover:not(.btn-disabled) {
    background-color: #2563eb;
    border-color: #2563eb;
  }

  .btn-secondary {
    background-color: #e5e7eb;
    color: #1f2937;
    border-color: #e5e7eb;
  }

  .btn-secondary:hover:not(.btn-disabled) {
    background-color: #d1d5db;
    border-color: #d1d5db;
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

  .icon-left {
    margin-right: 0.5rem;
  }

  .icon-right {
    margin-left: 0.5rem;
  }

  .btn-content {
    display: inline-flex;
    align-items: center;
  }
</style>
