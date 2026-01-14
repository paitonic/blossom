<script lang="ts">
    import { popover } from "./popover.svelte.js";
    import { storage } from "@/shared/storage.svelte.js";
    import css from "@/content/views/popover.css?raw";
    import { onMount } from "svelte";
    import logo from "@public/blossom-128x128.png";
    import IconSentimentSatisfied from "./IconSentimentSatisfied.svelte";
    import IconSentimentNeutral from "./IconSentimentNeutral.svelte";
    import IconSentimentDissatisfied from "./IconSentimentDissatisfied.svelte";

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
        type: "chore",
        challenge: "low",
        size: "small",
        impact: "low",
        reaction: "neutral",
        notes: "",
        tags: [],
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
        { value: "chore", label: "Chore" },
        { value: "feature", label: "Feature" },
        { value: "bug", label: "Bug" },
        { value: "hotfix", label: "Hotfix" },
    ];
    const challengeOptions = [
        { value: "low", label: "low", title: "Low" },
        { value: "medium", label: "med", title: "Medium" },
        { value: "high", label: "high", title: "High" },
    ];
    const sizeOptions = [
        { value: "small", label: "s", title: "Small" },
        { value: "medium", label: "m", title: "Medium" },
        { value: "large", label: "l", title: "Large" },
    ];
    const impactOptions = [
        { value: "low", label: "low", title: "Low" },
        { value: "medium", label: "med", title: "Medium" },
        { value: "high", label: "high", title: "High" },
    ];
    const reactionOptions = [
        {
            value: "negative",
            icon: IconSentimentDissatisfied,
            title: "Negative",
        },
        { value: "neutral", icon: IconSentimentNeutral, title: "Neutral" },
        { value: "positive", icon: IconSentimentSatisfied, title: "Positive" },
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
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
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
                class="uniform-input"
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
                <span class="choice-label">Size</span>
                <div class="btn-group">
                    {#each sizeOptions as opt}
                        <button
                            class="btn-choice {form.size === opt.value
                                ? 'active'
                                : ''}"
                            title={opt.title}
                            onclick={() => (form.size = opt.value)}
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
                <span class="choice-label">Reaction</span>
                <div class="emoji-group">
                    {#each reactionOptions as opt}
                        <button
                            class="emoji-btn {form.reaction === opt.value
                                ? 'active ' + opt.value
                                : ''}"
                            title={opt.title}
                            onclick={() => (form.reaction = opt.value)}
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
    </div>

    <div class="modal-footer">
        <button class="btn btn-cancel" onclick={cancel}>Cancel</button>
        <button class="btn btn-save" onclick={save}>Save</button>
    </div>
</div>
