<script>
    let { text, position = "top", children } = $props();
</script>

<div class="tooltip-wrapper">
    {@render children()}
    <div class="tooltip-content {position}">
        {text}
    </div>
</div>

<style>
    .tooltip-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
    }

    .tooltip-content {
        position: absolute;
        background-color: #1f2937;
        color: #ffffff;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        white-space: normal;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
        z-index: 10000;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        width: max-content;
        max-width: 200px;
        line-height: 1.4;
        text-align: center;
    }

    .tooltip-wrapper:hover .tooltip-content {
        opacity: 1;
        visibility: visible;
    }

    /* Top Position */
    .tooltip-content.top {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-4px);
        margin-bottom: 8px;
    }
    .tooltip-wrapper:hover .tooltip-content.top {
        transform: translateX(-50%) translateY(0);
    }
    .tooltip-content.top::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -4px;
        border-width: 4px;
        border-style: solid;
        border-color: #1f2937 transparent transparent transparent;
    }

    /* Bottom Position */
    .tooltip-content.bottom {
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(4px);
        margin-top: 8px;
    }
    .tooltip-wrapper:hover .tooltip-content.bottom {
        transform: translateX(-50%) translateY(0);
    }
    .tooltip-content.bottom::after {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -4px;
        border-width: 4px;
        border-style: solid;
        border-color: transparent transparent #1f2937 transparent;
    }

    /* Left Position */
    .tooltip-content.left {
        top: 50%;
        right: 100%;
        transform: translateY(-50%) translateX(-4px);
        margin-right: 8px;
    }
    .tooltip-wrapper:hover .tooltip-content.left {
        transform: translateY(-50%) translateX(0);
    }
    .tooltip-content.left::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        margin-top: -4px;
        border-width: 4px;
        border-style: solid;
        border-color: transparent transparent transparent #1f2937;
    }

    /* Right Position */
    .tooltip-content.right {
        top: 50%;
        left: 100%;
        transform: translateY(-50%) translateX(4px);
        margin-left: 8px;
    }
    .tooltip-wrapper:hover .tooltip-content.right {
        transform: translateY(-50%) translateX(0);
    }
    .tooltip-content.right::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 100%;
        margin-top: -4px;
        border-width: 4px;
        border-style: solid;
        border-color: transparent #1f2937 transparent transparent;
    }
</style>
