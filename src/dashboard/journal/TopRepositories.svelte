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

    let topRepositories = $derived(getAggregations("repository").slice(0, 5));
</script>

<div class="widget-card">
    <span class="widget-label">Top Repositories</span>
    <div class="widget-chart-container">
        {#each topRepositories as item}
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
    <button
        class="show-all-link"
        onclick={() => {
            /* TODO: implement show all repositories */
        }}>Show All</button
    >
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
        --color-bg-hover: #f3f4f6;
        --color-bg-nav-active: #111827;
        --color-text-nav-active: #ffffff;
        --spacing-xs: 4px;
        --spacing-sm: 8px;
        --spacing-md: 12px;
        --spacing-lg: 16px;
        --spacing-xl: 24px;
        --spacing-2xl: 32px;
        --radius-md: 6px;
        --radius-lg: 8px;
        --radius-xl: 12px;
        --radius-full: 9999px;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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
    .show-all-link {
        font-size: 10px;
        color: var(--color-text-muted);
        text-decoration: none;
        text-transform: uppercase;
        font-weight: 600;
        align-self: flex-end;
        margin-top: auto;
        transition: color 0.2s ease;
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
    }
    .show-all-link:hover {
        color: var(--color-text-main);
    }
</style>
