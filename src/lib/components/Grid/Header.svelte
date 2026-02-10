<script lang="ts">
  import type { ViewportConfig } from '$lib/types/gantt';
  import { generateTicks } from '$lib/logic/ticks';

  let { config } = $props<{ config: ViewportConfig }>();

  const ticks = $derived(generateTicks(config));
</script>

<div class="h-10 border-b border-slate-200 bg-slate-50 relative overflow-hidden">
  <svg width={config.containerWidth} height="40">
    {#each ticks as tick}
      <line
        x1={tick.x}
        y1={tick.isMajor ? 15 : 25}
        x2={tick.x}
        y2="40"
        class={tick.isMajor ? "stroke-slate-400" : "stroke-slate-300"}
      />
      <text
        x={tick.x + 4}
        y={tick.isMajor ? 12 : 20}
        class="fill-slate-500 text-[10px] font-medium"
        class:font-bold={tick.isMajor}
      >
        {tick.label}
      </text>
    {/each}
  </svg>
</div>
