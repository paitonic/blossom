<script>
    const { message = "No data available" } = $props();
</script>

<div class="empty-state">
    <span class="material-symbols-outlined empty-icon">analytics</span>
    <p class="empty-message">{message}</p>
</div>

<style>
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-xl) var(--spacing-md);
        text-align: center;
        gap: var(--spacing-xs);
        min-height: 120px;
        width: 100%;
    }

    .empty-icon {
        font-size: 32px;
        color: var(--color-border);
        opacity: 0.5;
    }

    .empty-message {
        font-size: 13px;
        color: var(--color-text-muted);
        margin: 0;
    }
</style>
