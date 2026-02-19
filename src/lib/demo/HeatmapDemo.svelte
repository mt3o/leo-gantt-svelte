<script lang="ts">
  import GanttChart from '$lib/components/GanttChart.svelte';
  import Navigator from '$lib/components/Timeline/Navigator.svelte';
  import { GANTT_THEME } from '$lib/gantt-theme';
  import {type ResourceGroup, type ResourceRow, type Task} from '$lib/types/gantt';
  import { flattenResources } from '$lib/logic/tree-walker';
  import { handleWheelZoom } from '$lib/logic/navigation';

  // --- Data Generation for Heatmap ---
  const totalStart = new Date('2026-01-01T00:00:00');
  const totalEnd = new Date('2026-01-08T00:00:00'); // One week of data

  const rawResources: (ResourceGroup | ResourceRow)[] = [
    { id: 'category-1', label: 'Category A', type: 'group', children: [
      { id: 'sub-cat-1-1', label: 'Sub A1', type: 'row' },
      { id: 'sub-cat-1-2', label: 'Sub A2', type: 'row' },
    ]},
    { id: 'category-2', label: 'Category B', type: 'row' },
    { id: 'category-3', label: 'Category C', type: 'group', children: [
      { id: 'sub-cat-3-1', label: 'Sub C1', type: 'row' },
      { id: 'sub-cat-3-2', label: 'Sub C2', type: 'row' },
      { id: 'sub-cat-3-3', label: 'Sub C3', type: 'row' },
    ]},
  ];

  const _theme = {...GANTT_THEME};

  // Flatten all rows to get all row IDs for task generation
  const allRowsFlat = flattenResources(rawResources, new Set(rawResources.filter(r => r.type === 'group').map(r => r.id))); // Expand all for initial flattening
  const allRowIds = allRowsFlat.map(r => r.id);

  // Generate heatmap values and colors
  const minVal = 0;
  const maxVal = 20;

  function getColorForValue(value: number): string {
    const ratio = (value - minVal) / (maxVal - minVal);
    // Simple gradient from blue (low) to red (high)
    const r = Math.floor(255 * ratio);
    const b = Math.floor(255 * (1 - ratio));
    return `rgb(${r}, 0, ${b})`;
  }

  const heatmapTasks: Task[] = [];
  const intervalMs = 60 * 60 * 1000; // 1 hour intervals

  for (const rowId of allRowIds) {
    let currentIntervalStart = new Date(totalStart);
    while (currentIntervalStart < totalEnd) {
      const currentIntervalEnd = new Date(currentIntervalStart.getTime() + intervalMs);
      const value = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal; // Random value

      heatmapTasks.push({
        id: `${rowId}-${currentIntervalStart.getTime()}`,
        rowId: rowId,
        start: currentIntervalStart,
        end: currentIntervalEnd,
        label: value.toString(),
        color: getColorForValue(value),
      });
      currentIntervalStart = currentIntervalEnd;
    }
  }

  const tasks2 = heatmapTasks.filter((task:Task)=>parseInt(task.label)>3);

  // --- Reactive State (Runes) ---
  let viewStart = $state(new Date('2026-01-01T08:00:00'));
  let viewEnd = $state(new Date('2026-01-01T18:00:00'));
  let scrollTop = $state(0);
  let expandedIds = $state(new Set<string>(rawResources.filter(r => r.type === 'group').map(r => r.id))); // Expand all groups initially

  // --- Derived Logic ---
  const flattenedRows = $derived(flattenResources(rawResources, expandedIds));

  // --- Interaction Handlers ---
  function toggleRow(id: string) {
    if (expandedIds.has(id)) {
      expandedIds.delete(id);
    } else {
      expandedIds.add(id);
    }
    expandedIds = new Set(expandedIds);
  }

  function onWheel(e: WheelEvent) {
    const container = e.currentTarget as HTMLElement;
    const config = { viewStart, viewEnd};
    const nextRange = handleWheelZoom(e, container, config, _theme, totalStart, totalEnd);

    if (nextRange) {
      viewStart = nextRange.start;
      viewEnd = nextRange.end;
    }
  }
</script>

<main class=" w-screen flex flex-col bg-slate-100 overflow-hidden">
    <h1>HeatmapDemo</h1>

      <div
    class="flex-1 p-4"
    onwheel={onWheel}
    role="none"
  >
    <Navigator
    {totalStart}
    {totalEnd}
    {viewStart}
    {viewEnd}
    theme={_theme}
    onRangeChange={(start, end) => {
      viewStart = start;
      viewEnd = end;
    }}
  />

    <GanttChart
      tasks={tasks2}
      rows={flattenedRows}
      dependencies={[]}

      {viewStart}
      {viewEnd}
      {scrollTop}

      theme={_theme}


      onScroll={(top) => scrollTop = top}
      onRowToggle={toggleRow}
      onTaskClick={(id) => console.log('Heatmap cell clicked:', id)}
    />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
</style>
