<script lang="ts">
    import GanttChart from '$lib/components/GanttChart.svelte';
    import Navigator from '$lib/components/Timeline/Navigator.svelte';
    import {GANTT_THEME} from '$lib/gantt-theme';

    // Logic & Mock Data
    import {generateResources, getAllRowIds, generateTasks, generateDependencies} from '$lib/logic/mock-data';
    import {flattenResources, getTaskProjectionMap} from '$lib/logic/tree-walker';
    import {handleWheelZoom} from '$lib/logic/navigation';

    // 1. Initial Data Setup (Static)
    const totalStart = new Date('2026-01-01');
    const totalEnd = new Date('2026-06-01'); // 6 months of data

    const rawResources = generateResources(15, 2); // 15 top groups, depth of 2
    const allLeafIds = getAllRowIds(rawResources);
    // Make tasks reactive so updates work
    let mockTasks = $state(generateTasks(allLeafIds, 5, totalStart, totalEnd));
    const mockDeps = generateDependencies(mockTasks, 40);

    // 2. Reactive State (Runes)
    let viewStart = $state(new Date('2026-01-01'));
    let viewEnd = $state(new Date('2026-01-15'));
    let scrollTop = $state(0);
    let expandedIds = $state(new Set<string>([rawResources[0].id])); // Start with first group open

    let selectedTaskId = $state<string | null>(null);

    // 3. Derived Logic
    // This automatically re-flattens whenever expandedIds changes
    const flattenedRows = $derived(flattenResources(rawResources, expandedIds));

    const projectionMap = $derived(getTaskProjectionMap(rawResources, expandedIds));

    const projectedTasks = $derived(mockTasks.map(task => {
        const projection = projectionMap.get(task.rowId);
        if (projection) {
            return {
                ...task,
                rowId: projection.targetId,
                label: projection.label,
                color: '#cbd5e1' // slate-300 to indicate grouped state
            };
        }
        return task;
    }));

    const _theme = {...GANTT_THEME, colors: {...GANTT_THEME.colors, rowBackground: '#fff'}};
    ;

    // 4. Interaction Handlers
    function toggleRow(id: string) {
        if (expandedIds.has(id)) {
            expandedIds.delete(id);
        } else {
            expandedIds.add(id);
        }
        // Svelte 5 needs a re-assignment or a method that triggers reactivity for Sets
        expandedIds = new Set(expandedIds);
    }

    function onWheel(e: WheelEvent) {
        const container = e.currentTarget as HTMLElement;
        const config = {viewStart, viewEnd};
        const nextRange = handleWheelZoom(e, container, config, _theme, totalStart, totalEnd);

        if (nextRange) {
            viewStart = nextRange.start;
            viewEnd = nextRange.end;
        }
    }


    function updateTaskDates(id: string, start: Date, end: Date) {
        const index = mockTasks.findIndex(t => t.id === id);
        if (index !== -1) {
            mockTasks[index] = {...mockTasks[index], start, end};
        }
    }

    function handleTaskClick(id: string) {
        if (selectedTaskId === id) {
            selectedTaskId = null;
        } else {
            selectedTaskId = id;
        }
        console.log('Task clicked:', id);
    }

</script>

<main class="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden">

<h1>Gantt demo</h1>
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
                theme={_theme}
                tasks={projectedTasks}
                rows={flattenedRows}
                dependencies={mockDeps}

                {viewStart}
                {viewEnd}
                {scrollTop}
                {selectedTaskId}

                onScroll={(top) => scrollTop = top}
                onRowToggle={toggleRow}
                onTaskClick={handleTaskClick}
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
