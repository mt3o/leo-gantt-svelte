export const GANTT_THEME = {
  colors: {
    bgPrimary: 'bg-white',
    bgSecondary: 'bg-slate-50',
    border: 'border-slate-200',
    gridLine: '#f1f5f9', // slate-100
    textMuted: 'text-slate-500',
    textPrimary: 'text-slate-700',
    taskDefault: '#3b82f6', // blue-500
    taskHover: '#2563eb',  // blue-600
    dependencyLine: '#94a3b8', // slate-400
    brushFocus: 'rgba(59, 130, 246, 0.1)', // blue-500 with opacity
  },
  dimensions: {
    rowHeight: 40,
    taskHeight: 26,
    sidebarWidth: 260,
    headerHeight: 40,
    navigatorHeight: 50,
    indentSize: 20,
  },
  styles: {
    taskRadius: 4,
    dependencyWidth: 1.5,
  }
} as const;

export type GanttTheme = typeof GANTT_THEME;
