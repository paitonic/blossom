<script>
    import { storage } from "@/shared/storage.svelte.js";
    let files = $state(null);

    $effect(() => {
        if (!files) {
            return;
        }

        importJSON(files);
    });

    const exportJSON = async () => {
        const hasPermission = await chrome.permissions.contains({
            permissions: ["downloads"],
        });
        if (!hasPermission) {
            const granted = await chrome.permissions.request({
                permissions: ["downloads"],
            });
            if (!granted) {
                // TODO: Show a message to the user explaining why the permission is needed
                return;
            }
        }

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

<div class="settings-container">
    <h2>Settings</h2>
    <p>Settings page is under construction.</p>

    <button onclick={exportJSON}>Export</button>
    <hr />

    <input type="file" accept="application/json" bind:files />
</div>

<style>
    .settings-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }
</style>
