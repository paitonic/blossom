<script lang="ts">
    import { COLORS } from "@/shared/colors.js";
    import IconSentimentSatisfied from "@/shared/icons/IconSentimentSatisfied.svelte";
    import IconSentimentNeutral from "@/shared/icons/IconSentimentNeutral.svelte";
    import IconSentimentDissatisfied from "@/shared/icons/IconSentimentDissatisfied.svelte";

    const effortOptions = [
        { value: "xs", label: "XS" },
        { value: "s", label: "S" },
        { value: "m", label: "M" },
        { value: "l", label: "L" },
        { value: "xl", label: "XL" },
    ];

    const typeOptions = [
        { value: "chore", label: "Chore" },
        { value: "feature", label: "Feature" },
        { value: "bug", label: "Bug" },
        { value: "research", label: "Research" },
    ];

    const challengeOptions = [
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
    ];

    const impactOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ];

    const sentimentOptions = [
        { value: -1, label: "Negative", icon: IconSentimentDissatisfied },
        { value: 0, label: "Neutral", icon: IconSentimentNeutral },
        { value: 1, label: "Positive", icon: IconSentimentSatisfied },
    ];
</script>

<div class="developer-container">
    <section class="dev-section">
        <h3>Effort</h3>
        <div class="effort-row">
            {#each effortOptions as opt}
                <div class="effort-item">
                    <span
                        class="size-pill"
                        style="background-color: {COLORS.effort[opt.value] ||
                            '#cccccc'};"
                        title={opt.value}
                    >
                        {opt.label}
                    </span>
                </div>
            {/each}
        </div>
    </section>

    <section class="dev-section">
        <h3>Type</h3>
        <div class="effort-row">
            {#each typeOptions as opt}
                <div class="effort-item">
                    <span
                        class="type-pill"
                        style="background-color: {COLORS.type[opt.value] ||
                            '#cccccc'};"
                    >
                        <span class="type-label">{opt.label}</span>
                    </span>
                </div>
            {/each}
        </div>
    </section>

    <section class="dev-section">
        <h3>Challenge</h3>
        <div class="effort-row">
            {#each challengeOptions as opt}
                <div class="effort-item">
                    <div
                        class="barometer"
                        data-level={opt.value}
                        style="--low-color: {COLORS.challenge
                            .easy}; --medium-color: {COLORS.challenge
                            .medium}; --high-color: {COLORS.challenge.hard};"
                    >
                        <div class="barometer-segment low"></div>
                        <div class="barometer-segment medium"></div>
                        <div class="barometer-segment high"></div>
                    </div>
                    <span class="effort-id">{opt.value}</span>
                </div>
            {/each}
        </div>
    </section>

    <section class="dev-section">
        <h3>Impact</h3>
        <div class="effort-row">
            {#each impactOptions as opt}
                <div class="effort-item">
                    <div
                        class="barometer"
                        data-level={opt.value}
                        style="--low-color: {COLORS.impact
                            .low}; --medium-color: {COLORS.impact
                            .medium}; --high-color: {COLORS.impact.high};"
                    >
                        <div class="barometer-segment low"></div>
                        <div class="barometer-segment medium"></div>
                        <div class="barometer-segment high"></div>
                    </div>
                    <span class="effort-id">{opt.value}</span>
                </div>
            {/each}
        </div>
    </section>

    <section class="dev-section">
        <h3>Sentiment</h3>
        <div class="effort-row">
            {#each sentimentOptions as opt}
                <div class="effort-item">
                    <div
                        style="color: {COLORS.sentiment[opt.value] ||
                            'currentColor'};"
                    >
                        <opt.icon size="24px" />
                    </div>
                    <span class="effort-id">{opt.value}</span>
                </div>
            {/each}
        </div>
    </section>
</div>

<style>
    .developer-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    h3 {
        font-size: 18px;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-md);
    }

    .dev-section {
        background-color: var(--color-bg-white);
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border);
    }

    .effort-row {
        display: flex;
        gap: var(--spacing-xl);
        align-items: center;
        flex-wrap: wrap;
    }

    .effort-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xs);
    }

    .effort-id {
        font-size: 12px;
        color: var(--color-text-muted);
        text-transform: uppercase;
        font-weight: 500;
    }

    /* Reusing size-pill style from TaskListItem.svelte */
    .size-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: var(--radius-md);
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        color: white;
    }

    /* Type Pill */
    .type-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        text-transform: lowercase;
        color: white;
        width: fit-content;
    }

    /* Barometer for Challenge and Impact */
    .barometer {
        display: flex;
        width: 60px;
        height: 8px;
        background-color: var(--color-bg-body);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        overflow: hidden;
        gap: 1px;
    }
    .barometer-segment {
        flex: 1;
        height: 100%;
        opacity: 0.15;
        transition: opacity 0.2s ease;
    }
    .barometer-segment.low {
        background-color: var(--low-color);
    }
    .barometer-segment.medium {
        background-color: var(--medium-color);
    }
    .barometer-segment.high {
        background-color: var(--high-color);
    }

    .barometer[data-level="low"] .barometer-segment.low,
    .barometer[data-level="easy"] .barometer-segment.low {
        opacity: 1;
    }
    .barometer[data-level="medium"] .barometer-segment.low,
    .barometer[data-level="medium"] .barometer-segment.medium {
        opacity: 1;
    }
    .barometer[data-level="high"] .barometer-segment.low,
    .barometer[data-level="high"] .barometer-segment.medium,
    .barometer[data-level="high"] .barometer-segment.high,
    .barometer[data-level="hard"] .barometer-segment.low,
    .barometer[data-level="hard"] .barometer-segment.medium,
    .barometer[data-level="hard"] .barometer-segment.high {
        opacity: 1;
    }
</style>
