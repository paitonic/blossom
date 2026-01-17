<script>
    import { onMount } from "svelte";
    import * as echarts from "echarts";
    import { COLORS } from "@/shared/colors.js";

    const { tasks, field, title } = $props();

    const chartId = `chart-${field}-${Math.random().toString(36).substring(2, 9)}`;

    let chart;
    let data = $derived.by(() => {
        const agg = tasks.reduce((acc, task) => {
            const key = task[field] || "N/A";
            return {
                ...acc,
                [key]: (acc[key] || 0) + 1,
            };
        }, {});

        return Object.keys(agg).map((key) => ({
            name: key,
            value: agg[key],
        }));
    });

    let total = $derived(data.reduce((sum, d) => sum + d.value, 0));

    $effect(() => {
        if (data.length > 0 && chart) {
            const chartColors = data.map((d) => COLORS[field]?.[d.name] || '#cccccc');

            chart.setOption({
                title: {
                    text: total,
                    subtext: "Tasks",
                    left: "center",
                    top: "40%",
                    textStyle: {
                        fontSize: 30,
                    },
                    subtextStyle: {
                        fontSize: 14,
                    },
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)",
                },
                legend: {
                    orient: "horizontal",
                    bottom: 10,
                    data: data.map((d) => d.name),
                    type: 'scroll'
                },
                color: chartColors,
                series: [
                    {
                        name: title,
                        type: "pie",
                        radius: ["50%", "70%"],
                        center: ["50%", "50%"],
                        startAngle: 180,
                        label: {
                            show: false,
                        },
                        data: data,
                    },
                ],
            });
        }
    });

    onMount(() => {
        chart = echarts.init(document.getElementById(chartId));
        const resizeObserver = new ResizeObserver(() => {
            chart.resize();
        });
        resizeObserver.observe(document.getElementById(chartId));

        return () => {
            resizeObserver.disconnect();
        }
    });
</script>

<div class="chart-container">
    <h3>{title}</h3>
    <div id={chartId} class="chart"></div>
</div>

<style>
    .chart-container {
        flex: 0 0 calc((100% - (4 * 16px)) / 5); /* 5 charts with 4 gaps */
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
    }
    .chart-container h3 {
        margin: 0 0 16px;
        text-align: center;
    }
    .chart {
        width: 100%;
        height: 250px;
    }
</style>
