<script lang="ts">
    import TaskList from "./TaskList.svelte";
    import Pagination from "./Pagination.svelte";
    import SearchBar from "./SearchBar.svelte";
    import FilterButton from "./FilterButton.svelte";
    import SortButton from "./SortButton.svelte";

    let tasks = [
        {
            date: "Oct 24, 2023",
            title: "Refactor Authentication Flow",
            repo: "blossom-auth",
            tags: ["Backend", "Security"],
            score: 4,
            notes: "Current implementation uses legacy JWT validation. We need to update the interceptors to handle the new refresh token rotation strategy. Also, investigate the race condition on logout observed in the staging environment.",
        },
        {
            date: "Oct 23, 2023",
            title: "Optimize Database Queries",
            repo: "core-api",
            tags: ["Performance", "Database", "V2", "Redis", "Postgres"],
            score: 3,
            notes: "The user dashboard load time has increased by 300ms. Analyze the N+1 query issues in the main dashboard view widget loader.",
        },
        {
            date: "Oct 22, 2023",
            title: "Update UI Component Library",
            repo: "blossom-ui-kit",
            tags: ["Frontend", "Design System"],
            score: 5,
            notes: "Migrate all buttons and inputs to the new 'Blossom UI' minimalist package. Ensure all accessibility attributes are preserved during migration.",
        },
        {
            date: "Oct 20, 2023",
            title: "Fix API Rate Limiting",
            repo: "edge-worker",
            tags: ["API", "Bug"],
            score: 2,
            notes: "Redis counter is not decrementing correctly on failed requests. Check the Lua script logic.",
        },
    ];
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
