<script lang="ts">
    let { openedAt, title, user, repository, tags, rating, notes } = $props();
    let open = $state(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit", // "01"
            month: "short", // "Sep" (MMM)
            year: "numeric", // "2023" (YYYY)
        });
    };
</script>

<details class="task-row-wrapper" {open}>
    <summary class="task-summary">
        <div class="cell-date">{formatDate(openedAt)}</div>
        <div class="cell-title" {title}>{title}</div>
        <div class="cell-repo">{user}/{repository}</div>
        <div class="cell-tags">
            {#each tags as tag}
                <span class="tag">{tag}</span>
            {/each}
        </div>
        <div class="cell-rating">
            {#each { length: 5 } as _, i}
                <span
                    class="material-symbols-outlined star-icon"
                    class:filled={i < rating}>star</span
                >
            {/each}
        </div>
        <div class="cell-action">
            <span class="material-symbols-outlined expand-icon"
                >expand_more</span
            >
        </div>
    </summary>
    <div class="row-details">
        <h4 class="notes-heading">Notes</h4>
        <p class="notes-text">
            {notes}
        </p>
    </div>
</details>

<style>
    .task-row-wrapper {
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        margin-bottom: var(--spacing-sm);
        transition: all 0.2s ease;
        overflow: hidden;
    }
    .task-row-wrapper:hover {
        border-color: var(--color-border-hover);
        box-shadow: var(--shadow-sm);
    }
    .task-row-wrapper[open] {
        border-color: var(--color-border-hover);
    }
    .task-summary {
        display: grid;
        grid-template-columns: 110px 1.8fr 140px 1.5fr 110px 40px;
        align-items: center;
        padding: var(--spacing-lg);
        cursor: pointer;
        list-style: none;
        gap: var(--spacing-md);
        min-height: 64px;
    }
    .task-summary::-webkit-details-marker {
        display: none;
    }
    .cell-date {
        font-size: 14px;
        color: var(--color-text-secondary);
        font-feature-settings: "tnum";
        font-variant-numeric: tabular-nums;
    }
    .cell-title {
        font-size: 15px;
        font-weight: 500;
        color: var(--color-text-main);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cell-repo {
        font-size: 13px;
        color: var(--color-text-secondary);
        font-family: "Inter", monospace;
        background-color: var(--color-bg-body);
        padding: 2px 8px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        width: fit-content;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }
    .cell-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        max-height: 64px;
        overflow: hidden;
    }
    .tag {
        font-size: 12px;
        padding: 2px 10px;
        border-radius: var(--radius-full);
        background-color: var(--color-bg-body);
        border: 1px solid var(--color-border);
        color: var(--color-text-secondary);
        white-space: nowrap;
        font-weight: 500;
    }
    .tag-more {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: var(--radius-full);
        background-color: var(--color-bg-hover);
        color: var(--color-text-secondary);
        white-space: nowrap;
        font-weight: 600;
    }
    .cell-rating {
        display: flex;
        align-items: center;
        gap: 2px;
    }
    .star-icon {
        font-size: 18px;
        color: var(--color-border);
        font-variation-settings: "FILL" 0;
        user-select: none;
    }
    .star-icon.filled {
        color: var(--color-text-main);
        font-variation-settings: "FILL" 1;
    }
    .cell-action {
        display: flex;
        justify-content: flex-end;
        color: var(--color-text-muted);
    }
    .expand-icon {
        transition: transform 0.2s ease;
    }
    .task-row-wrapper[open] .expand-icon {
        transform: rotate(180deg);
        color: var(--color-text-main);
    }
    .row-details {
        padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
        padding-left: calc(110px + var(--spacing-lg) + var(--spacing-md));
        border-top: 1px solid transparent;
    }
    .notes-heading {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-muted);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.02em;
    }
    .notes-text {
        font-size: 14px;
        line-height: 1.6;
        color: var(--color-text-secondary);
        max-width: 90%;
    }
</style>
