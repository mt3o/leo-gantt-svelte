<script lang="ts">
  import type { FlattenedItem } from '$lib/types/gantt';
  import Row from './Row.svelte';
  import { GANTT_THEME, type GanttTheme } from '$lib/gantt-theme';

  let {
    visibleRows,
    totalCount,
    startIndex,
    rowHeight,
    width = 250,
    onRowToggle,
    theme
  } = $props<{
    visibleRows: FlattenedItem[];
    totalCount: number;
    startIndex: number;
    rowHeight: number;
    width?: number;
    onRowToggle?: (id: string) => void;
    theme: Partial<GanttTheme>;
  }>();

  const totalHeight = $derived(totalCount * rowHeight);

  const _theme = $derived({...GANTT_THEME, ...theme}) as GanttTheme;
  const sidebarBackground = $derived(_theme.colors.sidebarBackground);
  const border = $derived(_theme.colors.sidebarContainerBorder);

</script>

<div
  class={`row-container relative border-r overflow-hidden flex-shrink-0  ${sidebarBackground} ${border}`}
  style:width="{width}px"
  style:height="{totalHeight}px"
>
  {#each visibleRows as row, i (row.id)}
    {@const y = (startIndex + i) * rowHeight}
    <div class="absolute top-0 left-0 w-full" style:transform="translateY({y}px)">
      <Row
              theme={_theme}
              {row}
              height={rowHeight}
              onToggle={onRowToggle} />
    </div>
  {/each}
</div>
