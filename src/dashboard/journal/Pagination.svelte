<div class="pagination-container">
    <div class="pagination-summary">
        Showing <span class="font-medium">1-4</span> of
        <span class="font-medium">128</span> tasks
    </div>
    <nav class="pagination-controls">
        <button class="pagination-button" disabled>Previous</button>
        <div class="page-numbers">
            <button class="page-number-button active">1</button>
            <button class="page-number-button">2</button>
            <button class="page-number-button">3</button>
            <span class="ellipsis">...</span>
            <button class="page-number-button">12</button>
        </div>
        <button class="pagination-button">Next</button>
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
        margin: 0 8px;
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
