<script lang="ts">
    import { popover } from "./popover.svelte.js";
    import { storage } from "@/shared/storage.svelte.js";
    import css from "@/content/views/popover.css?raw";
    import IconClose from "@/content/views/IconClose.svelte";
    import { onMount } from "svelte";
    import logo from "@public/blossom-128x128.png";
    import Rating from "./Rating.svelte";

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

    const quickTags = ["chore", "bug", "feature", "hotfix"];
    let emptyForm = {
        title: "",
        openedAt: "",
        tags: [],
        score: 3,
        notes: "",
    };

    let form = $state(structuredClone(emptyForm));
    let newTag = $state("");

    let pullRequestDetails = $derived.by(() => {
        // pullRequestURL: https://github.com/{USER}/{REPO}/pull/41941
        if (!popover.params.pullRequestURL) {
            return null;
        }

        let [_protocol, _empty, _domain, user, repo, _path, pullRequestID] =
            popover.params.pullRequestURL.split("/");
        const key = `${user}/${repo}/${pullRequestID}`;

        console.log("openedAt: ", popover.params.openedAt);
        return {
            key,
            user,
            repo,
            title: popover.params.title,
            openedAt: popover.params.openedAt,
            pullRequestID,
        };
    });

    const setForm = (values) => {
        Object.assign(form, values);
    };

    const resetForm = () => {
        Object.assign(form, structuredClone(emptyForm));
    };

    const cancel = () => {
        popover.close();
    };

    const save = async () => {
        await storage.kset(pullRequestDetails?.key, form);
        popover.close();
    };

    const onRate = (score) => {
        form.score = score;
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
</script>

<div popover="manual" class="modal" bind:this={popoverRef}>
    <div class="modal-header">
        <h2 class="modal-title">
            <img src={logoURL} alt="Blossom Extension Logo" /> Blossom
        </h2>
        <button aria-label="Close modal" class="close-btn" onclick={cancel}>
            <IconClose />
        </button>
    </div>
    <div class="modal-body">
        <div class="form-group">
            <label for="title" class="form-label">Title</label>
            <input
                id="title"
                class="form-input"
                placeholder="e.g. Fix cache invalidation bug"
                type="text"
                bind:value={form.title}
            />
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
                            <!-- <span class="material-symbols-outlined">close</span> -->
                            <IconClose size="16px" />
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
            <span class="form-label">Quick Add</span>
            <div class="suggestions-container">
                {#each quickTags as quickTag, index}
                    <button
                        id={`quick-tag-${index}`}
                        class="suggestion-chip"
                        onclick={() => addTag(quickTag)}>{quickTag}</button
                    >
                {/each}
            </div>
        </div>
        <div class="form-group">
            <label for="form-rating" class="form-label">Rating</label>
            <div id="form-rating" class="form-rating">
                <Rating score={form.score} {onRate} />
            </div>
        </div>
        <div class="form-group">
            <label for="notes" class="form-label">Notes</label>
            <textarea
                id="notes"
                class="form-textarea"
                placeholder="Add any relevant details..."
                bind:value={form.notes}
            ></textarea>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-secondary" onclick={cancel}>Cancel</button>
        <button class="btn btn-primary" onclick={save}>Save</button>
    </div>
</div>
