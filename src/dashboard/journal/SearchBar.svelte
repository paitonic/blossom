<script lang="ts">
    let { value = $bindable() } = $props();
</script>

<div class="search-bar-container">
    <input
        class="search-input"
        placeholder="Search..."
        type="text"
        bind:value
    />
    <span class="material-symbols-outlined search-icon">search</span>
</div>

<style>
    .search-bar-container {
        position: relative;
        width: 100%;
    }
    @media (min-width: 640px) {
        .search-bar-container {
            width: 320px;
        }
    }
    @media (min-width: 1024px) {
        .search-bar-container {
            width: 384px;
        }
    }
    .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-muted);
        font-size: 20px;
        transition: color 0.2s ease;
    }
    .search-input {
        width: 100%;
        padding-left: 40px;
        padding-right: 16px;
        padding-top: 10px;
        padding-bottom: 10px;
        background-color: var(--color-bg-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 14px;
        color: var(--color-text-main);
        transition: all 0.2s ease;
        box-shadow: var(--shadow-sm);
    }
    .search-input::placeholder {
        color: var(--color-text-muted);
    }
    .search-input:focus {
        outline: none;
        border-color: var(--color-text-secondary);
    }
    .search-input:focus ~ .search-icon {
        color: var(--color-text-main);
    }
</style>
