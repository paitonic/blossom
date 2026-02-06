<script>
    const { tasks } = $props();

    let sortBy = $state("positive"); // 'positive' | 'negative'
    let isDropdownOpen = $state(false);
    let isFullScreen = $state(false);

    function getJoyStacks() {
        const stats = {};

        tasks.forEach((task) => {
            if (!task.tags || !Array.isArray(task.tags)) return;

            task.tags.forEach((tag) => {
                if (!stats[tag]) {
                    stats[tag] = {
                        total: 0,
                        positive: 0,
                        negative: 0,
                        neutral: 0,
                    };
                }
                stats[tag].total += 1;

                if (task.sentiment === 1) {
                    stats[tag].positive += 1;
                } else if (task.sentiment === -1) {
                    stats[tag].negative += 1;
                } else {
                    stats[tag].neutral += 1;
                }
            });
        });

        let result = Object.entries(stats)
            .filter(([_, data]) => data.total >= 3)
            .map(([name, data]) => ({
                name,
                total: data.total,
                positivePct: (data.positive / data.total) * 100,
                neutralPct: (data.neutral / data.total) * 100,
                negativePct: (data.negative / data.total) * 100,
            }))
            .sort((a, b) => {
                if (sortBy === "positive") {
                    return b.positivePct - a.positivePct;
                } else {
                    return b.negativePct - a.negativePct;
                }
            });

        if (!isFullScreen) {
            result = result.slice(0, 5);
        }
        return result;
    }

    let joyStacks = $derived(getJoyStacks());

    function toggleDropdown(event) {
        event.stopPropagation();
        isDropdownOpen = !isDropdownOpen;
    }

    function selectSort(option) {
        sortBy = option;
        isDropdownOpen = false;
    }

    function toggleFullScreen() {
        isFullScreen = !isFullScreen;
        isDropdownOpen = false; // Close dropdown if open
    }

    function handleWindowClick() {
        if (isDropdownOpen) {
            isDropdownOpen = false;
        }
    }
</script>

<svelte:window onclick={handleWindowClick} />

<div class="widget-card {isFullScreen ? 'is-fullscreen' : ''}">
    <div class="widget-header">
        <span class="widget-label">Tags vs. Sentiment</span>
        <div class="header-controls">
            <div class="sort-container">
                <button
                    class="control-button icon-only"
                    onclick={toggleDropdown}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                    title="Sort by {sortBy === 'positive'
                        ? 'Most Positive'
                        : 'Most Negative'}"
                >
                    <span class="material-symbols-outlined">sort</span>
                </button>
                {#if isDropdownOpen}
                    <div class="dropdown-menu">
                        <button
                            class="dropdown-item {sortBy === 'positive'
                                ? 'selected'
                                : ''}"
                            onclick={() => selectSort("positive")}
                        >
                            Top Positive
                        </button>
                        <button
                            class="dropdown-item {sortBy === 'negative'
                                ? 'selected'
                                : ''}"
                            onclick={() => selectSort("negative")}
                        >
                            Top Negative
                        </button>
                    </div>
                {/if}
            </div>
            <button
                class="control-button icon-only"
                onclick={toggleFullScreen}
                title={isFullScreen ? "Minimize" : "Maximize"}
            >
                <span class="material-symbols-outlined">
                    {isFullScreen ? 'close_fullscreen' : 'open_in_full'}
                </span>
            </button>
        </div>
    </div>
    <div class="widget-chart-container">
        {#each joyStacks as item}
            <div class="chart-row">
                <div class="chart-row-meta">
                    <span class="chart-row-label" style="text-transform: none;"
                        >{item.name}
                        <span class="count">({item.total})</span></span
                    >
                </div>
                <div class="bar-wrapper">
                    {#if item.positivePct > 0}
                        <div
                            class="bar-segment positive"
                            style="width: {item.positivePct}%"
                            title="Positive: {item.positivePct.toFixed(0)}%"
                        >
                            {#if item.positivePct > 10}
                                <span class="segment-label"
                                    >{item.positivePct.toFixed(0)}%</span
                                >
                            {/if}
                        </div>
                    {/if}
                    {#if item.neutralPct > 0}
                        <div
                            class="bar-segment neutral"
                            style="width: {item.neutralPct}%"
                            title="Neutral: {item.neutralPct.toFixed(0)}%"
                        >
                            {#if item.neutralPct > 10}
                                <span class="segment-label"
                                    >{item.neutralPct.toFixed(0)}%</span
                                >
                            {/if}
                        </div>
                    {/if}
                    {#if item.negativePct > 0}
                        <div
                            class="bar-segment negative"
                            style="width: {item.negativePct}%"
                            title="Negative: {item.negativePct.toFixed(0)}%"
                        >
                            {#if item.negativePct > 10}
                                <span class="segment-label"
                                    >{item.negativePct.toFixed(0)}%</span
                                >
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
        {#if joyStacks.length === 0}
            <div class="empty-state">No tags with 3+ occurrences</div>
        {/if}
    </div>
</div>

<style>
    .widget-card {
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md);
        display: flex;
        flex-direction: column;
        gap: 12px;
        transition: border-color 0.2s ease;
        position: relative;
    }
    .widget-card.is-fullscreen {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90vw;
        max-width: 800px;
        height: auto;
        max-height: 90vh;
        z-index: 9999;
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border);
        overflow-y: auto;
        padding: 24px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 100vmax rgba(0, 0, 0, 0.5);
    }
    .widget-card:hover {
        border-color: var(--color-border-hover);
    }
    .widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--color-bg-body);
        padding-bottom: 4px;
        position: relative;
        z-index: 10;
    }
    .header-controls {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .widget-label {
        font-size: 12px;
        font-weight: 700;
        color: var(--color-text-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }
    .sort-container {
        position: relative;
    }
    .control-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--color-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        border-radius: 4px;
    }
    .control-button:hover {
        background-color: var(--color-bg-body);
        color: var(--color-text-main);
    }
    .control-button span {
        font-size: 18px;
    }
    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 4px;
        min-width: 120px;
        z-index: 20;
        display: flex;
        flex-direction: column;
    }
    .dropdown-item {
        background: none;
        border: none;
        text-align: left;
        padding: 6px 12px;
        font-size: 11px;
        color: var(--color-text-secondary);
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.15s ease;
    }
    .dropdown-item:hover {
        background-color: var(--color-bg-body);
        color: var(--color-text-main);
    }
    .dropdown-item.selected {
        font-weight: 600;
        color: var(--color-primary-black);
        background-color: var(--color-bg-body);
    }
    .widget-chart-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .chart-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .chart-row-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .chart-row-label {
        font-size: 12px;
        color: var(--color-text-secondary);
        font-weight: 500;
        text-transform: uppercase;
    }
    .count {
        color: var(--color-text-muted);
        font-size: 11px;
    }
    .bar-wrapper {
        height: 18px;
        width: 100%;
        background-color: var(--color-bg-body);
        border-radius: 4px;
        overflow: hidden;
        display: flex;
    }
    .bar-segment {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
    .segment-label {
        font-size: 10px;
        font-weight: 600;
        color: #ffffff;
        padding: 0 2px;
    }
    .bar-segment.positive {
        background-color: #10b981; /* Green */
    }
    .bar-segment.neutral {
        background-color: #d1d5db; /* Grey */
    }
    .bar-segment.neutral .segment-label {
        color: #4b5563;
    }
    .bar-segment.negative {
        background-color: #ef4444; /* Red */
    }
    .empty-state {
        font-size: 12px;
        color: var(--color-text-muted);
        font-style: italic;
    }
</style>