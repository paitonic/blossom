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

        const allSortedWeeks = Object.keys(byWeek).sort(
            (a, b) => Number(a) - Number(b),
        );

        const last5WeeksKeys = allSortedWeeks.slice(-5);

        const last5WeeksData = last5WeeksKeys.reduce((acc, week) => {
            acc[week] = byWeek[week];
            return acc;
        }, {});

        const maxVelocity = Math.max(...Object.values(last5WeeksData), 0);

        return last5WeeksKeys.map((weekStartMs) => {
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
            <div class="chart-column">
                <div class="bar-wrapper">
                    <div
                        class="bar-fill black"
                        style="height: {item.percentage}%;"
                    >
                        {#if item.value > 0}
                            <span class="bar-value">{item.value}</span>
                        {/if}
                    </div>
                </div>
                <span class="chart-label">{item.name}</span>
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
        flex-direction: row;
        gap: 12px;
        align-items: flex-end;
        flex: 1;
        padding-top: 16px;
        min-height: 100px;
    }
    .chart-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        flex: 1;
        height: 100%;
    }
    .bar-wrapper {
        flex: 1;
        width: 100%;
        background-color: var(--color-bg-body);
        border-radius: 4px;
        overflow: visible;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        position: relative;
    }
    .bar-fill {
        width: 100%;
        border-radius: 4px;
        transition: height 0.3s ease;
        position: relative;
    }
    .bar-fill.black {
        background-color: var(--color-primary-black);
    }
    .bar-value {
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        font-family: monospace;
        color: var(--color-text-secondary);
    }
    .chart-label {
        font-size: 10px;
        color: var(--color-text-muted);
        font-weight: 600;
        text-transform: uppercase;
        text-align: center;
    }
</style>