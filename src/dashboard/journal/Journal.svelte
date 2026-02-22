<script lang="ts">
    import TaskList from "./TaskList.svelte";
    import Pagination from "./Pagination.svelte";
    import SearchBar from "./SearchBar.svelte";
    import FilterDropdown from "./FilterDropdown.svelte";
    import SortButton from "./SortButton.svelte";
    import EditTaskModal from "./EditTaskModal.svelte";
    import ConfirmationModal from "@/dashboard/components/ConfirmationModal.svelte";
    import { storage } from "@/shared/storage.svelte";
    import { MAX_TASKS_PER_PAGE } from "@/shared/constants";

    let { tasks, refresh } = $props();

    let searchQuery = $state("");

    let sortOrder = $state("newest");

    const toggleSort = () => {
        sortOrder = sortOrder === "newest" ? "oldest" : "newest";
    };

    let selectedTypes = $state([]);
    let selectedChallenges = $state([]);
    let selectedEfforts = $state([]);
    let selectedImpacts = $state([]);
    let selectedSentiments = $state([]);
    let selectedTags = $state([]);

    let currentPage = $state(1);

    // Reset to first page when any filter changes
    $effect(() => {
        // We use these values to trigger the effect
        searchQuery;
        selectedTypes;
        selectedChallenges;
        selectedEfforts;
        selectedImpacts;
        selectedSentiments;
        selectedTags;
        sortOrder;
        currentPage = 1;
    });

    const typeOptions = [
        { value: "chore", label: "Chore" },
        { value: "feature", label: "Feature" },
        { value: "bug", label: "Bug" },
        { value: "research", label: "Research" }
    ];
    const challengeOptions = [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
    ];
    const effortOptions = [
        { value: "xs", label: "XS" },
        { value: "s", label: "S" },
        { value: "m", label: "M" },
        { value: "l", label: "L" },
        { value: "xl", label: "XL" },
    ];
    const impactOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];
    const sentimentOptions = [
        { value: -1, label: "Negative" },
        { value: 0, label: "Neutral" },
        { value: 1, label: "Positive" },
    ];

    let tagOptions = $derived(
        Array.from(new Set(tasks.flatMap((t) => t.tags || [])))
            .sort()
            .map((tag) => ({ value: tag, label: tag })),
    );

    let filteredTasks = $derived(
        tasks.filter((task) => {
            const query = searchQuery.toLowerCase();
            const title = task.title ? task.title.toLowerCase() : "";
            const notes = task.notes ? task.notes.toLowerCase() : "";
            const matchesSearch = title.includes(query) || notes.includes(query);

            const matchesType =
                selectedTypes.length === 0 || selectedTypes.includes(task.type);
            const matchesChallenge =
                selectedChallenges.length === 0 ||
                selectedChallenges.includes(task.challenge);
            const matchesEffort =
                selectedEfforts.length === 0 ||
                selectedEfforts.includes(task.effort);
            const matchesImpact =
                selectedImpacts.length === 0 ||
                selectedImpacts.includes(task.impact);
            const matchesSentiment =
                selectedSentiments.length === 0 ||
                selectedSentiments.includes(task.sentiment);
            const matchesTags =
                selectedTags.length === 0 ||
                (task.tags &&
                    task.tags.some((tag) => selectedTags.includes(tag)));

            return (
                matchesSearch &&
                matchesType &&
                matchesChallenge &&
                matchesEffort &&
                matchesImpact &&
                matchesSentiment &&
                matchesTags
            );
        }),
    );

    let sortedTasks = $derived.by(() => {
        return filteredTasks.toSorted((a, b) => {
            const dateA = a.openedAt;
            const dateB = b.openedAt;

            if (sortOrder === "newest") {
                if (dateA < dateB) return 1;
                if (dateA > dateB) return -1;
                return 0;
            } else {
                if (dateA < dateB) return -1;
                if (dateA > dateB) return 1;
                return 0;
            }
        });
    });

    let paginatedTasks = $derived(
        sortedTasks.slice(
            (currentPage - 1) * MAX_TASKS_PER_PAGE,
            currentPage * MAX_TASKS_PER_PAGE,
        ),
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
        <div class="search-sort-row">
            <SearchBar bind:value={searchQuery} />
            <SortButton {sortOrder} onToggle={toggleSort} />
        </div>
        <div class="filters">
            <FilterDropdown
                icon="category"
                label="Type"
                options={typeOptions}
                bind:selected={selectedTypes}
            />
            <FilterDropdown
                icon="landscape"
                label="Challenge"
                options={challengeOptions}
                bind:selected={selectedChallenges}
            />
            <FilterDropdown
                icon="schedule"
                label="Effort"
                options={effortOptions}
                bind:selected={selectedEfforts}
            />
            <FilterDropdown
                icon="trending_up"
                label="Impact"
                options={impactOptions}
                bind:selected={selectedImpacts}
            />
            <FilterDropdown
                icon="mood"
                label="Sentiment"
                options={sentimentOptions}
                bind:selected={selectedSentiments}
            />
            <FilterDropdown
                icon="label"
                label="Tags"
                options={tagOptions}
                bind:selected={selectedTags}
                searchable={true}
                maxHeight="250px"
            />
        </div>
    </div>
    <TaskList tasks={paginatedTasks} {sortOrder} onEdit={handleEdit} onDelete={handleDelete} />
    {#if filteredTasks.length > MAX_TASKS_PER_PAGE}
        <Pagination
            totalItems={filteredTasks.length}
            pageSize={MAX_TASKS_PER_PAGE}
            bind:currentPage={currentPage}
        />
    {/if}

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
    .search-sort-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        width: 100%;
    }
    .filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        width: 100%;
    }
</style>
