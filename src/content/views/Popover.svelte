<script lang="ts">
    import { popover } from "./popover.svelte.js";

    // element.hidePopover(), element.showPopover()
    const cancel = () => {
        // const popover = document.querySelector("#blossom-popover");
        // popover.hidePopover();
        popover.close();
    };

    const save = () => {
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
</script>

<div popover="manual" id="blossom-popover" bind:this={popoverRef}>
    <h3 id="blossom-popover-pr">Blossom</h3>
    <form id="popForm" autocomplete="off">
        <!-- Type -->
        <div>
            <label for="type">Type</label>
            <select id="type" name="type" required="">
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
                value="2"
                step="1"
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
