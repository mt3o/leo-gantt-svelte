<script lang="ts">



  import {timeToPixel} from "$lib/logic/viewport";
  import type {ViewportConfig} from "$lib";

  let { config } = $props<{ config: ViewportConfig }>();

  // Logic to generate ticks based on zoom level
  const ticks = $derived.by(() => {
    const { viewStart, viewEnd } = config;
    const items: { label: string; x: number }[] = [];
    const curr = new Date(viewStart);
    curr.setHours(0, 0, 0, 0);

    // Basic implementation: one tick per day
    while (curr < viewEnd) {
      items.push({
        label: curr.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        x: timeToPixel(curr, config)
      });
      curr.setDate(curr.getDate() + 1);
    }
    return items;
  });
</script>

<div class="h-10 border-b border-slate-200 bg-slate-50 relative overflow-hidden">
  <svg width={config.containerWidth} height="40">
    {#each ticks as tick}
      <line x1={tick.x} y1="25" x2={tick.x} y2="40" class="stroke-slate-300" />
      <text x={tick.x + 4} y="20" class="fill-slate-500 text-[10px] font-medium">
        {tick.label}
      </text>
    {/each}
  </svg>
</div>
