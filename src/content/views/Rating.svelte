<script>
    import IconStar from "@/content/views/IconStar.svelte";

    const { onRate, score } = $props();
    const values = [1, 2, 3, 4, 5];
</script>

{#each values as value}
    <IconStar onclick={() => onRate(value)} isSelected={value <= score} />
{/each}
