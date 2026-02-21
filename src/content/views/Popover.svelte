<script lang="ts">
    import { popover } from "./popover.svelte.js";
    import { storage } from "@/shared/storage.svelte.js";
    import css from "@/content/views/popover.css?raw";
    import formCss from "@/shared/styles/form.css?raw";
    import modalLayoutCss from "@/shared/styles/modal-layout.css?raw";
    import variablesCss from "@/shared/styles/variables.css?raw";
    import { onMount } from "svelte";
    import logo from "@public/blossom-128x128.png";
    import TaskForm from "@/components/TaskForm.svelte";

    const logoURL = chrome.runtime.getURL(logo);

    // inject component style into ShadowDOM
    onMount(() => {
        const style = document.createElement("style");
        style.textContent = variablesCss + "\n" + css + "\n" + formCss + "\n" + modalLayoutCss;
        const shadowRoot = popoverRef.parentNode;
        shadowRoot.appendChild(style);

        const stopKeyPropagation = (event) => {
            const addTagHotKeyList = ["Enter", " "];
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
        ticket: "",
        openedAt: "",
        type: "chore",
        challenge: "medium",
        effort: "m",
        impact: "low",
        sentiment: 0,
        notes: "",
        tags: [],
    };
    let form = $state(structuredClone(emptyForm));

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
        if (popover.onSave) {
            popover.onSave();
        }
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
        <TaskForm bind:form />
    </div>

    <div class="modal-footer">
        <button class="btn btn-cancel" onclick={cancel}>Cancel</button>
        <button class="btn btn-save" onclick={save}>Save</button>
    </div>
</div>
