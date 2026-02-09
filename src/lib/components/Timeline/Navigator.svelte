<script lang="ts">
  import { pixelToTime, timeToPixel } from "$lib/logic/viewport";

  interface Props {
    totalStart: Date;
    totalEnd: Date;
    viewStart: Date;
    viewEnd: Date;
    containerWidth: number;
    height?: number;
    onRangeChange: (start: Date, end: Date) => void;
  }

  let {
    totalStart,
    totalEnd,
    viewStart,
    viewEnd,
    containerWidth,
    height = 40,
    onRangeChange
  }: Props = $props();

  const navConfig = $derived({
    viewStart: totalStart,
    viewEnd: totalEnd,
    containerWidth
  });

  const brushX = $derived(timeToPixel(viewStart, navConfig));
  const brushWidth = $derived(timeToPixel(viewEnd, navConfig) - brushX);

  let dragMode: 'pan' | 'resize-left' | 'resize-right' | null = $state(null);
  let startX = 0;
  let initialViewStart = new Date();
  let initialViewEnd = new Date();
  let containerRef: HTMLDivElement;

  function handlePanStart(e: MouseEvent) {
    // Only start pan if clicking on the brush itself (but not handles)
    // The handles have stopPropagation, so this fires for brush body or outside.
    // If clicking outside brush, maybe jump to that position?
    // Current logic: clicking anywhere on container starts pan.

    // Let's refine:
    // If clicking on the brush (but not handles), we pan.
    // If clicking outside, we center the brush there (jump) and then pan?
    // Or just pan from where we clicked?

    // Standard behavior: clicking on brush -> pan. Clicking outside -> jump or create new selection.
    // For simplicity, let's assume clicking anywhere pans/moves the brush.

    dragMode = 'pan';
    startX = e.clientX;
    initialViewStart = new Date(viewStart);
    initialViewEnd = new Date(viewEnd);

    // If clicked outside the brush, we might want to jump immediately.
    // But let's keep it simple: drag to move.
    // If the user clicks outside, the brush stays until they move?
    // The previous implementation centered the brush on click.
    // Let's keep the "center on click" behavior if clicking outside, but "drag offset" if clicking inside.

    const rect = containerRef.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX < brushX || clickX > brushX + brushWidth) {
       // Clicked outside: center brush here
       const duration = viewEnd.getTime() - viewStart.getTime();
       const newStart = pixelToTime(clickX - (brushWidth / 2), navConfig);
       const newEnd = new Date(newStart.getTime() + duration);

       if (newStart >= totalStart && newEnd <= totalEnd) {
         onRangeChange(newStart, newEnd);
         // Update initial state for subsequent drag
         initialViewStart = newStart;
         initialViewEnd = newEnd;
         // Reset startX to current mouse to avoid jump on first move
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
    const rect = containerRef.getBoundingClientRect();

    // Convert delta pixels to time delta?
    // No, pixelToTime is absolute.
    // We can calculate new time based on new pixel position.

    if (dragMode === 'pan') {
      const duration = initialViewEnd.getTime() - initialViewStart.getTime();
      // Calculate new start based on initial start pixel + delta
      const initialStartPx = timeToPixel(initialViewStart, navConfig);
      const newStartPx = initialStartPx + deltaX;

      const newStart = pixelToTime(newStartPx, navConfig);
      const newEnd = new Date(newStart.getTime() + duration);

      if (newStart >= totalStart && newEnd <= totalEnd) {
        onRangeChange(newStart, newEnd);
      }
    } else if (dragMode === 'resize-left') {
      const initialStartPx = timeToPixel(initialViewStart, navConfig);
      const newStartPx = initialStartPx + deltaX;
      const newStart = pixelToTime(newStartPx, navConfig);

      if (newStart >= totalStart && newStart < viewEnd) {
        onRangeChange(newStart, viewEnd);
      }
    } else if (dragMode === 'resize-right') {
      const initialEndPx = timeToPixel(initialViewEnd, navConfig);
      const newEndPx = initialEndPx + deltaX;
      const newEnd = pixelToTime(newEndPx, navConfig);

      if (newEnd <= totalEnd && newEnd > viewStart) {
        onRangeChange(viewStart, newEnd);
      }
    }
  }

  function stopDragging() {
    dragMode = null;
  }
</script>

<svelte:window onmouseup={stopDragging} onmousemove={handleWindowMouseMove} />

<div
  bind:this={containerRef}
  class="relative bg-slate-100 border-b border-slate-200 cursor-crosshair select-none"
  style:height="{height}px"
  style:width="{containerWidth}px"
  onmousedown={handlePanStart}
  role="slider"
>
  <div class="absolute inset-0 flex items-center px-2 opacity-30 pointer-events-none">
    <span class="text-[10px] text-slate-500">{totalStart.toLocaleDateString()}</span>
    <div class="flex-1 border-t border-dotted border-slate-400 mx-2"></div>
    <span class="text-[10px] text-slate-500">{totalEnd.toLocaleDateString()}</span>
  </div>

  <div
    class="absolute top-0 h-full border-x border-blue-500 bg-blue-500/10 transition-shadow group"
    class:shadow-lg={dragMode !== null}
    style:left="{brushX}px"
    style:width="{brushWidth}px"
  >
    <!-- Left Handle -->
    <div
      class="absolute top-0 left-0 h-full w-3 -ml-1.5 cursor-ew-resize flex items-center justify-center hover:bg-blue-500/20"
      onmousedown={(e) => handleResizeStart(e, 'left')}
    >
      <div class="w-[2px] h-4 bg-blue-500 rounded-full"></div>
    </div>

    <!-- Right Handle -->
    <div
      class="absolute top-0 right-0 h-full w-3 -mr-1.5 cursor-ew-resize flex items-center justify-center hover:bg-blue-500/20"
      onmousedown={(e) => handleResizeStart(e, 'right')}
    >
      <div class="w-[2px] h-4 bg-blue-500 rounded-full"></div>
    </div>
  </div>
</div>
