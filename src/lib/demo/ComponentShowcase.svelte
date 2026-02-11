<script lang="ts">
    import TaskBar from '$lib/components/Shapes/TaskBar.svelte';
    import Row from '$lib/components/Grid/Row.svelte';
    import Navigator from '$lib/components/Timeline/Navigator.svelte';
    import Header from '$lib/components/Grid/Header.svelte';
    import {GANTT_THEME, GANTT_THEME_DARK} from '$lib/gantt-theme';
    import type {Task, FlattenedItem, ViewportConfig} from '$lib/types/gantt';
    import DatePicker from "$lib/demo/DatePicker.svelte";

    // --- TaskBar Demo State ---
    let taskWidth = $state(200);
    let taskLabel = $state('Demo Task');
    let taskColor = $state('#3b82f6');
    let taskTextColor = $state('#fff');
    let isDarkTheme = $state(false);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const demoTask = $derived<Task>({
        id: 'demo-task',
        rowId: 'demo-row',
        start: new Date(),
        end: new Date(),
        label: taskLabel,
        color: taskColor,
        textColor: taskTextColor,
    });

    const currentTheme = $derived(isDarkTheme ? GANTT_THEME_DARK : GANTT_THEME);

    // --- Row Demo State ---
    let rowLabel = $state('Demo Row');
    let rowLevel = $state(0);
    let isGroup = $state(false);
    let isExpanded = $state(false);

    const demoRow = $derived<FlattenedItem>({
        id: 'demo-row',
        label: rowLabel,
        type: isGroup ? 'group' : 'row',
        level: rowLevel,
        parentId: null,
        isExpanded: isGroup ? isExpanded : undefined,
        isVisible: true
    });

    // --- Navigator Demo State ---
    let navTotalStart = $state(new Date('2024-02-01'));
    let navViewStart = $state(new Date('2024-03-01'));
    let navViewEnd = $state(new Date('2024-05-01'));
    let navTotalEnd = $state(new Date('2025-02-01'));

    // --- Header Demo State ---
    let headerZoom = $state(1); // 1 = default, 0.1 = zoomed in, 10 = zoomed out

    const headerConfig = $derived<ViewportConfig>({
        viewStart: new Date('2024-01-01'),
        viewEnd: new Date(new Date('2024-01-01').getTime() + (15 * 24 * 60 * 60 * 1000 * headerZoom)),
    });

</script>

<div class="p-8 space-y-12" class:dark={isDarkTheme} class:bg-slate-900={isDarkTheme} class:text-white={isDarkTheme}>

    <div class="flex justify-between items-center border-b pb-4" class:border-slate-700={isDarkTheme}>
        <h1 class="text-2xl font-bold">Component Showcase</h1>
        <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" bind:checked={isDarkTheme} class="w-4 h-4"/>
            <span>Dark Mode</span>
        </label>
    </div>

    <!-- TaskBar Demo -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold">TaskBar</h2>
        <div class="flex gap-8">
            <div class="w-64 space-y-4 p-4 border rounded" class:border-slate-700={isDarkTheme}>
                <label class="block">
                    <span class="text-sm opacity-70">Width (px)</span>
                    <input type="range" min="20" max="400" bind:value={taskWidth} class="w-full"/>
                </label>
                <label class="block">
                    <span class="text-sm opacity-70">Label</span>
                    <input type="text" bind:value={taskLabel} class="w-full px-2 py-1 border rounded bg-transparent"
                           class:border-slate-600={isDarkTheme}/>
                </label>
                <label class="block">
                    <span class="text-sm opacity-70">Color</span>
                    <input type="color" bind:value={taskColor} class="w-full h-8"/>
                </label>
                <label class="block">
                    <span class="text-sm opacity-70">Text color</span>
                    <input type="color" bind:value={taskTextColor} class="w-full h-8"/>
                </label>
            </div>

            <div class="flex-1 flex items-center justify-center border rounded bg-slate-50 dark:bg-slate-800 p-8">
                <svg width="500" height="60">
                    <TaskBar
                            task={demoTask}
                            x={50}
                            y={18}
                            width={taskWidth}
                            height={24}
                            theme={currentTheme}
                            onclick={() => alert('Task clicked!')}
                    />
                </svg>
            </div>
        </div>
    </section>

    <!-- Row Demo -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold">Row</h2>
        <div class="flex gap-8">
            <div class="w-64 space-y-4 p-4 border rounded" class:border-slate-700={isDarkTheme}>
                <label class="block">
                    <span class="text-sm opacity-70">Label</span>
                    <input type="text" bind:value={rowLabel} class="w-full px-2 py-1 border rounded bg-transparent"
                           class:border-slate-600={isDarkTheme}/>
                </label>
                <label class="block">
                    <span class="text-sm opacity-70">Level: {rowLevel}</span>
                    <input type="range" min="0" max="5" bind:value={rowLevel} class="w-full"/>
                </label>
                <label class="flex items-center gap-2">
                    <input type="checkbox" bind:checked={isGroup}/>
                    <span>Is Group</span>
                </label>
                {#if isGroup}
                    <label class="flex items-center gap-2">
                        <input type="checkbox" bind:checked={isExpanded}/>
                        <span>Expanded</span>
                    </label>
                {/if}
            </div>

            <div class="flex-1 border rounded overflow-hidden">
                <Row
                        row={demoRow}
                        height={40}
                        theme={currentTheme}
                        onToggle={() => isExpanded = !isExpanded}
                />
            </div>
        </div>
    </section>

    <!-- Navigator Demo -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold">Navigator</h2>
        <div class="flex gap-8">
            <div class="w-64 space-y-4 p-4 border rounded" class:border-slate-700={isDarkTheme}>
                <div class="text-sm">


                    <p>total start: {formatDate(navTotalStart)}</p>
                    <p>total end: {formatDate(navTotalEnd)}</p>
                    <p>view start: {formatDate(navViewStart)}</p>
                    <p>view end: {formatDate(navViewEnd)}</p>

                    <p><b>Change the dates:</b></p>

                    <p>Total Start:

                        <DatePicker
                                bind:value={navTotalStart}
                                max={navViewStart}
                        />
                    </p>
                    <p>Total End:
                        <DatePicker
                                bind:value={navTotalEnd}
                                min={navViewEnd}
                        />
                    </p>
                    <p><i>Total start can't be later than selection start, total end can't be earlier than selection
                        end!</i></p>
                    <p>Selection Start: {navViewStart.toLocaleDateString()}</p>
                    <p>Selection End: {navViewEnd.toLocaleDateString()}</p>
                </div>
            </div>

            <div class="flex-1 border rounded p-4 bg-white dark:bg-slate-900">
                <Navigator
                        totalStart={navTotalStart}
                        totalEnd={navTotalEnd}
                        viewStart={navViewStart}
                        viewEnd={navViewEnd}
                        theme={currentTheme}
                        onRangeChange={(s, e) => {
            navViewStart = s;
            navViewEnd = e;
          }}
                />
            </div>
        </div>
    </section>

      <!-- Header Demo -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold">Header (Adaptive Ticks)</h2>
        <div class="flex gap-8">
          <div class="w-64 space-y-4 p-4 border rounded" class:border-slate-700={isDarkTheme}>
            <label class="block">
              <span class="text-sm opacity-70">Zoom Level (Time Span)</span>
              <input type="range" min="0.1" max="10" step="0.1" bind:value={headerZoom} class="w-full" />
              <div class="text-xs mt-1 text-slate-500">
                Left: Zoom In <br/> Right: Zoom Out
                  <p>hours, days, weeks, months</p>
              </div>
            </label>
          </div>


          <div class="flex-1 border rounded overflow-hidden">
            <Header
              viewportConfig={headerConfig}
              theme={currentTheme}
            />
          </div>
        </div>
      </section>

</div>
