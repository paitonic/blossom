<script>
    import { popover } from "./popover.svelte.js";
    import logo from "@public/blossom-128x128.png";
    import { storage } from "@/shared/storage.svelte.js";

    const logoURL = chrome.runtime.getURL(logo);
    const props = $props();

    let isRated = $state(props.rated || false);

    $effect(() => {
        if (props.rated !== undefined) {
            return;
        }

        let [
            _protocol,
            _empty,
            _domain,
            user,
            repository,
            _path,
            pullRequestID,
        ] = props.pullRequestURL.split("/");
        const key = `${user}/${repository}/${pullRequestID}`;

        storage.kget(key).then((data) => {
            if (data) {
                isRated = true;
            }
        });
    });

    const openPopover = () => {
        popover.open(props, () => {
            isRated = true;
        });
    };
</script>

<button
    title="Open Blossom extension"
    onclick={openPopover}
    style:background-image={`url(${logoURL})`}
    class:rated={isRated}
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

    .rated {
        filter: hue-rotate(120deg) saturate(1.5);
    }
</style>
