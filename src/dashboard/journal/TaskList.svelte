<script lang="ts">
    import TaskListItem from "./TaskListItem.svelte";

    let { tasks, onEdit, onDelete } = $props();

    const sortedTasks = $derived.by(() => {
        return tasks.toSorted((a, b) => {
            if (a.openedAt < b.openedAt) {
                return 1;
            } else if (a.openedAt > b.openedAt) {
                return -1;
            } else {
                return 0;
            }
        });
    });
</script>

<div class="task-list-header">
    <div class="header-cell">Date</div>
    <div class="header-cell">Title</div>
    <div class="header-cell">Type</div>
    <div class="header-cell">Effort</div>
    <div class="header-cell">Challenge</div>
    <div class="header-cell">Impact</div>
    <div class="header-cell">Sentiment</div>
    <div class="header-cell" />
</div>

{#each sortedTasks as task, i}
    <TaskListItem {...task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} />
{/each}

<style>
    .task-list-header {
        display: grid;
        grid-template-columns: 110px 2fr 90px 50px 80px 80px 50px 40px;
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
