<script lang="ts">
    let {
        openedAt,
        title,
        user,
        repository,
        tags = [],
        notes,
        type = "-",
        size = "-",
        challenge = "-",
        impact = "-",
        reaction = "-",
    } = $props();
    let open = $state(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit", // "01"
            month: "short", // "Sep" (MMM)
            year: "numeric", // "2023" (YYYY)
        });
    };

    const reactionMap = {
        positive: "😀",
        neutral: "😐",
        negative: "☹️",
    };

    const displayReaction = (r) => reactionMap[r] || r;
</script>

<details class="task-row-wrapper" {open}>
    <summary class="task-summary">
        <div class="cell-date">{formatDate(openedAt)}</div>
        <div class="cell-title" {title}>{title}</div>
        <div class="cell-repo">{repository}</div>
        <div class="cell-text cell-type">{type}</div>
        <div class="cell-text cell-size">{size}</div>
        <div class="cell-text cell-challenge">{challenge}</div>
        <div class="cell-text cell-impact">{impact}</div>
        <div class="cell-reaction">{displayReaction(reaction)}</div>
        <div class="cell-action">
            <span class="material-symbols-outlined expand-icon"
                >expand_more</span
            >
        </div>
    </summary>
    <div class="row-details">
        {#if tags && tags.length > 0}
            <div class="detail-section">
                <h4 class="detail-heading">Tags</h4>
                <div class="cell-tags">
                    {#each tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            </div>
        {/if}
        {#if notes}
            <div class="detail-section">
                <h4 class="detail-heading">Notes</h4>
                <p class="notes-text">
                    {notes}
                </p>
            </div>
        {/if}
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
        grid-template-columns: 110px 2fr 140px 100px 50px 80px 80px 50px 40px;
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
    .cell-text {
        font-size: 13px;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        font-weight: 500;
    }
    .cell-reaction {
        font-size: 18px;
    }
    .cell-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
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
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .detail-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .detail-heading {
        font-size: 12px;
        font-weight: 600;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.02em;
        margin: 0;
    }
    .notes-text {
        font-size: 14px;
        line-height: 1.6;
        color: var(--color-text-secondary);
        max-width: 90%;
        margin: 0;
    }
</style>