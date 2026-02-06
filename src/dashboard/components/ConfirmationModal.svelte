<script lang="ts">
    import IconClose from "@/shared/icons/IconClose.svelte";

    let {
        open = $bindable(false),
        title = "Confirm Action",
        message = "Are you sure you want to proceed?",
        confirmButtonColor = "black",
        onConfirm,
        onCancel,
    } = $props();

    let dialogRef;

    $effect(() => {
        if (open) {
            dialogRef?.showModal();
        } else {
            dialogRef?.close();
        }
    });

    const close = () => {
        open = false;
        if (onCancel) onCancel();
    };

    const confirm = () => {
        open = false;
        if (onConfirm) onConfirm();
    };

    const handleKeydown = (e) => {
        if (e.key === "Escape") {
            close();
        }
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialogRef}
    class="confirmation-dialog"
    onclose={close}
    onkeydown={handleKeydown}
>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
            <h2 class="modal-title">{title}</h2>
            <button aria-label="Close modal" class="close-btn" onclick={close}>
                <IconClose size="18px" />
            </button>
        </div>

        <div class="modal-body">
            <p class="message">{message}</p>
        </div>

        <div class="modal-footer">
            <button class="btn btn-cancel" onclick={close}>Cancel</button>
            <button 
                class="btn btn-confirm" 
                style="background-color: {confirmButtonColor};"
                onclick={confirm}
            >
                Confirm
            </button>
        </div>
    </div>
</dialog>

<style>
    dialog.confirmation-dialog {
        padding: 0;
        border: 1px solid var(--gray-200);
        background: transparent;
        max-width: 400px;
        width: 100%;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-2xl);
        color: var(--gray-900);
        font-family: var(--font-family);

        /* Native dialog centering */
        margin: auto;
        inset: 0;
        position: fixed;
    }

    dialog.confirmation-dialog[open] {
        display: flex;
        flex-direction: column;
    }

    dialog::backdrop {
        background: transparent;
    }

    .modal-content {
        background: var(--white);
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        overflow: hidden;
    }

    .modal-header {
        padding: 0.75rem 1.5rem;
        border-bottom: 1px solid var(--gray-100);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .modal-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--gray-900);
        letter-spacing: -0.025em;
    }

    .close-btn {
        padding: 0.25rem;
        color: var(--gray-400);
        background: transparent;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            color 0.2s,
            background-color 0.2s;
    }

    .close-btn:hover {
        color: var(--gray-900);
        background-color: var(--gray-100);
    }

    .modal-body {
        padding: 1.5rem;
        color: var(--gray-700);
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .modal-footer {
        padding: 0.75rem 1.5rem;
        border-top: 1px solid var(--gray-100);
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        background-color: var(--white);
    }

    .btn {
        padding: 0.375rem 1rem;
        border-radius: var(--radius-md);
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-cancel {
        border: 1px solid var(--gray-300);
        background: var(--white);
        color: var(--gray-700);
    }

    .btn-cancel:hover {
        background-color: var(--gray-50);
        color: var(--gray-900);
    }

    .btn-confirm {
        color: var(--white);
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        border: none;
    }

    .btn-confirm:hover {
        opacity: 0.9;
    }
</style>
