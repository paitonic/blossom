<script>
    const { tasks } = $props();

    const SIZE_MAP = {
        small: 1,
        medium: 3,
        large: 5,
    };

    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
    }

    let velocityByWeek = $derived.by(() => {
        const byWeek = tasks.reduce((acc, task) => {
            if (!task.openedAt || !task.size) return acc;

            const weekStart = getStartOfWeek(new Date(task.openedAt));
            const sizeValue = SIZE_MAP[task.size.toLowerCase()] || 0;

            acc[weekStart] = (acc[weekStart] || 0) + sizeValue;

            return acc;
        }, {});

        const sortedWeeks = Object.keys(byWeek).sort(
            (a, b) => Number(a) - Number(b),
        ).slice(-5);

        const maxVelocity = Math.max(...Object.values(byWeek), 0);

        return sortedWeeks.map((weekStartMs) => {
            const weekStart = new Date(Number(weekStartMs));
            const value = byWeek[weekStartMs];
            return {
                name: weekStart.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                value,
                percentage: maxVelocity > 0 ? (value / maxVelocity) * 100 : 0,
            };
        });
    });
</script>

<div class="widget-card">
    <span class="widget-label">Velocity</span>
    <div class="widget-chart-container">
        {#each velocityByWeek as item}
            <div class="chart-row">
                <div class="chart-row-meta">
                    <span class="chart-row-label">{item.name}</span>
                    <div class="chart-row-values">
                        <span class="chart-row-value-small">{item.value}</span>
                    </div>
                </div>
                <div class="bar-wrapper">
                    <div
                        class="bar-fill black"
                        style="width: {item.percentage}%;"
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
    .bar-fill.black {
        background-color: var(--color-primary-black);
    }
</style>
