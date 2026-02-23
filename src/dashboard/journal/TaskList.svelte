<script lang="ts">
    import TaskListItem from "./TaskListItem.svelte";

    let { tasks, sortOrder = "newest", onEdit, onDelete } = $props();
</script>

<div class="task-list-header">
    <div class="header-cell">Date</div>
    <div class="header-cell">Title</div>
    <div class="header-cell">Type</div>
    <div class="header-cell">Effort</div>
    <div class="header-cell">Challenge</div>
    <div class="header-cell">Impact</div>
    <div class="header-cell">Sentiment</div>
    <div class="header-cell"></div>
</div>

{#each tasks as task, i}
    <TaskListItem {...task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task)} />
{:else}
    <div class="empty-state">
        No tasks found matching your search.
    </div>
{/each}

<style>
    .empty-state {
        padding: 48px;
        text-align: center;
        color: var(--color-text-muted);
        background-color: var(--color-bg-white);
        border: 1px dashed var(--color-border);
        border-radius: var(--radius-lg);
        margin-top: 8px;
    }
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
