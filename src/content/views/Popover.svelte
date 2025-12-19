<script lang="ts">
    import { popover } from "./popover.svelte.js";
    import { storage } from "./storage.svelte.js";

    let emptyForm = {
        category: "",
        impact: 0,
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

<div popover="manual" id="blossom-popover" bind:this={popoverRef}>
    <h3 id="blossom-popover-pr">Blossom</h3>
    <form id="popForm" autocomplete="off">
        <!-- Type -->
        <div>
            <label for="category">Category</label>
            <select
                id="category"
                name="type"
                required=""
                bind:value={form.category}
            >
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
                <option value="chore">Chore</option>
            </select>
        </div>

        <!-- Impact -->
        <div class="impact-container">
            <label for="impact">Impact</label>
            <input
                type="range"
                id="impact"
                name="impact"
                min="1"
                max="3"
                step="1"
                bind:value={form.impact}
            />
        </div>

        <!-- Tags -->
        <div>
            <label for="tags"
                >Tags
                <div class="row">
                    <input
                        id="tags"
                        type="text"
                        placeholder="add a tag"
                        aria-describedby="tagsHint"
                        bind:value={form.tags}
                    />
                </div>
                <div class="tags" id="tags-container" aria-live="polite"></div>
            </label>
        </div>

        <!-- Notes -->
        <div>
            <label for="notes">Notes</label>
            <textarea
                id="notes"
                name="notes"
                placeholder="Short note..."
                maxlength="500"
                bind:value={form.notes}
            ></textarea>
        </div>

        <!-- buttons -->
        <div class="">
            <button type="button" class="" id="cancel" onclick={cancel}>
                Cancel
            </button>
            <button type="button" class="" id="save" onclick={save}>
                Save
            </button>
        </div>
    </form>
</div>
