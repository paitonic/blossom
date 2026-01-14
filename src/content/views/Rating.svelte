<script>
    import IconStar from "@/shared/icons/IconStar.svelte";

    let { value = 0, onRate } = $props();

</script>

{#each ratings as x}
    <IconStar onclick={() => onRate(x)} isSelected={x <= value} />
{/each}
