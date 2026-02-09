<script lang="ts">
    import TaskList from "./TaskList.svelte";
    import Pagination from "./Pagination.svelte";
    import SearchBar from "./SearchBar.svelte";
    import FilterButton from "./FilterButton.svelte";
    import SortButton from "./SortButton.svelte";
    import EditTaskModal from "./EditTaskModal.svelte";
    import ConfirmationModal from "@/dashboard/components/ConfirmationModal.svelte";
    import { storage } from "@/shared/storage.svelte";

    let { tasks, refresh } = $props();

    let searchQuery = $state("");

    let filteredTasks = $derived(
        tasks.filter((task) => {
            const query = searchQuery.toLowerCase();
            const title = task.title ? task.title.toLowerCase() : "";
            const notes = task.notes ? task.notes.toLowerCase() : "";
            return title.includes(query) || notes.includes(query);
        }),
    );

    let editingTask = $state(null);
    let isModalOpen = $state(false);

    let deletingTask = $state(null);
    let isDeleteModalOpen = $state(false);

    const handleEdit = (task) => {
        editingTask = task;
        isModalOpen = true;
    };

    const handleDelete = (task) => {
        deletingTask = task;
        isDeleteModalOpen = true;
    };

    const handleSave = async (updatedTask) => {
        if (
            updatedTask &&
            updatedTask.user &&
            updatedTask.repository &&
            updatedTask.pullRequestID
        ) {
            const key = `${updatedTask.user}/${updatedTask.repository}/${updatedTask.pullRequestID}`;
            await storage.kset(key, updatedTask);
            if (refresh) {
                refresh();
            }
        }
    };

    const confirmDelete = async () => {
        if (
            deletingTask &&
            deletingTask.user &&
            deletingTask.repository &&
            deletingTask.pullRequestID
        ) {
            const key = `${deletingTask.user}/${deletingTask.repository}/${deletingTask.pullRequestID}`;
            await storage.kdelete(key);
            if (refresh) {
                refresh();
            }
        }
        isDeleteModalOpen = false;
        deletingTask = null;
    };
</script>

<div class="journal-container">
    <div class="toolbar">
        <SearchBar bind:value={searchQuery} />
        <!-- <div class="filters">
            <FilterButton icon="calendar_today" label="Date" />
            <FilterButton icon="label" label="Tags" />
            <div class="divider" />
            <SortButton />
        </div> -->
    </div>
    <TaskList tasks={filteredTasks} onEdit={handleEdit} onDelete={handleDelete} />
    <!-- <Pagination /> -->

    <EditTaskModal
        bind:open={isModalOpen}
        task={editingTask}
        onSave={handleSave}
    />
    <ConfirmationModal
        bind:open={isDeleteModalOpen}
        title="Delete"
        message="Are you sure you want to delete?"
        confirmButtonColor="#ef4444"
        onConfirm={confirmDelete}
    />
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
