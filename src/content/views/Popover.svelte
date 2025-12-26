<script lang="ts">
    import { popover } from "./popover.svelte.js";
    import { storage } from "@/shared/storage.js";
    import css from "@/content/views/popover.css?raw";
    import IconClose from "./IconClose.svelte";
    import { onMount } from "svelte";

    // inject component style into ShadowDOM
    onMount(() => {
        const style = document.createElement("style");
        style.textContent = css;
        const shadowRoot = popoverRef.parentNode;
        shadowRoot.appendChild(style);
    });

    let x = document.querySelector("body");
    console.log("x: ", x);

    let emptyForm = {
        title: "",
        created: 0,
        tags: "",
        notes: "",
    };

    let form = $state(structuredClone(emptyForm));
    let pullRequest = $derived.by(() => {
        // pullRequestURL: https://github.com/{USER}/{REPO}/pull/41941
        if (!popover.params.pullRequestURL) {
            return null;
        }

        let [_protocol, _empty, _domain, user, repo, _path, pullRequestID] =
            popover.params.pullRequestURL.split("/");
        const key = `${user}/${repo}/${pullRequestID}`;

        return {
            key,
            user,
            repo,
            pullRequestID,
        };
    });

    const updateForm = (values) => {
        Object.assign(form, values);
    };

    const resetForm = () => {
        Object.assign(form, structuredClone(emptyForm));
    };

    const cancel = () => {
        popover.close();
    };

    const save = async () => {
        await storage.kset(pullRequest?.key, form);
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
            if (!pullRequest) {
                return;
            }
            const item = await storage.kget(pullRequest.key, null);
            if (item) {
                updateForm(item);
            } else {
                resetForm();
            }
        })();
    });
</script>

<div popover="manual" class="modal" bind:this={popoverRef}>
    <div class="modal-header">
        <h2 class="modal-title">🌼 Blossom</h2>
        <button aria-label="Close modal" class="close-btn" onclick={cancel}>
            <!-- <span class="material-symbols-outlined">close</span> -->
            <IconClose />
        </button>
    </div>
    <div class="modal-body">
        <div class="form-group">
            <label for="title" class="form-label">Title</label>
            <input
                id="title"
                class="form-input"
                placeholder="e.g. Fix navigation bug"
                type="text"
                value=""
            />
        </div>
        <div class="form-group">
            <label for="tags" class="form-label">Tags</label>
            <div class="tags-input-container">
                <span class="tag-pill">
                    users
                    <button aria-label="Remove tag" class="tag-remove">
                        <!-- <span class="material-symbols-outlined">close</span> -->
                        <IconClose size="16px" />
                    </button>
                </span>
                <span class="tag-pill">
                    important
                    <button aria-label="Remove tag" class="tag-remove">
                        <!-- <span class="material-symbols-outlined">close</span> -->
                        <IconClose size="16px" />
                    </button>
                </span>
                <input
                    id="tags"
                    class="tag-input-field"
                    placeholder="Type tag..."
                    type="text"
                />
            </div>
        </div>
        <div class="form-group">
            <label for="quick-tag" class="form-label">Quick Add</label>
            <div class="suggestions-container">
                <button id="quick-tag" class="suggestion-chip">bug</button>
                <button class="suggestion-chip">feature</button>
                <button class="suggestion-chip">chore</button>
                <button class="suggestion-chip">refactor</button>
            </div>
        </div>
        <div class="form-group">
            <label for="notes" class="form-label">Notes</label>
            <textarea
                id="notes"
                class="form-textarea"
                placeholder="Add any relevant details..."
            ></textarea>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-secondary" onclick={cancel}>Cancel</button>
        <button class="btn btn-primary" onclick={save}>Save</button>
    </div>
</div>
