<script lang="ts">
  import { GANTT_THEME } from '$lib/gantt-theme';
  import type { Task, ViewportConfig } from '$lib/types/gantt';

  let { task, x, y, width, height, viewport, onUpdate } = $props<{
    task: Task;
    x: number;
    y: number;
    width: number;
    height: number;
    viewport: ViewportConfig;
    onUpdate: (id: string, start: Date, end: Date) => void;
  }>();

  let isDragging = $state(false);
  let startX = $state(0);
  let dragOffset = $state(0);

  // Derived "Ghost" position for visual feedback
  const dragX = $derived(x + dragOffset);

  function handleMouseDown(e: MouseEvent) {
    // isDragging = true;
    // startX = e.clientX;
    // dragOffset = 0;
  }

  function handleMouseMove(e: MouseEvent) {
    // if (!isDragging) return;
    // dragOffset = e.clientX - startX;
  }

  function handleMouseUp() {
    // if (!isDragging) return;
    //
    // const { start, end } = calculateDragMovement(dragOffset, task.start, task.end, viewport);
    // onUpdate(task.id, start, end);
    //
    // isDragging = false;
    // dragOffset = 0;
  }
</script>

<svelte:window
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
/>

<g
  class="task-bar-group cursor-move"
  onmousedown={handleMouseDown}
  role="presentation"
>
  <rect
    x={dragX}
    {y}
    {width}
    {height}
    rx={GANTT_THEME.styles.taskRadius}
    fill={task.color ?? GANTT_THEME.colors.taskDefault}
    class:opacity-50={isDragging}
    class="transition-opacity duration-150"
  />

  {#if width > 40}
    <text
      x={dragX + 6}
      y={y + height / 2}
      dominant-baseline="central"
      class="fill-white text-[11px] font-semibold pointer-events-none"
    >
      {task.label}
    </text>
  {/if}
</g>
