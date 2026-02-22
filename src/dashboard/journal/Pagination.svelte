<script lang="ts">
    let { totalItems, pageSize, currentPage = $bindable() } = $props();

    let totalPages = $derived(Math.ceil(totalItems / pageSize));

    let startRange = $derived((currentPage - 1) * pageSize + 1);
    let endRange = $derived(Math.min(currentPage * pageSize, totalItems));

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    let pages = $derived.by(() => {
        const items: (number | string)[] = [];
        const delta = 1; // Number of pages to show around current page
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                items.push(i);
            } else if (items[items.length - 1] !== '...') {
                items.push('...');
            }
        }
        return items;
    });
</script>

<div class="pagination-container">
    <div class="pagination-summary">
        Showing <span class="font-medium">{startRange}-{endRange}</span> of
        <span class="font-medium">{totalItems}</span> tasks
    </div>
    <nav class="pagination-controls">
        <button
            class="pagination-button"
            disabled={currentPage === 1}
            onclick={() => goToPage(currentPage - 1)}
        >
            Previous
        </button>
        <div class="page-numbers">
            {#each pages as page}
                {#if page === '...'}
                    <span class="ellipsis">...</span>
                {:else}
                    <button
                        class="page-number-button"
                        class:active={currentPage === page}
                        onclick={() => goToPage(page as number)}
                    >
                        {page}
                    </button>
                {/if}
            {/each}
        </div>
        <button
            class="pagination-button"
            disabled={currentPage === totalPages}
            onclick={() => goToPage(currentPage + 1)}
        >
            Next
        </button>
    </nav>
</div>

<style>
    .pagination-container {
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding-top: 24px;
        border-top: 1px solid var(--color-border);
    }
    @media (min-width: 640px) {
        .pagination-container {
            flex-direction: row;
        }
    }
    .pagination-summary {
        font-size: 14px;
        color: var(--color-text-muted);
    }
    .pagination-summary .font-medium {
        color: var(--color-text-main);
        font-weight: 500;
    }
    .pagination-controls {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    .pagination-button {
        padding: 6px 12px;
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border);
        background-color: var(--color-bg-white);
        transition: background-color 0.2s ease;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }
    .pagination-button:hover:not(:disabled) {
        background-color: var(--color-bg-hover);
    }
    .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .page-numbers {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: 0 4px;
    }
    .page-number-button {
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        background-color: transparent;
        border: none;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        cursor: pointer;
    }
    .page-number-button:hover {
        background-color: var(--color-bg-hover);
        color: var(--color-text-main);
    }
    .page-number-button.active {
        background-color: var(--color-primary-black);
        color: white;
        box-shadow: var(--shadow-sm);
    }
    .ellipsis {
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
        font-size: 14px;
    }
</style>
