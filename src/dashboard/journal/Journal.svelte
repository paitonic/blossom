<script lang="ts">
    import TaskList from "./TaskList.svelte";
    import Pagination from "./Pagination.svelte";
    import SearchBar from "./SearchBar.svelte";
    import FilterButton from "./FilterButton.svelte";
    import SortButton from "./SortButton.svelte";
    import JournalWidgets from "./JournalWidgets.svelte";

    let { tasks } = $props();
</script>

<div class="journal-container">
    <!-- <div class="toolbar">
        <SearchBar />
        <div class="filters">
            <FilterButton icon="calendar_today" label="Date" />
            <FilterButton icon="label" label="Tags" />
            <div class="divider" />
            <SortButton />
        </div>
    </div> -->
    <JournalWidgets {tasks} />
    <TaskList {tasks} />
    <!-- <Pagination /> -->
</div>

<style>
    .journal-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding-bottom: var(--spacing-2xl);
    }
    .toolbar {
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    @media (min-width: 640px) {
        .toolbar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
    }
    .filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        width: 100%;
    }
    @media (min-width: 640px) {
        .filters {
            width: auto;
        }
    }
    .divider {
        height: 24px;
        width: 1px;
        background-color: var(--color-border);
        margin: 0 4px;
        display: none;
    }
    @media (min-width: 640px) {
        .divider {
            display: block;
        }
    }
</style>
