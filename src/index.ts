import GanttChart from '$lib/components/GanttChart.svelte';
import Navigator from '$lib/components/Timeline/Navigator.svelte';
import Row from '$lib/components/Grid/Row.svelte';
import RowsContainer from '$lib/components/Grid/RowsContainer.svelte';
import Header from '$lib/components/Grid/Header.svelte';
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
} from '$lib/types/gantt';

import{
    type GanttTheme, GANTT_THEME, GANTT_THEME_DARK
} from '$lib/gantt-theme'

export {
    GanttChart,
    Row,
    RowsContainer,
    Header,
    Navigator,
    GANTT_THEME, GANTT_THEME_DARK,
    flattenResources, getTaskProjectionMap, handleWheelZoom
}
export type {
    FlattenedItem,
    ResourceGroup,
    Dependency,
    ResourceRow,
    Task,
    ViewportConfig,
    TaskId,
    RowId,
    GanttTheme
};
