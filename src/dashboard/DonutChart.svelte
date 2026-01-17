<script>
    import { onMount } from "svelte";
    import * as echarts from "echarts";

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
            chart.setOption({
                title: {
                    text: field,
                    left: "center",
                    top: "43%",
                    textStyle: {
                        fontSize: 18,
                    },
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{b}: {c} ({d}%)",
                },
                series: [
                    {
                        name: title,
                        type: "pie",
                        radius: ["50%", "70%"],
                        center: ["50%", "50%"],
                        startAngle: 180,
                        // endAngle: 360,
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
        };
    });
</script>

<div class="chart-container">
    <div id={chartId} class="chart"></div>
</div>

<style>
    .chart-container {
        display: flex;
        flex: 0 0 calc((100% - (4 * 16px)) / 5); /* 5 charts with 4 gaps */
    }
    .chart {
        width: 100%;
        height: 250px;
    }
</style>
