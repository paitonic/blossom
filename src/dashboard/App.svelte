<script lang="ts">
    import Journal from "./journal/Journal.svelte";
    import Metrics from "./metrics/Metrics.svelte";
    import Settings from "./Settings.svelte";
    import Development from "./Development.svelte";
    import { storage } from "@/shared/storage.svelte";
    import logo from "@public/blossom-128x128.png";
    import "@/shared/styles/variables.css";
    import "@/shared/styles/form.css";
    import "@/shared/styles/modal-layout.css";

    const tabs = [
        { name: "Journal", icon: "edit_note", component: Journal },
        { name: "Metrics", icon: "analytics", component: Metrics },
        { name: "Settings", icon: "settings", component: Settings },
        ...(import.meta.env.DEV
            ? [
                  {
                      name: "Development",
                      icon: "code",
                      component: Development,
                  },
              ]
            : []),
    ];

    let tasks = $state([]);
    const loadTasks = async () => {
        const kv = await storage.kall();
        tasks = Object.keys(kv)
            .filter((key) => key !== "blossom:settings")
            .map((key) => {
                return kv[key];
            });
    };

    $effect(() => {
        loadTasks();

        const handleStorageChange = (changes, areaName) => {
            if (areaName === "local") {
                loadTasks();
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    });

    let activeTabName = $state(
        localStorage.getItem("blossom_active_tab") || tabs[0].name,
    );
    let activeTab = $derived(
        tabs.find((t) => t.name === activeTabName) || tabs[0],
    );

    const selectTab = (tab) => {
        activeTabName = tab.name;
        localStorage.setItem("blossom_active_tab", tab.name);
    };

    const version = chrome.runtime?.getManifest?.()?.version;
</script>

<div class="app-container">
    <header class="app-header">
        <div class="header-inner">
            <div class="brand-section">
                <img src={logo} alt="Blossom Logo" class="logo-img" />
                <span class="logo-text">
                    Blossom
                    {#if version}
                        <span class="version">v{version}</span>
                    {/if}
                </span>
            </div>
            <nav class="nav-tabs">
                {#each tabs as tab}
                    <a
                        class={activeTab.name === tab.name
                            ? "nav-tab active"
                            : "nav-tab"}
                        href="#"
                        onclick={() => selectTab(tab)}
                    >
                        <span class="material-symbols-outlined">{tab.icon}</span
                        >
                        {tab.name}
                    </a>
                {/each}
            </nav>
        </div>
    </header>
    <main class="main-content">
        <div class="content-scrollable">
            {#if activeTab.component === Journal || activeTab.component === Metrics}
                <activeTab.component {tasks} refresh={loadTasks} />
            {:else}
                <activeTab.component />
            {/if}
        </div>
    </main>
</div>

<style>
    :global(:root) {
        --font-family: "Inter", sans-serif;
        --color-bg-body: #f9fafb;
        --color-bg-white: #ffffff;
        --color-border: #e5e7eb;
        --color-border-hover: #d1d5db;
        --color-text-main: #111827;
        --color-text-secondary: #4b5563;
        --color-text-muted: #9ca3af;
        --color-primary-black: #111827;
        --color-bg-hover: #f3f4f6;
        --color-bg-nav-active: #111827;
        --color-text-nav-active: #ffffff;
        --spacing-xs: 4px;
        --spacing-sm: 8px;
        --spacing-md: 12px;
        --spacing-lg: 16px;
        --spacing-xl: 24px;
        --spacing-2xl: 32px;
        --radius-md: 6px;
        --radius-lg: 8px;
        --radius-xl: 12px;
        --radius-full: 9999px;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    :global(*) {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    :global(body) {
        font-family: var(--font-family);
        background-color: var(--color-bg-body);
        color: var(--color-text-main);
        -webkit-font-smoothing: antialiased;
    }

    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
    }
    .app-header {
        background-color: var(--color-bg-white);
        border-bottom: 1px solid var(--color-border);
        padding-top: var(--spacing-lg);
        flex-shrink: 0;
    }
    .header-inner {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .brand-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-lg);
    }
    .logo-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
    }
    .logo-text {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: var(--color-text-main);
    }
    .version {
        font-size: 12px;
        font-weight: 500;
        color: var(--color-text-muted);
        align-self: flex-end;
        margin-bottom: 2px;
    }
    .nav-tabs {
        display: flex;
        gap: var(--spacing-xl);
        overflow-x: auto;
        scrollbar-width: none;
    }
    .nav-tabs::-webkit-scrollbar {
        display: none;
    }
    .nav-tab {
        display: flex;
        align-items: center;
        gap: 6px;
        padding-bottom: 12px;
        font-size: 14px;
        font-weight: 500;
        color: var(--color-text-secondary);
        text-decoration: none;
        border: none;
        background: none;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
        white-space: nowrap;
        margin-bottom: -1px;
    }
    .nav-tab:hover {
        color: var(--color-text-main);
    }
    .nav-tab.active {
        color: var(--color-text-main);
        border-bottom-color: var(--color-text-main);
    }
    .nav-tab .material-symbols-outlined {
        font-size: 18px;
        color: inherit;
    }
    .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        background-color: var(--color-bg-body);
    }
    .content-scrollable {
        flex: 1;
        padding: var(--spacing-xl) var(--spacing-lg);
        display: flex;
        flex-direction: column;
    }
    @media (min-width: 1024px) {
        .content-scrollable {
            padding: var(--spacing-2xl);
        }
    }
</style>
