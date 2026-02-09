# Agent Instructions: High-Performance Gantt Engine

## Core Tech Stack
- **Framework:** Svelte 5 (strictly using Runes: `$state`, `$derived`, `$props`, `$effect`).
- **Styling:** Tailwind CSS (utility-first).
- **Logic Testing:** Vitest (pure functions).
- **UI Testing:** Storybook & Playwright.

## Architectural Constraints (Non-Negotiable)
1. **Stateless UI:** The Gantt component is a "Controlled Component". It does not own the source of truth for tasks or resources. It reflects props and emits events.
2. **Virtualization:** - Implement **2D Virtualization** (X-axis for time, Y-axis for rows).
   - Only tasks and rows intersecting the viewport should exist in the DOM.
   - Use a flattened array representation of the resource tree for O(1) row access during rendering.
3. **Memory Management:**
   - Use `WeakMap` to cache SVG element coordinates for dependency lines.
   - Clean up `$effect` subscriptions and event listeners to prevent leaks when handling thousands of tasks.
4. **Logic Isolation:**
   - All math (date-to-pixel, tree-flattening, collision detection) must live in `src/lib/logic/`.
   - Logic files must be framework-agnostic (pure TypeScript).

## Component Guidelines
- **SVG over Canvas:** Use SVG for the main chart to leverage Svelte's reactivity and CSS styling, but keep the DOM tree lean via virtualization.
- **Runes Pattern:** Use `$derived` for heavy filtering/mapping of tasks to ensure they only re-run when viewport or data changes.
- **Event Pattern:** Provide a `handlers/` library so users can opt-in to default behaviors for zooming, scrolling, and toggling groups.

## Development Workflow
1. Update `src/lib/logic/` and write Vitest tests.
2. Create/Update Storybook stories for visual edge cases.
3. Implement the Svelte component UI.
4. Verify with Playwright for drag/zoom interactions.
