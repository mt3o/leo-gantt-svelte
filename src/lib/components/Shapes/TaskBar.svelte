<script lang="ts">
  import { GANTT_THEME, type GanttTheme } from '$lib/gantt-theme';
  import type { Task } from '$lib/types/gantt';

  let {
      task,
      x, y,
      width, height,
      onclick,
      theme = {}
  } = $props<{
    task: Task;
    x: number;
    y: number;
    width: number;
    height: number;
    onclick?: (id: string) => void;
    theme: Partial<GanttTheme>;
  }>();

    const _theme = $derived({...GANTT_THEME, ...theme});

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
    rx={_theme.styles.taskRadius}
    fill={task.color ?? _theme.colors.taskDefault}
    class="transition-opacity duration-150 hover:opacity-90"
  />

  {#if width > 40}
    <foreignObject
      x={x} y={y}
      width={width} height={height}
      >
      <div
              xmlns="http://www.w3.org/1999/xhtml"
              style:color={task?.textColor ?? _theme.colors.taskText}
              class="{_theme.classes.taskTextFormatting}"
      >
              {task.label}
      </div>
    </foreignObject>
  {/if}
</g>
