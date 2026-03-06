<script>
    import { COLORS } from "@/shared/colors.js";
    import TopRepositories from "./TopRepositories.svelte";
    import TopTags from "./TopTags.svelte";
    import VelocityWidget from "./VelocityWidget.svelte";
    import JoyStackWidget from "./JoyStackWidget.svelte";
    import EmptyState from "./EmptyState.svelte";

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

    let byType = $derived(getAggregations("type"));
    let byChallenge = $derived(getAggregations("challenge"));
    let byEffort = $derived(getAggregations("effort"));
    let byImpact = $derived(getAggregations("impact"));
    let bySentiment = $derived(getAggregations("sentiment"));

    const sentimentLabels = {
        "-1": "Negative",
        "0": "Neutral",
        "1": "Positive",
    };
</script>

<div class="metrics-container">
    <div class="stats-widgets-row">
        <VelocityWidget {tasks} />
        <div class="widget-card">
            <span class="widget-label">Type</span>
            <div class="widget-chart-container">
                {#each byType as item}
                    <div class="chart-row">
                        <div class="chart-row-meta">
                            <span class="chart-row-label">{item.name}</span>
                            <div class="chart-row-values">
                                <span class="chart-row-value"
                                    >{item.percentage.toFixed(0)}%</span
                                >
                                <span class="chart-row-value-small"
                                    >{item.value}</span
                                >
                            </div>
                        </div>
                        <div class="bar-wrapper">
                            <div
                                class="bar-fill"
                                style="width: {item.percentage}%; background-color: {COLORS
                                    .type[item.name] || '#ccc'}"
                            ></div>
                        </div>
                    </div>
                {:else}
                    <EmptyState />
                {/each}
            </div>
        </div>
        <div class="widget-card">
            <span class="widget-label">Challenge</span>
            <div class="widget-chart-container">
                {#each byChallenge as item}
                    <div class="chart-row">
                        <div class="chart-row-meta">
                            <span class="chart-row-label">{item.name}</span>
                            <div class="chart-row-values">
                                <span class="chart-row-value"
                                    >{item.percentage.toFixed(0)}%</span
                                >
                                <span class="chart-row-value-small"
                                    >{item.value}</span
                                >
                            </div>
                        </div>
                        <div class="bar-wrapper">
                            <div
                                class="bar-fill"
                                style="width: {item.percentage}%; background-color: {COLORS
                                    .challenge[item.name] || '#ccc'}"
                            ></div>
                        </div>
                    </div>
                {:else}
                    <EmptyState />
                {/each}
            </div>
        </div>
        <div class="widget-card">
            <span class="widget-label">Effort</span>
            <div class="widget-chart-container">
                {#each byEffort as item}
                    <div class="chart-row">
                        <div class="chart-row-meta">
                            <span class="chart-row-label">{item.name}</span>
                            <div class="chart-row-values">
                                <span class="chart-row-value"
                                    >{item.percentage.toFixed(0)}%</span
                                >
                                <span class="chart-row-value-small"
                                    >{item.value}</span
                                >
                            </div>
                        </div>
                        <div class="bar-wrapper">
                            <div
                                class="bar-fill"
                                style="width: {item.percentage}%; background-color: {COLORS
                                    .effort[item.name] || '#ccc'}"
                            ></div>
                        </div>
                    </div>
                {:else}
                    <EmptyState />
                {/each}
            </div>
        </div>
        <div class="widget-card">
            <span class="widget-label">Impact</span>
            <div class="widget-chart-container">
                {#each byImpact as item}
                    <div class="chart-row">
                        <div class="chart-row-meta">
                            <span class="chart-row-label">{item.name}</span>
                            <div class="chart-row-values">
                                <span class="chart-row-value"
                                    >{item.percentage.toFixed(0)}%</span
                                >
                                <span class="chart-row-value-small"
                                    >{item.value}</span
                                >
                            </div>
                        </div>
                        <div class="bar-wrapper">
                            <div
                                class="bar-fill"
                                style="width: {item.percentage}%; background-color: {COLORS
                                    .impact[item.name] || '#ccc'}"
                            ></div>
                        </div>
                    </div>
                {:else}
                    <EmptyState />
                {/each}
            </div>
        </div>
        <div class="widget-card">
            <span class="widget-label">Sentiment</span>
            <div class="widget-chart-container">
                {#each bySentiment as item}
                    <div class="chart-row">
                        <div class="chart-row-meta">
                            <span class="chart-row-label">{sentimentLabels[item.name] || item.name}</span>
                            <div class="chart-row-values">
                                <span class="chart-row-value"
                                    >{item.percentage.toFixed(0)}%</span
                                >
                                <span class="chart-row-value-small"
                                    >{item.value}</span
                                >
                            </div>
                        </div>
                        <div class="bar-wrapper">
                            <div
                                class="bar-fill"
                                style="width: {item.percentage}%; background-color: {COLORS
                                    .sentiment[item.name] || '#ccc'}"
                            ></div>
                        </div>
                    </div>
                {:else}
                    <EmptyState />
                {/each}
            </div>
        </div>
        <TopTags {tasks} />
        <JoyStackWidget {tasks} />
        <TopRepositories {tasks} />
    </div>
</div>

<style>
    .metrics-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding-bottom: var(--spacing-2xl);
    }
    .stats-widgets-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
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
    </style>
    