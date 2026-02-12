<script lang="ts">
    import ComponentShowcase from "$lib/demo/ComponentShowcase.svelte";
    import GanttDemo from "$lib/demo/GanttDemo.svelte";
    import HeatmapDemo from "$lib/demo/HeatmapDemo.svelte";
    import HeatmapDemo2 from "$lib/demo/HeatmapDemo2.svelte";

    let activeDemo = $state('showcase');

    const demos = [
        { id: 'showcase', label: 'Component Showcase', component: ComponentShowcase },
        { id: 'gantt', label: 'Standard Gantt', component: GanttDemo },
        { id: 'heatmap', label: 'Heatmap (Blue/Red)', component: HeatmapDemo },
        { id: 'heatmap2', label: 'Heatmap (Green/Yellow)', component: HeatmapDemo2 },
    ];
</script>

<div class="flex flex-col h-screen w-screen overflow-hidden">
    <!-- Navigation Bar -->
    <nav class="bg-slate-800 text-white p-4 flex gap-4 items-center shadow-md z-10">
        <h1 class="text-xl font-bold mr-4">Svelte Gantt Demos</h1>
        {#each demos as demo}
            <button
                class="px-3 py-1 rounded transition-colors"
                class:bg-blue-600={activeDemo === demo.id}
                class:hover:bg-slate-700={activeDemo !== demo.id}
                onclick={() => activeDemo = demo.id}
            >
                {demo.label}
            </button>
        {/each}
    </nav>

    <!-- Active Demo Container -->
    <div class="flex-1 relative overflow-hidden bg-slate-100">
        {#each demos as Demo}
            {#if activeDemo === Demo.id}
                <div class="absolute inset-0 overflow-auto">
                    <Demo.component />
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
    }
</style>
