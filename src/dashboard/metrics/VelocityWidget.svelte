<script>
    import Tooltip from "@/components/Tooltip.svelte";

    const { tasks } = $props();

    const EFFORT_MAP = {
        xs: 1,
        s: 2,
        m: 3,
        l: 5,
        xl: 8,
    };

    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
    }

    let velocityByWeek = $derived.by(() => {
        const byWeek = tasks.reduce((acc, task) => {
            if (!task.openedAt || !task.effort) return acc;

            const weekStart = getStartOfWeek(new Date(task.openedAt));
            const effortValue = EFFORT_MAP[task.effort.toLowerCase()] || 0;

            acc[weekStart] = (acc[weekStart] || 0) + effortValue;

            return acc;
        }, {});

        const allSortedWeeks = Object.keys(byWeek).sort(
            (a, b) => Number(a) - Number(b),
        );

        if (allSortedWeeks.length === 0) return [];

        const latestWeekMs = Number(allSortedWeeks[allSortedWeeks.length - 1]);
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;

        // Generate last 16 weeks ending at latestWeekMs
        const last16WeeksKeys = Array.from({ length: 16 }, (_, i) => {
            return latestWeekMs - (15 - i) * msPerWeek;
        });

        const last16WeeksData = last16WeeksKeys.reduce((acc, weekMs) => {
            acc[weekMs] = byWeek[weekMs] || 0;
            return acc;
        }, {});

        const maxVelocity = Math.max(...Object.values(last16WeeksData), 0);

        return last16WeeksKeys.map((weekStartMs) => {
            const weekStart = new Date(Number(weekStartMs));
            const value = last16WeeksData[weekStartMs];
            return {
                name: weekStart.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                }),
                value,
                percentage: maxVelocity > 0 ? (value / maxVelocity) * 100 : 0,
            };
        });
    });
</script>

<div class="widget-card">
    <div class="widget-header">
        <span class="widget-label">Velocity</span>
        <Tooltip position="right" text="Velocity measures the total 'effort' of pull requests completed each week. XS=1, S=2, M=3, L=5, XL=8.">
            <span class="material-symbols-outlined help-icon">help</span>
        </Tooltip>
    </div>
    <div class="widget-chart-container">
        {#each velocityByWeek as item}
            <div class="chart-column">
                <div class="bar-wrapper">
                    <div
                        class="bar-fill gray"
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
    .widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--color-bg-body);
        padding-bottom: 4px;
    }
    .widget-label {
        font-size: 12px;
        font-weight: 700;
        color: var(--color-text-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }
    .help-icon {
        font-size: 16px;
        color: var(--color-text-muted);
        cursor: help;
        transition: color 0.2s ease;
    }
    .help-icon:hover {
        color: var(--color-text-secondary);
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
    .bar-fill.gray {
        background-color: #9ca3af;
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