<script lang="ts">
    import IconSentimentSatisfied from "@/shared/icons/IconSentimentSatisfied.svelte";
    import IconSentimentNeutral from "@/shared/icons/IconSentimentNeutral.svelte";
    import IconSentimentDissatisfied from "@/shared/icons/IconSentimentDissatisfied.svelte";
    import { COLORS } from "@/shared/colors.js";

    let {
        openedAt,
        title,
        user,
        repository,
        pullRequestID,
        tags = [],
        notes,
        type = "-",
        effort = "-",
        challenge = "-",
        impact = "-",
        sentiment = "-",
        onEdit,
        onDelete,
    } = $props();
    let open = $state(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const sentimentMap = {
        "1": { icon: IconSentimentSatisfied },
        "0": { icon: IconSentimentNeutral },
        "-1": { icon: IconSentimentDissatisfied },
    };

    const sentimentDetails = $derived(sentimentMap[sentiment] || { icon: sentiment });

    const effortMap = {
        xs: "XS",
        s: "S",
        m: "M",
        l: "L",
        xl: "XL",
    };

    const displayEffort = (s) => effortMap[s.toLowerCase()] || s;

    const getTypeDetails = (t) => {
        const config = {
            feature: { icon: "⭐", label: "Feature" },
            bug: { icon: "🐞", label: "Bug" },
            chore: { icon: "⚙️", label: "Chore" },
            research: { icon: "🔍", label: "Research" },
            hotfix: { icon: "🚒", label: "Hotfix" },
        };
        return config[t] || { icon: "", label: t };
    };

    const typeDetails = $derived(getTypeDetails(type));

    let showMenu = $state(false);

    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu = !showMenu;
    };

    const onOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu = false;
        const url = `https://github.com/${user}/${repository}/pull/${pullRequestID}`;
        window.open(url, "_blank");
    };

    const onEditHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu = false;
        if (onEdit) onEdit();
    };

    const onDeleteHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showMenu = false;
        if (onDelete) onDelete();
    };

    const onWindowClick = () => {
        if (showMenu) {
            showMenu = false;
        }
    };
</script>

<svelte:window onclick={onWindowClick} />

<details class="task-row-wrapper" {open}>
    <summary class="task-summary">
        <div class="cell-date">{formatDate(openedAt)}</div>
        <div class="cell-title">
            <span class="title-text" {title}>{title}</span>
            {#if tags && tags.length > 0}
                <div class="cell-tags">
                    {#each tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            {/if}
        </div>
        <div class="cell-type">
            <span
                class="type-pill"
                style="background-color: {COLORS.type[type] || '#cccccc'};"
            >
                <span class="type-label">{typeDetails.label}</span>
            </span>
        </div>
        <div class="cell-size">
            <span
                class="size-pill"
                style="background-color: {COLORS.effort[effort] || '#cccccc'};"
                title="Effort: {effort}"
            >
                {displayEffort(effort)}
            </span>
        </div>
        <div class="cell-challenge">
            <div
                class="barometer"
                title="Challenge: {challenge}"
                data-level={challenge}
                style="--low-color: {COLORS.challenge.easy}; --medium-color: {COLORS.challenge.medium}; --high-color: {COLORS.challenge.hard};"
            >
                <div class="barometer-segment low"></div>
                <div class="barometer-segment medium"></div>
                <div class="barometer-segment high"></div>
            </div>
        </div>
        <div class="cell-impact">
            <div
                class="barometer"
                title="Impact: {impact}"
                data-level={impact}
                style="--low-color: {COLORS.impact.low}; --medium-color: {COLORS.impact.medium}; --high-color: {COLORS.impact.high};"
            >
                <div class="barometer-segment low"></div>
                <div class="barometer-segment medium"></div>
                <div class="barometer-segment high"></div>
            </div>
        </div>
        <div class="cell-reaction">
            {#if sentimentDetails.icon && sentimentDetails.icon !== "-"}
                <div style="color: {COLORS.sentiment[sentiment] || 'currentColor'};">
                    <sentimentDetails.icon size="20px" />
                </div>
            {:else}
                <span class="no-reaction">-</span>
            {/if}
        </div>
        <div class="cell-action">
            <div class="menu-container">
                <button
                    class="menu-btn"
                    onclick={toggleMenu}
                    aria-label="Options"
                    class:active={showMenu}
                >
                    <span class="material-symbols-outlined">more_vert</span>
                </button>
                {#if showMenu}
                    <div class="dropdown-menu">
                        <button class="dropdown-item" onclick={onOpen}>Open</button>
                        <button class="dropdown-item" onclick={onEditHandler}>Edit</button>
                        <button class="dropdown-item delete" onclick={onDeleteHandler}
                            >Delete</button
                        >
                    </div>
                {/if}
            </div>
        </div>
    </summary>
    <div class="row-details">
        <div class="detail-section">
            <h4 class="detail-heading">Repository</h4>
            <div class="cell-repo">{repository}</div>
        </div>
        {#if notes}
            <div class="detail-section">
                <h4 class="detail-heading">Notes</h4>
                <p class="notes-text">{notes}</p>
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
        /* overflow: hidden; */
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
        grid-template-columns: 110px 2fr 90px 50px 80px 80px 50px 40px;
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
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0; /* Enable truncation for flex children */
    }
    .title-text {
        font-size: 15px;
        font-weight: 500;
        color: var(--color-text-main);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
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
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    .no-reaction {
        color: var(--color-text-muted);
        font-size: 14px;
    }

    /* Type Pill */
    .type-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        text-transform: lowercase;
        color: white;
        width: fit-content;
    }

    /* Size Pill */
    .size-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: var(--radius-md);
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: white;
    }

    /* Barometer for Challenge and Impact */
    .barometer {
        display: flex;
        width: 60px;
        height: 8px;
        background-color: var(--color-bg-body);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        overflow: hidden;
        gap: 1px;
    }
    .barometer-segment {
        flex: 1;
        height: 100%;
        opacity: 0.15;
        transition: opacity 0.2s ease;
    }
    .barometer-segment.low {
        background-color: var(--low-color);
    }
    .barometer-segment.medium {
        background-color: var(--medium-color);
    }
    .barometer-segment.high {
        background-color: var(--high-color);
    }

    .barometer[data-level="low"] .barometer-segment.low,
    .barometer[data-level="easy"] .barometer-segment.low {
        opacity: 1;
    }
    .barometer[data-level="medium"] .barometer-segment.low,
    .barometer[data-level="medium"] .barometer-segment.medium {
        opacity: 1;
    }
    .barometer[data-level="high"] .barometer-segment.low,
    .barometer[data-level="high"] .barometer-segment.medium,
    .barometer[data-level="high"] .barometer-segment.high,
    .barometer[data-level="hard"] .barometer-segment.low,
    .barometer[data-level="hard"] .barometer-segment.medium,
    .barometer[data-level="hard"] .barometer-segment.high {
        opacity: 1;
    }

    .cell-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }
    .tag {
        font-size: 10px;
        padding: 1px 8px;
        border-radius: 4px;
        background-color: var(--color-bg-body);
        border: 1px solid var(--color-border);
        color: var(--color-text-secondary);
        white-space: nowrap;
        font-weight: 500;
        line-height: 1.4;
    }
    .cell-action {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
        color: var(--color-text-muted);
    }
    .menu-container {
        position: relative;
    }
    .menu-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: var(--radius-md);
        color: var(--color-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }
    .menu-btn:hover,
    .menu-btn.active {
        background-color: var(--color-bg-hover);
        color: var(--color-text-main);
    }
    .menu-btn .material-symbols-outlined {
        font-size: 20px;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 100;
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 4px;
        display: flex;
        flex-direction: column;
        min-width: 120px;
    }

    .dropdown-item {
        background: none;
        border: none;
        text-align: left;
        padding: 8px 12px;
        font-size: 14px;
        color: var(--color-text-main);
        cursor: pointer;
        border-radius: var(--radius-md);
        transition: background-color 0.2s;
    }
    .dropdown-item:hover {
        background-color: var(--color-bg-hover);
    }
    .dropdown-item.delete {
        color: #ef4444;
    }
    .dropdown-item.delete:hover {
        background-color: #fef2f2;
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
