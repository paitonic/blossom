<script>
    import Journal from "@/dashboard/Journal.svelte";
    import Insights from "@/dashboard/Insights.svelte";
    import Tags from "@/dashboard/Tags.svelte";
    import Settings from "@/dashboard/Settings.svelte";

    const tabs = [
        { name: "Journal", icon: "edit_note", component: Journal },
        { name: "Insights", icon: "insights", component: Insights },
        { name: "Tags", icon: "label", component: Tags },
        { name: "Settings", icon: "settings", component: Settings },
    ];

    let activeTab = $state(tabs[0]);

    const selectTab = (tab) => {
        activeTab = tab;
    };
</script>

<div class="app-container">
    <header class="app-header">
        <div class="header-inner">
            <div class="brand-section">
                <span class="material-symbols-outlined logo-icon"
                    >local_florist</span
                >
                <span class="logo-text">Blossom</span>
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
            <activeTab.component />
        </div>
    </main>
</div>
