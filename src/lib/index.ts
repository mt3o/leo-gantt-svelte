import GanttChart from './components/GanttChart.svelte';
import {flattenResources, getTaskProjectionMap} from '$lib/logic/tree-walker';
import {handleWheelZoom} from '$lib/logic/navigation';

import type {
    Task,
    ResourceRow,
    Dependency,
    ResourceGroup,
    FlattenedItem,
    ViewportConfig,
    TaskId,
    RowId,
} from './types/gantt';

import{
    type GanttTheme, GANTT_THEME, GANTT_THEME_DARK
} from '$lib/gantt-theme'

export {
    GanttChart,
    GANTT_THEME, GANTT_THEME_DARK,
    flattenResources, getTaskProjectionMap, handleWheelZoom
}
export type {
    Task,
    ResourceRow,
    Dependency,
    ResourceGroup,
    FlattenedItem,
    ViewportConfig,
    TaskId,
    RowId,
    GanttTheme
};
