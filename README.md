Markdown
# Svelte 5 High-Performance Gantt Engine

A professional-grade, headless-first Gantt chart component built with **Svelte 5**. Designed for massive datasets (thousands of tasks), deep resource nesting, and fluid time-navigation.

## 🚀 Key Features
- **Virtual 2D Rendering:** Horizontal (Time) and Vertical (Resource) virtualization to keep the DOM lean and the framerate high (60 FPS) even with 5,000+ tasks.
- **Context & Focus Navigation:** An interactive top-level Navigator (mini-map) used for panning and dynamic zooming of the main view.
- **Nested Resource Groups:** Accordion-style resource rows with infinite nesting support and fixed row assignments.
- **Stateless "Dumb" Component:** Fully controlled via props. No internal data state; it reflects the provided state and emits events.
- **Dependency Tracking:** Built-in SVG-based dependency line rendering between tasks.
- **Tailwind CSS Integrated:** Utility-first styling for easy customization of task bars, rows, and grid lines.

## 🛠 Tech Stack
- **Framework:** Svelte 5 (utilizing Runes: `$state`, `$derived`, `$props`).
- **Logic:** TypeScript (pure functional approach).
- **Styling:** Tailwind CSS.
- **Testing:** - **Vitest:** Unit tests for time-math and tree-flattening logic.
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
