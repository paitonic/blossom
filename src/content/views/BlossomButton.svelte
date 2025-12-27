<script>
    import { popover } from "./popover.svelte.js";
    import logo from "@/assets/blossom-128x128.png";

    const logoURL = chrome.runtime.getURL(logo);
    const props = $props();

    const openPopover = () => {
        popover.open(props);
    };
</script>

<img src={logoURL} alt="Blossom Extension Logo" />
<button onclick={openPopover}>Blossom</button>

<style>
    button {
        color: #59636e;
        border: none;
        background-color: transparent;
        padding: 0 0 0 0.25rem;
    }

    button:hover {
        color: #0969da;
    }

    img {
        width: 16px;
        height: 16px;
    }
</style>
