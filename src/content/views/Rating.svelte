<script>
    import IconStar from "@/content/views/IconStar.svelte";

    const { onRate, value } = $props();
    const ratings = [1, 2, 3, 4, 5];
</script>

{#each ratings as x}
    <IconStar onclick={() => onRate(x)} isSelected={x <= value} />
{/each}
