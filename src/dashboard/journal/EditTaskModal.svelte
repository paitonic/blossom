<script lang="ts">
    import TaskForm from "@/components/TaskForm.svelte";
    import logo from "@public/blossom-128x128.png";
    import IconClose from "@/shared/icons/IconClose.svelte";

    let { task = null, open = $bindable(false), onSave } = $props();

    let dialogRef;
    let form = $state(null);

    $effect(() => {
        if (open && task) {
            form = structuredClone($state.snapshot(task));
            dialogRef?.showModal();
        } else if (!open) {
            dialogRef?.close();
        }
    });

    const close = () => {
        open = false;
        form = null;
    };

    const save = () => {
        if (onSave && form) {
            onSave(form);
        }
        close();
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
    class="task-dialog"
    onclose={close}
    onkeydown={handleKeydown}
>
    <div class="modal-content">
        <div class="modal-header">
            <h2 class="modal-title">
                <img src={logo} alt="Blossom Extension Logo" /> Blossom
            </h2>
            <button aria-label="Close modal" class="close-btn" onclick={close}>
                <IconClose size="18px" />
            </button>
        </div>

        <div class="modal-body">
            {#if form}
                <TaskForm bind:form />
            {/if}
        </div>

        <div class="modal-footer">
            <button class="btn btn-cancel" onclick={close}>Cancel</button>
            <button class="btn btn-save" onclick={save}>Save</button>
        </div>
    </div>
</dialog>

<style>
    dialog.task-dialog {
        padding: 0;
        border: 1px solid var(--gray-200);
        background: transparent;
        max-width: 420px;
        width: 100%;
        max-height: 90vh;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-2xl);
        color: var(--gray-900);
        font-family: var(--font-family);
        
        /* Native dialog centering */
        margin: auto;
        inset: 0;
        position: fixed;
    }

    dialog.task-dialog[open] {
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
</style>