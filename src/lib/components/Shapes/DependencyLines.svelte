<script lang="ts">
  import type { LineCoords } from '$lib/logic/dependency-math';
  import { GANTT_THEME, type GanttTheme } from '$lib/gantt-theme';

  let {
      lines,
      highlighted = false,
      theme = GANTT_THEME
  } = $props<{
      lines: LineCoords[],
      highlighted?: boolean,
      theme?: Partial<GanttTheme>
  }>();
  const _theme = {
      ...GANTT_THEME,
      ...theme
  }
</script>

<g class="dependency-lines">
  {#each lines as line (line.id)}
    <g class="dependency-line-item">
      <line
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        class={highlighted ? _theme.colors.dependencyLineHighlighted : _theme.colors.dependencyLine}
        stroke-linecap="round"
      />

      <circle
        cx={line.x2}
        cy={line.y2}
        r={highlighted ? "3" : "2"}
        class={highlighted ? "fill-blue-500" : "fill-slate-400"}
      />
    </g>
  {/each}
</g>

<style>
  line {
    /* Geometric precision is better for diagonal lines */
    shape-rendering: geometricPrecision;
  }
</style>
