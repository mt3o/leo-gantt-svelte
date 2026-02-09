<script lang="ts">
  import type { Task, FlattenedItem, Dependency } from '$lib/types/gantt';

  // Sub-components
  import TaskBar from './Shapes/TaskBar.svelte';
  import DependencyLines from './Shapes/DependencyLines.svelte';
  import Header from './Grid/Header.svelte';
  import RowsContainer from './Grid/RowsContainer.svelte';
  import {calculateDependencyLines} from "../logic/dependency-math";
  import {timeToPixel} from "$lib/logic/viewport";
  import {getVisibleElements} from "$lib/logic/virtualizer";

  interface Props {
    tasks: Task[];
    rows: FlattenedItem[];
    dependencies: Dependency[];

    // Viewport State
    viewStart: Date;
    viewEnd: Date;
    scrollTop: number;

    // Config
    containerHeight: number;
    containerWidth: number;
    rowHeight?: number;
    taskHeight?: number;
    sidebarWidth?: number;

    // Actions
    onTaskClick?: (id: string) => void;
    onRowToggle?: (id: string) => void;
    onScroll?: (top: number) => void;
  }

  let {
    tasks = [],
    rows = [],
    dependencies = [],
    viewStart,
    viewEnd,
    scrollTop,
    containerHeight,
    containerWidth,
    rowHeight = 40,
    taskHeight = 24,
    sidebarWidth = 250,
    onTaskClick,
    onRowToggle,
    onScroll
  }:Props = $props();

  // --- Logic ---

  const viewportConfig = $derived({ viewStart, viewEnd, containerWidth: containerWidth - sidebarWidth });

  const virtualData = $derived(
    getVisibleElements(
      tasks,
      rows,
      viewStart,
      viewEnd,
      scrollTop,
      containerHeight,
      rowHeight
    )
  );

  // Map of rowId -> global index
  const rowIndexMap = $derived.by(() => {
    const map = new Map<string, number>();
    rows.forEach((row, index) => {
      map.set(row.id, index);
    });
    return map;
  });

  const lines = $derived(
    calculateDependencyLines(
      dependencies,
      tasks,
      rowIndexMap,
      viewportConfig,
      rowHeight,
      taskHeight
    )
  );

  const gridTicks = $derived.by(() => {
    const { viewStart, viewEnd } = viewportConfig;
    const ticks: number[] = [];
    const curr = new Date(viewStart);
    curr.setHours(0, 0, 0, 0);

    while (curr < viewEnd) {
      ticks.push(timeToPixel(curr, viewportConfig));
      curr.setDate(curr.getDate() + 1);
    }
    return ticks;
  });

  function handleScroll(e: Event) {
    const target = e.currentTarget as HTMLElement;
    onScroll?.(target.scrollTop);
  }
</script>

<div class="flex flex-col border border-slate-200 bg-white shadow-sm overflow-hidden"
     style:height="{containerHeight}px"
     style:width="{containerWidth}px">

  <div class="flex" style:margin-left="{sidebarWidth}px">
    <Header config={viewportConfig} />
  </div>

  <div
    class="flex flex-1 overflow-y-auto overflow-x-hidden relative"
    onscroll={handleScroll}
  >
    <RowsContainer
      visibleRows={virtualData.visibleRows}
      totalCount={rows.length}
      startIndex={virtualData.startIndex}
      {rowHeight}
      width={sidebarWidth}
      onRowToggle={onRowToggle}
    />

    <div class="relative flex-1 bg-slate-50 shadow-inner">
      <div style:height="{rows.length * rowHeight}px" class="w-full"></div>

      <svg
        class="absolute top-0 left-0 w-full h-full pointer-events-none"
        style:transform="translateY(0)"
      >
        <g class="grid-lines">
          <!-- Vertical Grid Lines -->
          {#each gridTicks as x}
            <line x1={x} y1="0" x2={x} y2="100%" class="stroke-slate-200" stroke-dasharray="4 2" />
          {/each}

          <!-- Horizontal Grid Lines -->
          {#each virtualData.visibleRows as _, i}
            {@const y = (virtualData.startIndex + i) * rowHeight}
            <line x1="0" y1={y} x2="100%" y2={y} class="stroke-slate-200" />
          {/each}
        </g>

        <DependencyLines {lines} />

        <g class="tasks-layer pointer-events-auto">
          {#each virtualData.visibleTasks as task (task.id)}
            {@const x = timeToPixel(task.start, viewportConfig)}
            {@const width = timeToPixel(task.end, viewportConfig) - x}
            {@const rowIndex = rowIndexMap.get(task.rowId)}

            {#if rowIndex !== undefined}
              {@const y = rowIndex * rowHeight + (rowHeight - taskHeight) / 2}
              <TaskBar
                {task}
                {x}
                {y}
                {width}
                height={taskHeight}
                onclick={onTaskClick}
              />
            {/if}
          {/each}
        </g>
      </svg>
    </div>
  </div>
</div>

<style>
  svg {
    /* geometricPrecision is critical for clean dependency lines when zooming */
    shape-rendering: geometricPrecision;
    will-change: transform;
  }

  /* Hide scrollbar for the sidebar to sync with main scroll */
  :global(.no-scrollbar::-webkit-scrollbar) {
    display: none;
  }
</style>
