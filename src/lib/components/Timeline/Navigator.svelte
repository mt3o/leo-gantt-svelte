<script lang="ts">
    import {pixelToTime, timeToPixel} from "$lib/logic/viewport";
    import {GANTT_THEME, type GanttTheme} from '$lib/gantt-theme';
    import {onMount} from "svelte";

    interface Props {
        totalStart: Date;
        totalEnd: Date;
        viewStart: Date;
        viewEnd: Date;
        height?: number;
        theme: Partial<GanttTheme>;
        onRangeChange: (start: Date, end: Date) => void;
    }

    let {
        totalStart,
        totalEnd,
        viewStart,
        viewEnd,
        height = 40,
        theme = {},
        onRangeChange
    }: Props = $props();

    const _theme = {...GANTT_THEME, ...theme};



    const navConfig = $derived({
        viewStart: totalStart,
        viewEnd: totalEnd,
        containerWidth: _theme.dimensions.containerWidth - _theme.dimensions.sidebarWidth,
    });

    const brushX = $derived(timeToPixel(viewStart, navConfig, _theme));
    const brushWidth = $derived(timeToPixel(viewEnd, navConfig, _theme) - brushX);

    let dragMode: 'pan' | 'resize-left' | 'resize-right' | null = $state(null);
    let startX = 0;
    let initialViewStart = new Date();
    let initialViewEnd = new Date();
    let containerRef: HTMLDivElement;

    onMount(()=>{
        //containerRef.style.setProperty('box-shadow', `0 0 5px 0 red`);
    });

    function handlePanStart(e: MouseEvent) {
        dragMode = 'pan';
        startX = e.clientX;
        initialViewStart = new Date(viewStart);
        initialViewEnd = new Date(viewEnd);

        const rect = containerRef.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        if (clickX < brushX || clickX > brushX + brushWidth) {
            const duration = viewEnd.getTime() - viewStart.getTime();
            const newStart = pixelToTime(clickX - (brushWidth / 2), navConfig, _theme);
            const newEnd = new Date(newStart.getTime() + duration);

            if (newStart >= totalStart && newEnd <= totalEnd) {
                onRangeChange(newStart, newEnd);
                initialViewStart = newStart;
                initialViewEnd = newEnd;
                startX = e.clientX;
            }
        }
    }

    function handleResizeStart(e: MouseEvent, side: 'left' | 'right') {
        e.stopPropagation();
        dragMode = side === 'left' ? 'resize-left' : 'resize-right';
        startX = e.clientX;
        initialViewStart = new Date(viewStart);
        initialViewEnd = new Date(viewEnd);
    }

    function handleWindowMouseMove(e: MouseEvent) {
        if (!dragMode) return;

        const deltaX = e.clientX - startX;

        if (dragMode === 'pan') {
            const duration = initialViewEnd.getTime() - initialViewStart.getTime();
            const initialStartPx = timeToPixel(initialViewStart, navConfig, _theme);
            const newStartPx = initialStartPx + deltaX;

            const newStart = pixelToTime(newStartPx, navConfig, _theme);
            const newEnd = new Date(newStart.getTime() + duration);

            if (newStart >= totalStart && newEnd <= totalEnd) {
                onRangeChange(newStart, newEnd);
            }
        } else if (dragMode === 'resize-left') {
            const initialStartPx = timeToPixel(initialViewStart, navConfig, _theme);
            const newStartPx = initialStartPx + deltaX;
            const newStart = pixelToTime(newStartPx, navConfig, _theme);

            if (newStart >= totalStart && newStart < viewEnd) {
                onRangeChange(newStart, viewEnd);
            }
        } else if (dragMode === 'resize-right') {
            const initialEndPx = timeToPixel(initialViewEnd, navConfig, _theme);
            const newEndPx = initialEndPx + deltaX;
            const newEnd = pixelToTime(newEndPx, navConfig, _theme);

            if (newEnd <= totalEnd && newEnd > viewStart) {
                onRangeChange(viewStart, newEnd);
            }
        }
    }

    function stopDragging() {
        dragMode = null;
    }
</script>

<svelte:window onmouseup={stopDragging} onmousemove={handleWindowMouseMove}/>

<div
        tabindex="0"
        bind:this={containerRef}
        class="NAVIGATOR relative p-4 border-b cursor-crosshair select-none {_theme.colors.navigatorBackground}"
        class:border-slate-200={_theme.colors.background === 'bg-white'}
        class:border-slate-700={_theme.colors.background !== 'bg-white'}
        style:margin-left="{_theme.dimensions.sidebarWidth}px"
        style:height="{height}px"
        style:width="{navConfig.containerWidth}px"
        onmousedown={handlePanStart}
        role="slider"
>
    <div style="height: 40px;" class="FIX_SIZE"></div>
    <div
            class="absolute inset-0 flex items-center px-2 opacity-50 pointer-events-none"
    >

    <span class={`text-[10px] ${_theme.colors.navigatorText}`}>
        {totalStart.toLocaleDateString()}
    </span>
        <div class="flex-1 border-t border-dotted border-slate-400 dark:border-slate-600 mx-2"></div>
        <span class={`text-[10px] ${_theme.colors.navigatorText}`}>
        {totalEnd.toLocaleDateString()}
    </span>

    </div>

    <div
            class="TIMESPAN_SELECTOR {_theme.colors.navigatorBrush} border-blue-500 absolute top-0 h-full border-x transition-shadow group"
            class:shadow-lg={dragMode !== null}
            style:left="{brushX}px"
            style:width="{brushWidth}px"
            style="box-shadow:0 0 5px 0 red"
    >
        <!-- Left Handle -->
        <div
                class="LEFT_HANDLE absolute top-0 left-0
                h-full w-3 -ml-1.5
                cursor-ew-resize
                flex
                items-center
                justify-center
                hover:bg-blue-400/20"
                onmousedown={(e) => handleResizeStart(e, 'left')}
        >
            <div class={`${_theme.colors.navigatorHandle} w-[2px] h-4 rounded-full`}></div>
        </div>

        <!-- Right Handle -->
        <div
                class="RIGHT_HANDLE absolute top-0 right-0 h-full w-3 -mr-1.5 cursor-ew-resize flex items-center justify-center hover:bg-blue-500/20"
                onmousedown={(e) => handleResizeStart(e, 'right')}
        >
            <div class={`${_theme.colors.navigatorHandle} w-[2px] h-4 rounded-full`}
            ></div>
        </div>
    </div>
</div>
