<script lang="ts">
    const { icon, label, count = null } = $props();
</script>

<button class="filter-button">
    <span class="material-symbols-outlined icon">{icon}</span>
    <span>{label}</span>
    {#if count}
        <span class="count">{count}</span>
    {/if}
    <span class="material-symbols-outlined expand-icon">expand_more</span>
</button>

<style>
    .filter-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-secondary);
        transition: all 0.2s ease;
        box-shadow: var(--shadow-sm);
    }
    .filter-button:hover {
        background-color: var(--color-bg-hover);
        border-color: var(--color-border-hover);
    }
    .icon {
        font-size: 18px;
        color: var(--color-text-muted);
        transition: color 0.2s ease;
    }
    .filter-button:hover .icon {
        color: var(--color-text-secondary);
    }
    .count {
        background-color: var(--color-bg-body);
        color: var(--color-text-secondary);
        font-size: 12px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 4px;
        border: 1px solid var(--color-border);
    }
    .expand-icon {
        font-size: 18px;
        color: var(--color-text-muted);
    }
</style>
