<script lang="ts">
  import type { FlattenedItem } from '$lib/types/gantt';

  let {
    row,
    height,
    onToggle
  } = $props<{
    row: FlattenedItem;
    height: number;
    onToggle?: (id: string) => void;
  }>();

  const paddingLeft = $derived(row.level * 16 + 8); // 16px per level + 8px base padding
</script>

<div
  class="flex items-center border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors box-border"
  style:height="{height}px"
  style:padding-left="{paddingLeft}px"
>
  {#if row.type === 'group'}
    <button
      onclick={() => onToggle?.(row.id)}
      class="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 mr-2 text-slate-500 focus:outline-none"
      aria-label={row.isExpanded ? "Collapse group" : "Expand group"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4 transition-transform duration-200"
        style:transform={row.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'}
      >
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
    <span class="text-sm font-semibold text-slate-800 truncate select-none">
      {row.label}
    </span>
  {:else}
    <!-- Indent for leaf nodes to align with group text (icon width + margin) -->
    <div class="w-5 mr-2"></div>
    <span class="text-sm text-slate-600 truncate select-none font-medium">
      {row.label}
    </span>
  {/if}
</div>
