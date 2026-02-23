<script>
    import { COLORS } from "@/shared/colors.js";

    const { tasks } = $props();

    function getAggregations(field) {
        const agg = tasks.reduce((acc, task) => {
            const key = task[field] || "N/A";
            if (Array.isArray(key)) {
                key.forEach((k) => {
                    acc[k] = (acc[k] || 0) + 1;
                });
            } else {
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {});

        const total = Object.values(agg).reduce((sum, count) => sum + count, 0);

        return Object.entries(agg)
            .map(([name, value]) => ({
                name,
                value,
                percentage: total > 0 ? (value / total) * 100 : 0,
            }))
            .sort((a, b) => b.value - a.value);
    }

    let topTags = $derived(getAggregations("tags").slice(0, 5));
</script>

<div class="widget-card">
    <span class="widget-label">Top Tags</span>
    <div class="widget-chart-container">
        {#each topTags as item}
            <div class="chart-row">
                <div class="chart-row-meta">
                    <span class="chart-row-label" style="text-transform: none;"
                        >{item.name}</span
                    >
                    <div class="chart-row-values">
                        <span class="chart-row-value"
                            >{item.percentage.toFixed(0)}%</span
                        >
                        <span class="chart-row-value-small">{item.value}</span>
                    </div>
                </div>
                <div class="bar-wrapper">
                    <div
                        class="bar-fill"
                        style="width: {item.percentage}%; background-color: {'#ccc'}"
                    ></div>
                </div>
            </div>
        {/each}
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
    .chart-row-value {
        font-size: 12px;
        font-family: monospace;
        line-height: 1;
    }
    .chart-row-values {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
    }
    .chart-row-value-small {
        font-size: 12px;
        color: var(--color-text-muted);
        font-family: monospace;
        line-height: 1;
    }
    .bar-wrapper {
        height: 8px;
        width: 100%;
        background-color: var(--color-bg-body);
        border-radius: 2px;
        overflow: hidden;
    }
    .bar-fill {
        height: 100%;
        border-radius: 2px;
    }
</style>
