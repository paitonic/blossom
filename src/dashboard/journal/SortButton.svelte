<button class="sort-button">
    <span class="material-symbols-outlined icon">sort</span>
    <span>Sort: Newest</span>
    <span class="material-symbols-outlined expand-icon">expand_more</span>
</button>

<style>
    .sort-button {
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
    }
    .sort-button:hover {
        background-color: var(--color-bg-hover);
        border-color: var(--color-border-hover);
    }
    .icon {
        font-size: 18px;
        color: var(--color-text-muted);
        transition: color 0.2s ease;
    }
    .sort-button:hover .icon {
        color: var(--color-text-secondary);
    }
    .expand-icon {
        font-size: 18px;
        color: var(--color-text-muted);
    }
</style>
