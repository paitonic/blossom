<script>
    import { popover } from "./popover.svelte.js";
</script>

<button onclick={popover.open}> 🌼 Rate</button>

<style>
    button {
        color: #59636e;
        border: 1px solid transparent;
        background-color: transparent;
        padding: 0 0 0 0.25rem;
    }

    button:hover {
        color: #0969da;
    }
</style>
