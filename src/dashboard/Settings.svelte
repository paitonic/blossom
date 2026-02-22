<script>
    import { storage } from "@/shared/storage.svelte.js";
    import { DATA_FORMAT_VERSION, migrate } from "@/shared/migrations";
    let files = $state(null);
    let importStatus = $state(null); // 'success' | 'error' | null
    let storageStats = $state({
        used: 0,
        quota: 0,
        percentage: 0,
    });

    const updateStorageStats = async () => {
        if (
            typeof chrome !== "undefined" &&
            chrome.storage &&
            chrome.storage.local
        ) {
            const used = await new Promise((resolve) => {
                chrome.storage.local.getBytesInUse(null, (bytes) => {
                    resolve(bytes);
                });
            });
            const quota = chrome.storage.local.QUOTA_BYTES || 5 * 1024 * 1024;
            storageStats = {
                used,
                quota,
                percentage: Math.min(
                    100,
                    Math.round((used / quota) * 100) || 0,
                ),
            };
        }
    };

    $effect(() => {
        updateStorageStats();

        const handleStorageChange = (changes, areaName) => {
            if (areaName === "local") {
                updateStorageStats();
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    });

    const formatMB = (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const formatUsage = (bytes) => {
        if (bytes < 1024) {
            return bytes + " B";
        }
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + " KB";
        }
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

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
                return;
            }
        }

        const items = await storage.kall();

        const fileContent = {
            createdAt: new Date(),
            data: items,
        };

        const blob = new Blob([JSON.stringify(fileContent, null, 2)], {
            type: "application/json",
        });

        const now = new Date();
        const yyyy = now.getFullYear();
        const MM = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const filename = `blossom_${yyyy}-${MM}-${dd}_${hh}-${mm}-${ss}.json`;

        const url = URL.createObjectURL(blob);
        chrome.downloads.download(
            {
                url: url,
                filename: filename,
                saveAs: true,
            },
            () => {
                // Revoke the object URL after a delay to allow the download to handle the blob
                // This prevents memory leaks while ensuring the file is accessible during the save dialog
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 60000);
            },
        );
    };

    const importJSON = async (files) => {
        try {
            const file = files[0];
            const fileContent = JSON.parse(await file.text());

            await storage.kset(fileContent.data);
            await migrate();

            importStatus = "success";
            setTimeout(() => {
                importStatus = null;
                files = null; // Reset input
            }, 3000);
        } catch (e) {
            console.error(e);
            importStatus = "error";
        }
    };
</script>

<div class="settings-container">
    <div class="settings-header">
        <h2>Data Management</h2>
        <p class="subtitle">
            Manage your personal data, export backups or import from other
            devices.
        </p>
    </div>

    <div class="widget-card">
        <span class="widget-label">Storage Usage</span>
        <div class="card-content">
            <p class="description">
                Amount of storage space used by the extension.
            </p>
            <div class="storage-stats">
                <div class="storage-info">
                    <span class="storage-used"
                        >{formatUsage(storageStats.used)} used of {formatMB(
                            storageStats.quota,
                        )}</span
                    >
                    <span class="storage-percentage"
                        >{storageStats.percentage}%</span
                    >
                </div>
                <div class="progress-bar-container">
                    <div
                        class="progress-bar-fill"
                        style="width: {storageStats.percentage}%"
                    ></div>
                </div>
            </div>
        </div>
    </div>

    <div class="widget-card">
        <span class="widget-label">Export Data</span>
        <div class="card-content">
            <p class="description">
                Download a JSON file containing all your data.
            </p>
            <button class="action-button primary" onclick={exportJSON}>
                <span class="material-symbols-outlined">download</span>
                Export to JSON
            </button>
        </div>
    </div>

    <div class="widget-card">
        <span class="widget-label">Import Data</span>
        <div class="card-content">
            <p class="description">
                Restore your data from a previously exported JSON file.
                <br />
                <span
                    ><strong>Warning:</strong> This might overwrite existing entries
                    with the same ID.</span
                >
            </p>

            <label class="file-upload-label">
                <input
                    type="file"
                    accept="application/json"
                    bind:files
                    class="file-input"
                />
                <span class="action-button secondary">
                    <span class="material-symbols-outlined">upload_file</span>
                    Select File
                </span>
            </label>

            {#if importStatus === "success"}
                <p class="status-message success">
                    <span class="material-symbols-outlined">check_circle</span>
                    Data imported successfully!
                </p>
            {/if}
            {#if importStatus === "error"}
                <p class="status-message error">
                    <span class="material-symbols-outlined">error</span>
                    Failed to import data. Please check the file format.
                </p>
            {/if}
        </div>
    </div>
</div>

<style>
    .settings-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding-bottom: var(--spacing-2xl);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .settings-header h2 {
        font-size: 20px;
        font-weight: 600;
        color: var(--color-text-main);
        margin-bottom: 4px;
    }

    .subtitle {
        color: var(--color-text-secondary);
        font-size: 14px;
    }

    .widget-card {
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: border-color 0.2s ease;
    }

    .widget-card:hover {
        border-color: var(--color-border-hover);
    }

    .widget-label {
        font-size: 12px;
        font-weight: 700;
        color: var(--color-text-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-bottom: 1px solid var(--color-bg-body);
        padding-bottom: 8px;
    }

    .card-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
    }

    .description {
        font-size: 14px;
        color: var(--color-text-secondary);
        line-height: 1.5;
        max-width: 600px;
    }

    .action-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: var(--radius-md);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
    }

    .action-button.primary {
        background-color: var(--color-primary-black);
        color: #ffffff;
    }

    .action-button.primary:hover {
        opacity: 0.9;
    }

    .action-button.secondary {
        background-color: var(--color-bg-body);
        color: var(--color-text-main);
        border-color: var(--color-border);
    }

    .action-button.secondary:hover {
        background-color: var(--color-bg-hover);
        border-color: var(--color-border-hover);
    }

    .file-upload-label {
        display: inline-block;
        cursor: pointer;
    }

    .file-input {
        display: none;
    }

    .status-message {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        margin-top: 8px;
    }

    .status-message.success {
        color: #10b981;
    }

    .status-message.error {
        color: #ef4444;
    }

    .material-symbols-outlined {
        font-size: 20px;
    }

    .storage-stats {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .storage-info {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: var(--color-text-secondary);
        font-weight: 500;
    }

    .storage-percentage {
        color: var(--color-text-main);
        font-weight: 600;
    }

    .progress-bar-container {
        width: 100%;
        height: 8px;
        background-color: var(--color-bg-body);
        border-radius: var(--radius-full);
        overflow: hidden;
        border: 1px solid var(--color-border);
    }

    .progress-bar-fill {
        height: 100%;
        background-color: var(--color-primary-black);
        border-radius: var(--radius-full);
        transition: width 0.3s ease;
    }
</style>
