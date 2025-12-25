<script lang="ts">
    import { popover } from "./popover.svelte.js";
    import { storage } from "@/shared/storage.js";
    import IconClose from "./IconClose.svelte";

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

    let popoverRef: HTMLDialogElement;
    $effect(() => {
        if (popover.isShown) {
            popoverRef.showModal();
        } else {
            popoverRef.close();
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

<dialog class="modal" bind:this={popoverRef}>
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
            <label for="created" class="form-label">Created</label>
            <div style="position: relative">
                <input
                    id="created"
                    class="form-input"
                    type="date"
                    value="2025-12-05"
                />
            </div>
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
</dialog>

<style>
    :root {
        --color-white: #ffffff;
        --color-gray-50: #f9fafb;
        --color-gray-100: #f3f4f6;
        --color-gray-200: #e5e7eb;
        --color-gray-300: #d1d5db;
        --color-gray-400: #9ca3af;
        --color-gray-500: #6b7280;
        --color-gray-600: #4b5563;
        --color-gray-700: #374151;
        --color-gray-800: #1f2937;
        --color-gray-900: #111827;
        --color-black: #000000;
        --spacing-unit: 4px;
        --radius-sm: 4px;
        --radius-md: 6px;
        --radius-lg: 8px;
        --radius-xl: 12px;
        --font-family: "Inter", sans-serif;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --shadow-xl:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .modal {
        background-color: var(--color-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        border: 1px solid var(--color-gray-200);
        width: 100%;
        max-width: 500px;

        flex-direction: column;
        max-height: 90vh;
    }

    .modal[open] {
        display: flex;
    }

    .modal-header {
        padding: 14px 32px;
        border-bottom: 1px solid var(--color-gray-100);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--color-white);
        border-top-left-radius: var(--radius-xl);
        border-top-right-radius: var(--radius-xl);
    }
    .modal-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-gray-900);
        letter-spacing: -0.025em;
    }
    .close-btn {
        background: none;
        border: none;
        color: var(--color-gray-400);
        cursor: pointer;
        border-radius: var(--radius-md);
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            color 0.2s,
            background-color 0.2s;
    }
    .close-btn:hover {
        color: var(--color-gray-900);
        background-color: var(--color-gray-100);
    }
    .modal-body {
        padding: 24px 32px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
    .modal-body::-webkit-scrollbar {
        width: 6px;
    }
    .modal-body::-webkit-scrollbar-track {
        background: transparent;
    }
    .modal-body::-webkit-scrollbar-thumb {
        background-color: var(--color-gray-200);
        border-radius: 20px;
    }
    .modal-body::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-gray-300);
    }
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin: 8px 0;
    }
    .form-label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-gray-500);
    }
    .form-input,
    .form-textarea {
        width: 100%;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-gray-300);
        background-color: var(--color-white);
        color: var(--color-gray-900);
        padding: 10px 14px;
        font-size: 0.875rem;
        transition: all 0.2s;
        box-shadow: var(--shadow-sm);
        font-family: inherit;
    }
    .form-input:focus,
    .form-textarea:focus,
    .tags-input-container:focus-within {
        outline: none;
        border-color: var(--color-gray-900);
        box-shadow: 0 0 0 1px var(--color-gray-900);
    }
    .form-input::placeholder,
    .form-textarea::placeholder,
    .tag-input-field::placeholder {
        color: var(--color-gray-400);
    }
    .form-textarea {
        min-height: 80px;
        resize: none;
        line-height: 1.6;
    }
    .tags-input-container {
        width: 100%;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-gray-300);
        background-color: var(--color-white);
        padding: 8px;
        min-height: 54px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        transition: all 0.2s;
        box-shadow: var(--shadow-sm);
    }
    .tag-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        background-color: var(--color-gray-100);
        border: 1px solid var(--color-gray-200);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-gray-900);
    }
    .tag-remove {
        background: none;
        border: none;
        color: var(--color-gray-400);
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0;
        transition: color 0.2s;
    }
    .tag-remove:hover {
        color: var(--color-gray-900);
    }
    .tag-input-field {
        background: transparent;
        border: none;
        padding: 4px;
        font-size: 0.875rem;
        color: var(--color-gray-900);
        min-width: 80px;
        flex: 1;
        outline: none;
    }
    .suggestions-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    .suggestion-chip {
        padding: 6px 12px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-gray-200);
        background-color: var(--color-white);
        color: var(--color-gray-500);
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    .suggestion-chip:hover {
        border-color: var(--color-gray-400);
        color: var(--color-gray-900);
    }
    .modal-footer {
        padding: 10px 32px;
        border-top: 1px solid var(--color-gray-100);
        background-color: var(--color-white);
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        border-bottom-left-radius: var(--radius-xl);
        border-bottom-right-radius: var(--radius-xl);
    }
    .btn {
        padding: 10px 20px;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    .btn-secondary {
        background-color: var(--color-white);
        border: 1px solid var(--color-gray-300);
        color: var(--color-gray-700);
        box-shadow: var(--shadow-sm);
    }
    .btn-secondary:hover {
        background-color: var(--color-gray-50);
        color: var(--color-gray-900);
    }
    .btn-primary {
        background-color: var(--color-gray-900);
        border: 1px solid var(--color-gray-900);
        color: var(--color-white);
        box-shadow: var(--shadow-md);
    }
    .btn-primary:hover {
        background-color: var(--color-black);
        border-color: var(--color-black);
    }
</style>
