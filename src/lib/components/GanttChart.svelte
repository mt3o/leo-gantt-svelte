<script lang="ts">
    import type {Task, FlattenedItem, Dependency, ViewportConfig} from '$lib/types/gantt';
  import { GANTT_THEME, type GanttTheme } from '$lib/gantt-theme';

  // Sub-components
  import TaskBar from './Shapes/TaskBar.svelte';
  import DependencyLines from './Shapes/DependencyLines.svelte';
  import Header from './Grid/Header.svelte';
  import RowsContainer from './Grid/RowsContainer.svelte';
  import {calculateDependencyLines} from "../logic/dependency-math";
  import {timeToPixel} from "$lib/logic/viewport";
  import {getVisibleElements} from "$lib/logic/virtualizer";
  import { generateTicks } from '$lib/logic/ticks';

  interface Props {
    tasks: Task[];
    rows: FlattenedItem[];
    dependencies: Dependency[];

    // Viewport State
    viewStart: Date;
    viewEnd: Date;
    scrollTop: number;

    // Selection
    selectedTaskId?: string | null;

    // Config
    theme?: Partial<GanttTheme>;

    // Actions
    onTaskClick?: (id: string) => void;
    onRowToggle?: (id: string) => void;
    onScroll?: (top: number) => void;
  }

  let {
    tasks = [],
    rows = [],
    dependencies = [],
    viewStart = new Date(),
    viewEnd = new Date(),
    scrollTop = 0,
    selectedTaskId = null,
    theme = {},
    onTaskClick = () => {},
    onRowToggle = () => {},
    onScroll = () => {}
  }:Props = $props();

  const _theme = $derived({...GANTT_THEME, ...theme});

  const rowHeight = $derived(_theme.dimensions.rowHeight);
  const taskHeight = $derived(_theme.dimensions.taskHeight);
  const sidebarWidth = $derived(_theme.dimensions.sidebarWidth);

  // --- Logic ---

  const viewportConfig = $derived<ViewportConfig>({
      viewStart,
      viewEnd
  });

  const virtualData = $derived(
    getVisibleElements(
      tasks,
      rows,
      viewStart,
      viewEnd,
      scrollTop,
      _theme.dimensions.containerHeight,
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

  const allLines = $derived(
    calculateDependencyLines(
      dependencies,
      tasks,
      rowIndexMap,
      viewportConfig,
      rowHeight,
      taskHeight,
      _theme,
    )
  );

  const { normalLines, highlightedLines } = $derived.by(() => {
    if (!selectedTaskId) {
      return { normalLines: allLines, highlightedLines: [] };
    }

    const normal = [];
    const highlighted = [];

    for (const line of allLines) {
      if (line.from === selectedTaskId || line.to === selectedTaskId) {
        highlighted.push(line);
      } else {
        normal.push(line);
      }
    }
    return { normalLines: normal, highlightedLines: highlighted };
  });

  const gridTicks = $derived(viewportConfig && _theme ? generateTicks(viewportConfig, _theme) : []);
  const totalHeight = $derived(rows.length * rowHeight);

  function handleScroll(e: Event) {
    const target = e.currentTarget as HTMLElement;
    onScroll?.(target.scrollTop);
  }
</script>

<div class="flex flex-col border border-slate-200 shadow-sm overflow-hidden"
     class:dark={_theme.colors.background.includes('slate-900')}
     style:height="{_theme.dimensions.containerHeight}px"
     style:width="{_theme.dimensions.containerWidth}px"
>
  <div class="flex" style:margin-left="{sidebarWidth ?? 0}px">
    <Header theme={_theme} viewportConfig={viewportConfig} />
  </div>

  <div
    class="flex flex-1 overflow-y-auto overflow-x-hidden relative"
    onscroll={handleScroll}
  >
    <RowsContainer
      theme={_theme}
      visibleRows={virtualData.visibleRows}
      totalCount={rows.length}
      startIndex={virtualData.startIndex}
      {rowHeight}
      width={sidebarWidth}
      onRowToggle={onRowToggle}
    />

    <div
            class="relative flex-1 shadow-inner"
            class:bg-slate-50={!_theme.colors.background.includes('slate-900')}
            class:bg-slate-800={_theme.colors.background.includes('slate-900')}>
      <svg
        class="absolute top-0 left-0 w-full pointer-events-none"
        style:height="{totalHeight}px"
      >
        <g class="grid-lines">
          <!-- Vertical Grid Lines -->
          {#each gridTicks as tick}
            <line
              x1={tick.x}
              y1="0"
              x2={tick.x}
              y2="100%"
              class={tick.isMajor ? "stroke-slate-300 dark:stroke-slate-700" : "stroke-slate-200 dark:stroke-slate-800"}
              stroke-dasharray={tick.isMajor ? "" : "4 2"}
            />
          {/each}

          <!-- Horizontal Grid Lines -->
          {#each virtualData.visibleRows as _, i}
            {@const y = (virtualData.startIndex + i) * rowHeight}
            <line x1="0" y1={y} x2="100%" y2={y} class="stroke-slate-200 dark:stroke-slate-800" />
          {/each}
        </g>

        <!-- Normal Lines (Below Tasks) -->
        <DependencyLines {theme} lines={normalLines} />

        <g class="tasks-layer pointer-events-auto">
          {#each virtualData.visibleTasks as task (task.id)}
            {@const x = viewportConfig && _theme ? timeToPixel(task.start, viewportConfig, _theme) : 0}
            {@const width = viewportConfig && _theme ? timeToPixel(task.end, viewportConfig, _theme) - x : 0}
            {@const rowIndex = rowIndexMap.get(task.rowId)}

            {#if rowIndex !== undefined}
              {@const y = rowIndex * rowHeight + (rowHeight - taskHeight) / 2}
              <TaskBar
                theme={_theme}
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

        <!-- Highlighted Lines (Above Tasks) -->
        <DependencyLines {theme} lines={highlightedLines} highlighted={true} />
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
