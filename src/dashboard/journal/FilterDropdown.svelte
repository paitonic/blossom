<script lang="ts">
    import { onMount } from "svelte";

    let {
        label,
        icon,
        options,
        selected = $bindable([]),
    } = $props();

    let isOpen = $state(false);
    let dropdownRef = $state<HTMLElement>(null);
    let activeCount = $derived(selected.length);

    let selectedLabels = $derived(
        options
            .filter((opt) => selected.includes(opt.value))
            .map((opt) => opt.label)
            .join(", "),
    );

    const toggleDropdown = () => {
        isOpen = !isOpen;
    };

    const toggleOption = (value: any) => {
        if (selected.includes(value)) {
            selected = selected.filter((v) => v !== value);
        } else {
            selected = [...selected, value];
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            isOpen &&
            dropdownRef &&
            !dropdownRef.contains(event.target as Node)
        ) {
            isOpen = false;
        }
    };

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<div class="filter-dropdown" bind:this={dropdownRef}>
    <button
        class="filter-button"
        class:active={activeCount > 0}
        onclick={toggleDropdown}
    >
        <span class="material-symbols-outlined icon">{icon}</span>
        <span>
            {label}{#if activeCount > 0}: {selectedLabels}{/if}
        </span>
        <span
            class="material-symbols-outlined expand-icon"
            class:rotated={isOpen}>expand_more</span
        >
    </button>

    {#if isOpen}
        <div class="dropdown-menu">
            {#each options as option}
                <button
                    class="dropdown-item"
                    class:selected={selected.includes(option.value)}
                    onclick={() => toggleOption(option.value)}
                >
                    <span class="material-symbols-outlined selection-icon">
                        {selected.includes(option.value)
                            ? "check_box"
                            : "check_box_outline_blank"}
                    </span>
                    <span class="item-label">{option.label}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .filter-dropdown {
        position: relative;
        display: inline-block;
    }

    .filter-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-secondary);
        transition: all 0.2s ease;
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
    }

    .filter-button:hover {
        background-color: var(--color-bg-hover);
        border-color: var(--color-border-hover);
    }

    .filter-button.active {
        border-color: var(--color-primary);
        color: var(--color-primary);
        background-color: var(--color-primary-light, #eff6ff);
    }

    .icon {
        font-size: 18px;
        color: var(--color-text-muted);
        transition: color 0.2s ease;
    }

    .filter-button:hover .icon,
    .filter-button.active .icon {
        color: inherit;
    }

    .expand-icon {
        font-size: 18px;
        color: var(--color-text-muted);
        transition: transform 0.2s ease;
    }

    .expand-icon.rotated {
        transform: rotate(180deg);
    }

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        z-index: 100;
        min-width: 180px;
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        padding: 4px;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        border-radius: var(--radius-sm);
        color: var(--color-text-primary);
        font-size: 14px;
        transition: background-color 0.2s ease;
    }

    .dropdown-item:hover {
        background-color: var(--color-bg-hover);
    }

    .dropdown-item.selected {
        background-color: var(--color-bg-hover);
        color: var(--color-primary);
    }

    .selection-icon {
        font-size: 20px;
        color: var(--color-text-muted);
        flex-shrink: 0;
    }

    .selected .selection-icon {
        color: var(--color-primary);
    }

    .item-label {
        flex: 1;
    }
</style>
