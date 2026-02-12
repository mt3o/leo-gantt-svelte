<script lang="ts">
  import type { ViewportConfig } from '$lib/types/gantt';
  import { generateTicks } from '$lib/logic/ticks';
  import { GANTT_THEME, type GanttTheme } from '$lib/gantt-theme';

  let {
      viewportConfig,
      theme = {},
  } = $props<{
      viewportConfig: ViewportConfig,
      theme: Partial<GanttTheme>
  }>();

  const _theme = $derived({...GANTT_THEME, ...theme});
  const ticks = $derived(viewportConfig && _theme ? generateTicks(viewportConfig, _theme) : []);
</script>


<div
        class={`HEADER ${_theme?.colors?.background ?? ''} h-10 border-b border-slate-200 relative overflow-hidden`}
        style={`width: 100%;`}
>

  <svg width={_theme?.dimensions?.containerWidth ?? 0} height={_theme?.dimensions?.navigatorHeight ?? 0}>
    {#each ticks as tick}
      <line
        x1={tick.x}
        y1={tick.isMajor ? 15 : 25}
        x2={tick.x}
        y2="40"
        class={tick.isMajor ? "stroke-slate-400 dark:stroke-slate-600" : "stroke-slate-300 dark:stroke-slate-700"}
      />
      <text
        x={tick.x + 4}
        y={tick.isMajor ? 12 : 20}
        class="fill-slate-500 text-[10px] font-medium dark:fill-slate-400"
        class:font-bold={tick.isMajor}
      >
        {tick.label}
      </text>
    {/each}
  </svg>
</div>
