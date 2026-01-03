<script lang="ts">
    import TaskListItem from "./TaskListItem.svelte";

    let { tasks } = $props();
</script>

<div class="task-list-header">
    <div class="header-cell">Date</div>
    <div class="header-cell">Title</div>
    <div class="header-cell">Repository</div>
    <div class="header-cell">Tags</div>
    <div class="header-cell">Rating</div>
    <div class="header-cell" />
</div>
{#each tasks as task, i}
    <TaskListItem {...task} open={i === 0} />
{/each}

<style>
    .task-list-header {
        display: grid;
        grid-template-columns: 110px 1.8fr 140px 1.5fr 110px 40px;
        gap: var(--spacing-md);
        padding: 0 var(--spacing-lg) var(--spacing-sm) var(--spacing-lg);
        margin-bottom: 4px;
    }
    .header-cell {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--color-text-muted);
        letter-spacing: 0.05em;
    }
</style>
