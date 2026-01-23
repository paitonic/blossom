<script>
    const { tasks } = $props();

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

                if (task.reaction === "positive") {
                    stats[tag].positive += 1;
                } else if (task.reaction === "negative") {
                    stats[tag].negative += 1;
                } else {
                    stats[tag].neutral += 1;
                }
            });
        });

        return Object.entries(stats)
            .filter(([_, data]) => data.total >= 3)
            .map(([name, data]) => ({
                name,
                total: data.total,
                positivePct: (data.positive / data.total) * 100,
                neutralPct: (data.neutral / data.total) * 100,
                negativePct: (data.negative / data.total) * 100,
            }))
            .sort((a, b) => b.positivePct - a.positivePct)
            .slice(0, 5);
    }

    let joyStacks = $derived(getJoyStacks());
</script>

<div class="widget-card">
    <span class="widget-label">Reaction Distribution</span>
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
    :global(:root) {
        --font-family: "Inter", sans-serif;
        --color-bg-body: #f9fafb;
        --color-bg-white: #ffffff;
        --color-border: #e5e7eb;
        --color-border-hover: #d1d5db;
        --color-text-main: #111827;
        --color-text-secondary: #4b5563;
        --color-text-muted: #9ca3af;
        --color-primary-black: #111827;
        --radius-lg: 8px;
        --spacing-md: 12px;
    }
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
    .widget-card:hover {
        border-color: var(--color-border-hover);
    }
    .widget-label {
        font-size: 12px;
        font-weight: 700;
        color: var(--color-text-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-bottom: 1px solid var(--color-bg-body);
        padding-bottom: 4px;
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
