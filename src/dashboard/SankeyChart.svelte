<script>
    import { onMount } from "svelte";
    import * as echarts from "echarts";

    const { tasks, fromField, toField, title } = $props();

    let chartContainer;
    let chart;

    let data = $derived.by(() => {
        const field1 = new Set();
        const field2 = new Set();

        const fromFieldOptions = tasks.map((t) => t[fromField]);
        const toFieldOptions = tasks.map((t) => t[toField]);
        const options = Array.from(
            new Set(fromFieldOptions.concat(toFieldOptions)),
        ).map((field) => {
            return { name: field };
        });

        const links = tasks.reduce((acc, current) => {
            const key = `${current[fromField]}:${current[toField]}`;
            const obj = acc[key] || {
                source: current[fromField],
                target: current[toField],
                value: 0,
            };
            obj.value += 1;
            return {
                ...acc,
                [key]: obj,
            };
        }, []);

        return {
            data: options,
            links: Object.values(links),
        };
    });

    $effect(() => {
        console.log("$effect: ", $state.snapshot(data));
        if (!chart || !data.data || !data.links) {
            return;
        }
        const option = {
            series: {
                type: "sankey",
                layout: "none",
                emphasis: {
                    focus: "adjacency",
                },
                data: data.data,
                links: data.links,
            },
        };

        console.log("$effect");
        chart.setOption(option);
        console.log("charts: ", chart);
        console.log("$effect: ", data);
    });

    onMount(() => {
        console.log("onMount");
        chart = echarts.init(document.getElementById("sankey"));
        const resizeObserver = new ResizeObserver(() => {
            chart.resize();
        });
        resizeObserver.observe(document.getElementById("sankey"));

        return () => {
            resizeObserver.disconnect();
        };
    });
</script>

<div id="sankey" class="sankey-container" bind:this={chartContainer}></div>

<style>
    .sankey-container {
        width: 100%;
        height: 500px;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
    }
</style>
