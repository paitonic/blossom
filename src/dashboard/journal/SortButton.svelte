<script lang="ts">
    let { sortOrder = "newest", onToggle } = $props();
</script>

<div class="segmented-control">
    <button 
        class="segment {sortOrder === 'newest' ? 'active' : ''}" 
        onclick={() => sortOrder !== 'newest' && onToggle()}
        type="button"
        aria-label="Sort by newest"
    >
        Newest
    </button>
    <button 
        class="segment {sortOrder === 'oldest' ? 'active' : ''}" 
        onclick={() => sortOrder !== 'oldest' && onToggle()}
        type="button"
        aria-label="Sort by oldest"
    >
        Oldest
    </button>
</div>

<style>
    .segmented-control {
        display: flex;
        align-items: center;
        background-color: var(--gray-100, #f3f4f6);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 4px;
        gap: 4px;
    }
    
    .segment {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        padding: 6px 12px;
        border-radius: 4px; /* Slightly smaller than container */
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .segment:hover:not(.active) {
        color: var(--color-text-secondary);
        background-color: rgba(0,0,0,0.05);
    }

    .segment.active {
        background-color: var(--color-bg-white);
        color: var(--color-text-secondary);
        box-shadow: var(--shadow-sm);
    }
</style>