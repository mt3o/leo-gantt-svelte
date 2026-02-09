<script lang="ts">
  import type { FlattenedItem } from '$lib/types/gantt';
  import Row from './Row.svelte';

  let {
    visibleRows,
    totalCount,
    startIndex,
    rowHeight,
    width = 250,
    onRowToggle
  } = $props<{
    visibleRows: FlattenedItem[];
    totalCount: number;
    startIndex: number;
    rowHeight: number;
    width?: number;
    onRowToggle?: (id: string) => void;
  }>();

  // Padding to position visible elements correctly within the virtual list
  const paddingTop = $derived(startIndex * rowHeight);
  const totalHeight = $derived(totalCount * rowHeight);
</script>

<div
  class="relative border-r border-slate-200 bg-white overflow-hidden flex-shrink-0"
  style:width="{width}px"
>
  <div style:height="{totalHeight}px" class="relative">
    <div style:transform="translateY({paddingTop}px)">
      {#each visibleRows as row (row.id)}
        <Row {row} height={rowHeight} onToggle={onRowToggle} />
      {/each}
    </div>
  </div>
</div>
