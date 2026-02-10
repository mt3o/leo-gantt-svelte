<script lang="ts">
  import type { LineCoords } from '$lib/logic/dependency-math';

  let { lines, highlighted = false } = $props<{ lines: LineCoords[], highlighted?: boolean }>();
</script>

<g class="dependency-lines">
  {#each lines as line (line.id)}
    <g class="dependency-line-item">
      <line
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        class={highlighted ? "stroke-blue-500 stroke-[2] opacity-100" : "stroke-slate-400 stroke-[1.5] opacity-60"}
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
