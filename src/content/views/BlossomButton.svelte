<script>
    import { popover } from "./popover.svelte.js";
    import logo from "@public/blossom-128x128.png";

    const logoURL = chrome.runtime.getURL(logo);
    const props = $props();

    const openPopover = () => {
        popover.open(props);
    };
</script>

<button
    title="Open Blossom extension"
    onclick={openPopover}
    style:background-image={`url(${logoURL})`}
></button>

<style>
    button {
        border: none;
        background-color: transparent;
        background-size: contain;
        padding: 0;
        height: 16px;
        width: 16px;
    }

    button:hover {
        color: #0969da;
    }
</style>
