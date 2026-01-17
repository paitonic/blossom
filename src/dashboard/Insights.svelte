<script>
    import DonutChart from "./DonutChart.svelte";

    const { tasks } = $props();
</script>

<div class="insights-container">
    <div class="charts-grid">
        <DonutChart {tasks} field="type" />
        <DonutChart {tasks} field="impact" />
        <DonutChart {tasks} field="size" />
        <DonutChart {tasks} field="challenge" />
        <DonutChart {tasks} field="reaction" />
    </div>
</div>

<style>
    .insights-container {
        width: 100%;
        max-width: 1500px; /* Increased max-width to better fit 5 charts */
        margin: 0 auto;
    }
    .charts-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
    }
</style>
