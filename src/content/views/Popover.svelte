<script lang="ts">
    import { popover } from "./popover.svelte.js";
    import { storage } from "@/shared/storage.svelte.js";
    import css from "@/content/views/popover.css?raw";
    import { onMount } from "svelte";
    import logo from "@public/blossom-128x128.png";

    const logoURL = chrome.runtime.getURL(logo);

    const addTagHotKeyList = ["Enter", " "];

    // inject component style into ShadowDOM
    onMount(() => {
        const style = document.createElement("style");
        style.textContent = css;
        const shadowRoot = popoverRef.parentNode;
        shadowRoot.appendChild(style);

        const stopKeyPropagation = (event) => {
            // GitHub listens for key presses
            // Without this, key presses will trigger an event in GitHub's UI, e.g `a` opens "Assignee" popup
            if (!addTagHotKeyList.includes(event.key)) {
                event.stopPropagation();
            }
        };

        popoverRef.addEventListener("keydown", stopKeyPropagation);

        return () => {
            popoverRef.removeEventListener("keydown", stopKeyPropagation);
        };
    });

    let emptyForm = {
        pullRequestID: "",
        user: "",
        repository: "",
        title: "",
        openedAt: "",
        type: "feature",
        challenge: "Med",
        size: "M",
        impact: "High",
        reaction: "😊",
        notes: "",
        // Legacy fields kept for compatibility if needed, though not shown in UI
        tags: [],
        rating: 3,
    };
    let form = $state(structuredClone(emptyForm));
    let newTag = $state("");

    let pullRequestDetails = $derived.by(() => {
        // pullRequestURL: https://github.com/{USER}/{REPOSITORY}/pull/41941
        if (!popover.params.pullRequestURL) {
            return null;
        }

        let [
            _protocol,
            _empty,
            _domain,
            user,
            repository,
            _path,
            pullRequestID,
        ] = popover.params.pullRequestURL.split("/");
        const key = `${user}/${repository}/${pullRequestID}`;

        return {
            key,
            user,
            repository,
            title: popover.params.title,
            openedAt: popover.params.openedAt,
            pullRequestID,
        };
    });

    const setForm = (values) => {
        // Merge values into form, ensuring defaults for new fields if they don't exist in saved data
        Object.assign(form, structuredClone(emptyForm), values);
    };

    const cancel = () => {
        popover.close();
    };

    const save = async () => {
        await storage.kset(pullRequestDetails?.key, form);
        popover.close();
    };

    let popoverRef: HTMLElement;
    $effect(() => {
        if (popover.isShown) {
            popoverRef.showPopover();
        } else {
            popoverRef.hidePopover();
        }
    });

    $effect(() => {
        (async () => {
            if (!pullRequestDetails) {
                return;
            }
            const item = await storage.kget(pullRequestDetails.key, null);
            if (item) {
                setForm(item);
            } else {
                setForm({
                    ...emptyForm,
                    title: pullRequestDetails.title,
                    openedAt: pullRequestDetails.openedAt,
                    user: pullRequestDetails.user,
                    repository: pullRequestDetails.repository,
                    pullRequestID: pullRequestDetails.pullRequestID,
                });
            }
        })();
    });

    const addTag = (tagName) => {
        const cleanTagName = tagName.trim();
        if (cleanTagName.length > 0 && !form.tags.includes(cleanTagName)) {
            form.tags.push(cleanTagName);
            console.log($state.snapshot(form.tags));
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
            addTag(newTag);
            newTag = "";
        }
    };

    // Options for selects and buttons
    const typeOptions = [
        { value: "feature", label: "Feature Development" },
        { value: "bug", label: "Bug Fix" },
        { value: "refactor", label: "Refactor" },
        { value: "maintenance", label: "Maintenance" },
        { value: "research", label: "Research" },
    ];
    const challengeOptions = ["Low", "Med", "High"];
    const sizeOptions = ["S", "M", "L"];
    const impactOptions = ["Low", "Med", "High"];
    const reactionOptions = [
        { value: "😊", title: "Positive" },
        { value: "😐", title: "Neutral" },
        { value: "☹️", title: "Negative" },
    ];
</script>

<div popover="manual" class="modal" bind:this={popoverRef}>
    <div class="modal-header">
        <h2 class="modal-title">
            <img src={logoURL} alt="Blossom Extension Logo" /> Blossom
        </h2>
        <button aria-label="Close modal" class="close-btn" onclick={cancel}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
            >
                <path
                    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                />
            </svg>
        </button>
    </div>

    <div class="modal-body">
        <div class="form-group">
            <label for="title" class="form-label">Title</label>
            <input
                id="title"
                class="form-control"
                placeholder="e.g. Optimize database queries"
                type="text"
                bind:value={form.title}
            />
        </div>

        <div class="form-group">
            <label for="type" class="form-label">Type</label>
            <div class="select-wrapper">
                <select
                    id="type"
                    class="form-control form-select"
                    bind:value={form.type}
                >
                    {#each typeOptions as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
                <div class="select-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 96 960 960"
                        width="20"
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
            <div class="tags-input-container">
                {#each form.tags as tag, index}
                    <span class="tag-pill">
                        {tag}
                        <button
                            aria-label="Remove tag"
                            class="tag-remove"
                            onclick={() => removeTag(index)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                            </svg>
                        </button>
                    </span>
                {/each}
                <input
                    id="tags"
                    class="tag-input-field"
                    placeholder={form.tags.length == 0 ? "e.g cache" : ""}
                    type="text"
                    onkeydown={handleTagInput}
                    bind:value={newTag}
                />
            </div>
        </div>

        <div class="form-group">
            <span class="form-label">Challenge</span>
            <div class="btn-group">
                {#each challengeOptions as opt}
                    <button
                        class="btn-group-btn {form.challenge === opt ? 'active' : ''}"
                        onclick={() => form.challenge = opt}
                    >{opt}</button>
                {/each}
            </div>
        </div>

        <div class="form-group">
            <span class="form-label">Size</span>
            <div class="btn-group">
                {#each sizeOptions as opt}
                    <button
                        class="btn-group-btn {form.size === opt
                            ? 'active'
                            : ''}"
                        onclick={() => (form.size = opt)}>{opt}</button
                    >
                {/each}
            </div>
        </div>

        <div class="form-group">
            <span class="form-label">Impact</span>
            <div class="btn-group">
                {#each impactOptions as opt}
                    <button
                        class="btn-group-btn {form.impact === opt
                            ? 'active'
                            : ''}"
                        onclick={() => (form.impact = opt)}>{opt}</button
                    >
                {/each}
            </div>
        </div>

        <div class="form-group">
            <span class="form-label">Reaction</span>
            <div class="emoji-group">
                {#each reactionOptions as opt}
                    <button
                        class="emoji-btn {form.reaction === opt.value
                            ? 'active'
                            : ''}"
                        title={opt.title}
                        onclick={() => (form.reaction = opt.value)}
                        >{opt.value}</button
                    >
                {/each}
            </div>
        </div>

        <div class="form-group">
            <label for="notes" class="form-label">Notes</label>
            <textarea
                id="notes"
                class="form-control form-textarea"
                placeholder="Add additional context or documentation links..."
                rows="4"
                bind:value={form.notes}
            ></textarea>
        </div>
    </div>

    <div class="modal-footer">
        <button class="btn btn-secondary" onclick={cancel}>Cancel</button>
        <button class="btn btn-primary" onclick={save}>Save</button>
    </div>
</div>
