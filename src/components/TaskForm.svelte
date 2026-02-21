<script lang="ts">
    import IconSentimentSatisfied from "@/shared/icons/IconSentimentSatisfied.svelte";
    import IconSentimentNeutral from "@/shared/icons/IconSentimentNeutral.svelte";
    import IconSentimentDissatisfied from "@/shared/icons/IconSentimentDissatisfied.svelte";

    let { form = $bindable() } = $props();

    let newTag = $state("");
    const addTagHotKeyList = ["Enter", " ", ","];

    const addTag = (tagName) => {
        const cleanTagName = tagName.trim();
        if (cleanTagName.length > 0 && !form.tags.includes(cleanTagName)) {
            form.tags.push(cleanTagName);
        }
    };

    const removeTag = (index) => {
        form.tags.splice(index, 1);
    };

    const handleTagInput = (event) => {
        if (event.repeat) {
            return;
        }

        if (addTagHotKeyList.includes(event.key)) {
            event.preventDefault(); // Prevent default behavior (like space scrolling)
            addTag(newTag);
            newTag = "";
        }
    };

    // Options for selects and buttons
    const typeOptions = [
        { value: "chore", label: "Chore" },
        { value: "feature", label: "Feature" },
        { value: "bug", label: "Bug" },
        { value: "research", label: "Research" },
    ];
    const challengeOptions = [
        { value: "easy", label: "easy", title: "Easy" },
        { value: "medium", label: "medium", title: "Medium" },
        { value: "hard", label: "hard", title: "Hard" },
    ];
    const effortOptions = [
        { value: "xs", label: "xs", title: "Extra Small" },
        { value: "s", label: "s", title: "Small" },
        { value: "m", label: "m", title: "Medium" },
        { value: "l", label: "l", title: "Large" },
        { value: "xl", label: "xl", title: "Extra Large" },
    ];
    const impactOptions = [
        { value: "low", label: "low", title: "Low" },
        { value: "medium", label: "medium", title: "Medium" },
        { value: "high", label: "high", title: "High" },
    ];
    const sentimentOptions = [
        { value: -1, icon: IconSentimentDissatisfied, title: "Negative" },
        { value: 0, icon: IconSentimentNeutral, title: "Neutral" },
        { value: 1, icon: IconSentimentSatisfied, title: "Positive" },
    ];
</script>

<div class="form-group">
    <label for="title" class="form-label">Title</label>
    <input
        id="title"
        class="uniform-input"
        placeholder="e.g. Optimize database queries"
        type="text"
        bind:value={form.title}
    />
</div>

<div class="form-group">
    <label for="ticket" class="form-label">Ticket</label>
    <input
        id="ticket"
        class="uniform-input"
        placeholder="e.g. JIRA-123 or https://jira.com/browse/JIRA-123"
        type="text"
        bind:value={form.ticket}
    />
</div>

<div class="form-group">
    <label for="type" class="form-label">Type</label>
    <div class="select-wrapper">
        <select
            id="type"
            class="uniform-input form-select"
            bind:value={form.type}
        >
            {#each typeOptions as option}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
        <div class="select-icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 96 960 960"
                width="18px"
                fill="currentColor"
                ><path
                    d="M480 711 240 471l42.666-42.666L480 625.334l197.334-197.333L720 471 480 711Z"
                /></svg
            >
        </div>
    </div>
</div>

<div class="form-group">
    <label for="tags" class="form-label">Tags</label>
    <div class="tags-container">
        {#each form.tags as tag, index}
            <span class="tag-pill">
                {tag}
                <button
                    aria-label="Remove tag"
                    class="tag-remove"
                    onclick={() => removeTag(index)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="12px"
                        viewBox="0 -960 960 960"
                        width="12px"
                        fill="currentColor"
                    >
                        <path
                            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                        />
                    </svg>
                </button>
            </span>
        {/each}
        <input
            id="tags"
            class="tag-input"
            placeholder={form.tags.length == 0 ? "Add tag..." : ""}
            type="text"
            onkeydown={handleTagInput}
            bind:value={newTag}
        />
    </div>
</div>

<div class="metrics-container">
    <div class="choice-group">
        <span class="choice-label">Challenge</span>
        <div class="btn-group">
            {#each challengeOptions as opt}
                <button
                    class="btn-choice {form.challenge === opt.value
                        ? 'active'
                        : ''}"
                    title={opt.title}
                    onclick={() => (form.challenge = opt.value)}
                    >{opt.label}</button
                >
            {/each}
        </div>
    </div>

    <div class="choice-group">
        <span class="choice-label">Effort</span>
        <div class="btn-group">
            {#each effortOptions as opt}
                <button
                    class="btn-choice {form.effort === opt.value
                        ? 'active'
                        : ''}"
                    title={opt.title}
                    onclick={() => (form.effort = opt.value)}
                    >{opt.label}</button
                >
            {/each}
        </div>
    </div>

    <div class="choice-group">
        <span class="choice-label">Impact</span>
        <div class="btn-group">
            {#each impactOptions as opt}
                <button
                    class="btn-choice {form.impact === opt.value
                        ? 'active'
                        : ''}"
                    title={opt.title}
                    onclick={() => (form.impact = opt.value)}
                    >{opt.label}</button
                >
            {/each}
        </div>
    </div>

    <div class="choice-group">
        <span class="choice-label">Sentiment</span>
        <div class="emoji-group">
            {#each sentimentOptions as opt}
                <button
                    class="emoji-btn {form.sentiment === opt.value
                        ? 'active ' + opt.title.toLowerCase()
                        : ''}"
                    title={opt.title}
                    onclick={() => (form.sentiment = opt.value)}
                >
                    <opt.icon size="24px" />
                </button>
            {/each}
        </div>
    </div>
</div>

<div class="form-group">
    <label for="notes" class="form-label">Notes</label>
    <textarea
        id="notes"
        class="notes-textarea"
        placeholder="Additional details..."
        bind:value={form.notes}
    ></textarea>
</div>
