import {deepMerge} from "$lib/logic/utils";

export interface GanttTheme {
  colors: {
    background: string;
    rowBackground: string;
    taskDefault: string;
    taskText: string;
    gridLine: string;
    dependencyLine: string;
    dependencyLineHighlighted: string;
    navigatorBackground: string;
    navigatorBrush: string;
    navigatorText: string;
    rowHover: string;
    navigatorHandle: string;
    border: string;
    sidebarBackground: string;
    text: string;
    textLight: string;
  };
  styles: {
    taskRadius: string;
  };
  dimensions: {
    sidebarWidth: number;
    rowHeight: number;
    taskHeight: number;
    navigatorHeight: number;
    containerWidth: number,
    containerHeight: number;
  };
  classes: {
    rowText: string;
    taskTextFormatting: string;

  }
}

export const GANTT_THEME: GanttTheme = {
  colors: {
    background: 'bg-white',
    rowBackground: 'bg-white',
    taskDefault: '#3b82f6', // blue-500
    taskText: 'text-white',
    gridLine: 'stroke-slate-100',
    dependencyLine: 'stroke-slate-400 opacity-60',
    dependencyLineHighlighted: 'stroke-blue-500 opacity-100',
    navigatorBackground: 'bg-slate-100',
    navigatorBrush: 'bg-blue-500/10',
    navigatorText: 'text-slate-500',
    rowHover: 'hover:bg-slate-50',
    navigatorHandle: 'bg-blue-500',
    border: '#e2e8f0', // slate-200
    sidebarBackground: '#ffffff', // white
    text: '#1e293b', // slate-800
    textLight: '#64748b', // slate-500
  },
  styles: {
    taskRadius: '4px',
  },
  dimensions: {
    sidebarWidth: 250,
    rowHeight: 40,
    taskHeight: 24,
    navigatorHeight: 40,
    containerWidth: 1200,
    containerHeight: 600,
  },
  classes: {
    rowText: 'text-sm text-slate-700 truncate select-none',
    taskTextFormatting: 'gantt-task-text pbs-[6px] pt-[3px] text-[11px] font-semibold pointer-events-none select-none text-overflow-ellipsis overflow-hidden ',
  }
};

export const GANTT_THEME_DARK: GanttTheme = deepMerge(GANTT_THEME,{
  colors: {
    background: 'bg-slate-900',
    rowBackground: 'bg-slate-800',
    taskDefault: '#60a5fa', // blue-400
    gridLine: 'stroke-slate-700',
    dependencyLine: 'stroke-slate-600 opacity-60',
    dependencyLineHighlighted: 'stroke-blue-400 opacity-100',
    navigatorBackground: 'bg-slate-800',
    navigatorBrush: 'bg-blue-400/10',
    navigatorText: 'text-slate-400',
    rowHover: 'hover:bg-slate-700',
    navigatorHandle: 'bg-blue-200',
    border: '#334155', // slate-700
    sidebarBackground: '#1e293b', // slate-800
    text: '#f1f5f9', // slate-100
    textLight: '#94a3b8', // slate-400
  }
});

export const makeTheme: (input: Partial<GanttTheme>) => GanttTheme = (input) => {
    return deepMerge(GANTT_THEME,input);
}
