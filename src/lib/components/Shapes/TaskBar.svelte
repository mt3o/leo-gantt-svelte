<script lang="ts">
  import { GANTT_THEME } from '$lib/gantt-theme';
  import type { Task } from '$lib/types/gantt';

  let { task, x, y, width, height, onclick } = $props<{
    task: Task;
    x: number;
    y: number;
    width: number;
    height: number;
    onclick?: (id: string) => void;
  }>();

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<g
  class="task-bar-group cursor-pointer"
  onclick={(e) => { e.stopPropagation(); onclick?.(task.id); }}
  role="button"
  tabindex="0"
>
  <rect
    {x}
    {y}
    {width}
    {height}
    rx={GANTT_THEME.styles.taskRadius}
    fill={task.color ?? GANTT_THEME.colors.taskDefault}
    class="transition-opacity duration-150 hover:opacity-90"
  />

  {#if width > 40}
    <text
      x={x + 6}
      y={y + height / 2}
      dominant-baseline="central"
      class="fill-white text-[11px] font-semibold pointer-events-none select-none"
    >
      {task.label}
    </text>
  {/if}
</g>
