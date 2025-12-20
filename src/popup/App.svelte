<script lang="ts">
    import { storage } from "@/shared/storage.js";

    let files = $state(null);

    $effect(() => {
        if (!files) {
            return;
        }

        importJSON(files);
    });

    const exportJSON = async () => {
        const items = await storage.kall();
        if (!items) {
            console.log("no items");
        }

        const fileContent = {
            version: 1,
            createdAt: new Date(),
            data: items,
        };

        const blob = new Blob([JSON.stringify(fileContent, null, 2)], {
            type: "application/json",
        });

        chrome.downloads.download({
            url: URL.createObjectURL(blob),
            filename: "blossom-extension.json",
            saveAs: true,
        });
    };

    const importJSON = async (files) => {
        const file = files[0];
        // TODO: check file.size // in bytes
        const fileContent = JSON.parse(await file.text());

        // TODO: this will overwrite any existing keys (this is force merge)
        await storage.kset(fileContent.data);
    };
</script>

<button onclick={exportJSON}>Export</button>
<hr />

<input type="file" accept="application/json" bind:files />

<style>
</style>
