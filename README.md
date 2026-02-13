# Svelte 5 High-Performance Gantt Engine

A Gantt chart component built with **Svelte 5**. Designed for deep resource nesting, and fluid time-navigation.

## 🚀 Key Features
- **Virtual 2D Rendering:** Horizontal (Time) and Vertical (Resource) virtualization to keep the DOM lean and the framerate high (60 FPS) even with 5,000+ tasks.
- **Context & Focus Navigation:** An interactive top-level Navigator (mini-map) used for panning and dynamic zooming of the main view.
- **Nested Resource Groups:** Accordion-style resource rows with infinite nesting support and fixed row assignments.
- **Stateless "Dumb" Component:** Fully controlled via props. No internal data state; it reflects the provided state and emits events.
- **Dependency Tracking:** Built-in SVG-based dependency line rendering between tasks.
- **Tailwind CSS Integrated:** Utility-first styling for easy customization of task bars, rows, and grid lines.
- **Theming Support:** Fully customizable theme with built-in light and dark modes.

## 🛠 Tech Stack
- **Framework:** Svelte 5 (utilizing Runes: `$state`, `$derived`, `$props`).
- **Logic:** TypeScript (pure functional approach).
- **Styling:** Tailwind CSS.
- **Testing:**
  - **Vitest:** Unit tests for time-math and tree-flattening logic.
  - **Storybook:** Component isolation and visual state testing.
  - **Playwright:** E2E testing for drag/zoom and virtualization performance.

## 🏗 Project Structure
- `src/lib/logic/` – The "Brain": Pure TS functions for date-to-pixel conversion, virtualization offsets, and tree transformations.
- `src/lib/components/` – The "View": Svelte 5 components focused on rendering SVG and HTML structures.
- `src/lib/handlers/` – The "Controllers": A standard library of event handlers for zooming, scrolling, and expanding groups that users can plug into the component.
- `src/lib/types/` – TypeScript interfaces and types.

## 🚦 Getting Started

### Installation
```bash
npm install
```

### Basic Usage

Import the `GanttChart` component and provide the necessary data:

```svelte
<script lang="ts">
  import { GanttChart } from 'svelte-gantt';
  import type { Task, FlattenedItem, Dependency } from 'svelte-gantt';

  let tasks: Task[] = [
    { id: 't1', rowId: 'r1', start: new Date('2024-01-01'), end: new Date('2024-01-05'), label: 'Task 1' }
  ];
  
  let rows: FlattenedItem[] = [
    { id: 'r1', label: 'Row 1', type: 'row', level: 0, parentId: null, isVisible: true }
  ];

  let dependencies: Dependency[] = [];

  let viewStart = new Date('2024-01-01');
  let viewEnd = new Date('2024-01-31');
  let scrollTop = 0;

  function handleScroll(top: number) {
    scrollTop = top;
  }
</script>

<div class="h-[500px] w-full">
  <GanttChart
    {tasks}
    {rows}
    {dependencies}
    {viewStart}
    {viewEnd}
    {scrollTop}
    containerHeight={500}
    containerWidth={800}
    onScroll={handleScroll}
  />
</div>
```

## 🧩 Components

### `GanttChart`

The main component for rendering the Gantt chart.

**Props:**
- `tasks`: Array of `Task` objects.
- `rows`: Array of `FlattenedItem` objects (representing the visible rows).
- `dependencies`: Array of `Dependency` objects.
- `viewStart`: Start date of the visible time range.
- `viewEnd`: End date of the visible time range.
- `scrollTop`: Current vertical scroll position (controlled by parent).
- `selectedTaskId`: ID of the currently selected task (optional).
- `containerHeight`: Height of the chart container in pixels.
- `containerWidth`: Width of the chart container in pixels.
- `rowHeight`: Height of each row in pixels (default: 40).
- `taskHeight`: Height of each task bar in pixels (default: 24).
- `sidebarWidth`: Width of the sidebar in pixels (default: 250).
- `theme`: `GanttTheme` object for styling (optional).

**Callbacks:**
- `onTaskClick(id: string)`: Fired when a task is clicked.
- `onRowToggle(id: string)`: Fired when a group row is toggled (expanded/collapsed).
- `onScroll(top: number)`: Fired when the chart is scrolled vertically.

### `Navigator`

A timeline selector component for zooming and panning.

**Props:**
- `totalStart`: Start date of the entire dataset.
- `totalEnd`: End date of the entire dataset.
- `viewStart`: Start date of the currently visible range.
- `viewEnd`: End date of the currently visible range.
- `containerWidth`: Width of the navigator container.
- `height`: Height of the navigator (default: 40).
- `theme`: `GanttTheme` object for styling (optional).

**Callbacks:**
- `onRangeChange(start: Date, end: Date)`: Fired when the selected time range changes.

## 🎨 Theming

The library supports theming via the `GanttTheme` interface. You can customize colors, dimensions, and styles.

### Built-in Themes

- `GANTT_THEME`: The default light theme.
- `GANTT_THEME_DARK`: A built-in dark theme.

### Custom Theme

You can create a custom theme by extending the default theme or creating a new object that matches the `GanttTheme` interface.

```typescript
import { GANTT_THEME, type GanttTheme } from 'svelte-gantt';

const myTheme: GanttTheme = {
  ...GANTT_THEME,
  colors: {
    ...GANTT_THEME.colors,
    taskDefault: '#ff5733', // Custom task color
    background: 'bg-gray-50',
  }
};
```

Pass the custom theme to the components:

```svelte
<GanttChart theme={myTheme} ... />
<Navigator theme={myTheme} ... />
```

## 📦 Data Structures

### `Task`
```typescript
interface Task {
  id: string;
  rowId: string;
  start: Date;
  end: Date;
  label: string;
  color?: string;
}
```

### `FlattenedItem` (Row)
```typescript
interface FlattenedItem {
  id: string;
  label: string;
  type: 'row' | 'group';
  level: number;
  parentId: string | null;
  isExpanded?: boolean;
  isVisible: boolean;
}
```

### `Dependency`
```typescript
interface Dependency {
  from: string;
  to: string;
}
```
