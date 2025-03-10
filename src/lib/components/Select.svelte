<script lang="ts">
  // Define types for options and props
  type OptionType = Record<string, any>;

  // Props with $props() rune instead of export let
  const {
    id,
    options = [],
    value = $bindable(),
    placeholder = "Select an option",
    valueKey = "value",
    labelKey = "label",
    disabled = false,
    className = "",
    onchange = null,
  } = $props<{
    id?: string;
    options: OptionType[];
    value?: string | number;
    placeholder?: string;
    valueKey?: string;
    labelKey?: string;
    disabled?: boolean;
    className?: string;
    onchange?: (event: CustomEvent) => void;
  }>();
  // Internal state with runes
  let isOpen = $state(false);
  let selectedIndex = $state(-1);
  let containerElement = $state<HTMLDivElement | null>(null);

  // Computed values
  let selectedOption = $derived(
    options.find(
      (option: { [x: string]: any }) => option[valueKey] === value
    ) || null
  );

  let displayText = $derived(
    selectedOption
      ? typeof selectedOption[labelKey] !== "undefined"
        ? selectedOption[labelKey]
        : selectedOption[valueKey]
      : placeholder
  );

  // Event dispatcher with TypeScript types
  type ChangeEvent = {
    value: string | number;
    option: OptionType;
  };

  // Handle opening/closing the dropdown
  function toggle(): void {
    if (disabled) return;
    isOpen = !isOpen;

    if (isOpen) {
      // Update selected index based on current value
      selectedIndex = options.findIndex(
        (option: { [x: string]: any }) => option[valueKey] === value
      );
    }
  }

  // Handle selecting an option
  function selectOption(option: OptionType, index: number): void {
    // Create an event to update the prop value
    const event = new CustomEvent("value", { detail: option[valueKey] });
    containerElement?.dispatchEvent(event);

    selectedIndex = index;
    isOpen = false;
    if (onchange) {
      const changeEvent: ChangeEvent = {
        value: option[valueKey],
        option,
      };
      onchange(new CustomEvent("change", { detail: changeEvent }));
    }
  }

  // Handle keyboard navigation
  function handleKeyDown(e: KeyboardEvent): void {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        if (isOpen && selectedIndex >= 0) {
          selectOption(options[selectedIndex], selectedIndex);
        } else {
          toggle();
        }
        e.preventDefault();
        break;
      case "Escape":
        isOpen = false;
        e.preventDefault();
        break;
      case "ArrowDown":
        if (isOpen) {
          selectedIndex =
            selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        } else {
          toggle();
        }
        e.preventDefault();
        break;
      case "ArrowUp":
        if (isOpen) {
          selectedIndex =
            selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        } else {
          toggle();
        }
        e.preventDefault();
        break;
      case "Tab":
        isOpen = false;
        break;
    }
  }

  // Close when clicking outside
  function handleClickOutside(e: MouseEvent): void {
    if (containerElement && !containerElement.contains(e.target as Node)) {
      isOpen = false;
    }
  }

  // Set up click outside listener
  $effect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  });

  // Scroll to selected option when opening dropdown
  $effect(() => {
    if (isOpen && selectedIndex >= 0) {
      setTimeout(() => {
        const selectedElement = document.getElementById(
          `option-${selectedIndex}`
        );
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: "nearest" });
        }
      }, 0);
    }
  });
</script>

<div
  class="custom-select {className}"
  bind:this={containerElement}
  tabindex={options.findIndex(
    (option: { [x: string]: any }) => {
      
      return option[valueKey] === value
    }
  )}
  id={id}
  aria-label={id}
  onkeydown={handleKeyDown}
  data-disabled={disabled}
  role="combobox"
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-controls="select-dropdown"
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="select-trigger" onclick={toggle}>
    <span class="select-value">{displayText}</span>
    <span class="select-arrow" aria-hidden="true">
      {#if isOpen}&#9650;{:else}&#9660;{/if}
    </span>
  </div>

  {#if isOpen}
    <div class="select-dropdown" role="listbox">
      {#each options as option, index}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          id="option-{index}"
          class="select-option"
          class:selected={option[valueKey] === value}
          class:highlighted={index === selectedIndex}
          onclick={() => selectOption(option, index)}
          role="option"
          aria-selected={option[valueKey] === value}
          tabindex={-1}
        >
          {typeof option[labelKey] !== "undefined"
            ? option[labelKey]
            : option[valueKey]}
        </div>
      {/each}

      {#if options.length === 0}
        <div class="select-no-options">No options available</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .custom-select {
    position: relative;
    width: 100%;
    font-family: inherit;
    outline: none;
  }

  .custom-select[data-disabled="true"] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background-color: rgb(0, 0, 0);
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
  }

  .custom-select:focus .select-trigger {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.25);
  }

  .custom-select[data-disabled="true"] .select-trigger {
    cursor: not-allowed;
  }

  .select-arrow {
    margin-left: 0.5rem;
    font-size: 0.7em;
  }

  .select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 4px;
    background-color: rgb(44, 44, 44);
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
  }

  .select-option {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
  }

  .select-option:hover,
  .select-option.highlighted {
    background-color: #f7fafc;
  }

  .select-option:hover {
    color: rgb(44, 44, 44);
  }

  .select-option.selected {
    background-color: #4a4a4a;
    font-weight: 500;
  }

  .select-no-options {
    padding: 0.5rem 0.75rem;
    color: #718096;
    font-style: italic;
  }
</style>
