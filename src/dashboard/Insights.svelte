<script>
    import DonutChart from "./DonutChart.svelte";

    const { tasks } = $props();

    let topTags = $derived.by(() => {
        const tagCounts = tasks.flatMap(task => task.tags || []).reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});

        const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
        
        if (sortedTags.length === 0) {
            return [];
        }

        const top20Tags = sortedTags.slice(0, 20);
        const minCount = top20Tags[top20Tags.length - 1][1];
        const maxCount = top20Tags[0][1];

        const minFontSize = 12; // min font size in px
        const maxFontSize = 28; // max font size in px

        return top20Tags.map(([tag, count]) => {
            const ratio = (count - minCount) / (maxCount - minCount || 1);
            const fontSize = minFontSize + ratio * (maxFontSize - minFontSize);
            return { tag, count, fontSize };
        });
    });

    let topRepos = $derived.by(() => {
        const repoCounts = tasks.reduce((acc, task) => {
            if (task.repository) {
                acc[task.repository] = (acc[task.repository] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(repoCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
    });
</script>

<div class="insights-container">
    <h2>Insights</h2>
    <p>This page provides an overview of your work based on the ratings you've provided.</p>

    <div class="charts-grid">
        <DonutChart {tasks} field="type" title="By Type" />
        <DonutChart {tasks} field="impact" title="By Impact" />
        <DonutChart {tasks} field="size" title="By Size" />
        <DonutChart {tasks} field="challenge" title="By Challenge" />
        <DonutChart {tasks} field="reaction" title="By Reaction" />
    </div>

    <div class="bottom-grid">
        <div class="list-container">
            <h3>Top Mentioned Tags</h3>
            {#if topTags.length > 0}
                <div class="tag-cloud">
                    {#each topTags as { tag, count, fontSize }}
                        <span 
                            class="tag-cloud-item" 
                            style="font-size: {fontSize}px;"
                        >
                            {tag}<span class="tag-cloud-count">{count}</span>
                        </span>
                    {/each}
                </div>
            {:else}
                <p>No tags have been used yet.</p>
            {/if}
        </div>

        <div class="list-container">
            <h3>Top Mentioned Repositories</h3>
            {#if topRepos.length > 0}
                <ul class="repo-list">
                    {#each topRepos as [repo, count]}
                        <li class="repo-item">
                            <span class="repo-name">{repo}</span>
                            <span class="repo-count">{count}</span>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>No repository data available.</p>
            {/if}
        </div>
    </div>
</div>

<style>
    /* ... other styles ... */
    .insights-container {
        width: 100%;
        max-width: 1500px;
        margin: 0 auto;
    }
    .charts-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 24px;
    }
    .bottom-grid {
        display: flex;
        gap: 24px;
    }
    .list-container {
        flex: 1;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
        min-width: 0; /* Prevents flex items from overflowing */
    }
    .list-container h3 {
        margin: 0 0 16px;
        text-align: center;
    }

    /* Tag Cloud */
    .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 16px;
        justify-content: center;
        align-items: center;
    }
    .tag-cloud-item {
        font-weight: 600;
        color: #555;
        display: inline-flex;
        align-items: baseline;
        gap: 4px;
    }
    .tag-cloud-count {
        font-size: 0.7em;
        font-weight: 700;
        background-color: #eee;
        color: #555;
        padding: 0.1em 0.4em;
        border-radius: 4px;
    }

    /* Repositories List */
    /* ... other styles ... */
    .repo-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .repo-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background-color: #f9fafb;
        border: 1px solid #eee;
        border-radius: 6px;
    }
    .repo-name {
        font-weight: 500;
        font-family: monospace;
    }
    .repo-count {
        font-weight: 700;
        font-size: 14px;
        color: #10b981;
    }
</style>
