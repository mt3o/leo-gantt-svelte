import { calculateZoom } from './viewport';
import type {GanttTheme} from "$lib/gantt-theme";
import type {ViewportConfig} from "$lib/types/gantt";

/**
 * Handles the logic for zooming via the mouse wheel.
 * Prevents default browser behavior and returns the new time range.
 */
export function handleWheelZoom(
  event: WheelEvent,
  container: HTMLElement,
  config: ViewportConfig,
  theme: GanttTheme,
  totalStart: Date,
  totalEnd: Date,
  minDurationMs = 1000 * 60 * 60, // 1 hour min zoom
  maxDurationMs = 1000 * 60 * 60 * 24 * 365 * 10, // 10 years max zoom
): { start: Date; end: Date } | null {
  // Only zoom if Ctrl/Meta is pressed, otherwise let it be a normal scroll
  if (!event.ctrlKey && !event.metaKey) return null;

  event.preventDefault();

  const rect = container.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;

  // Sensitivity: adjust the 0.001 to speed up/slow down zoom
  const zoomFactor = 1 + event.deltaY * 0.001;

  let { start, end } = calculateZoom(offsetX, zoomFactor, config, theme);
  const newDuration = end.getTime() - start.getTime();

  // Constrain zoom levels
  if (newDuration < minDurationMs || newDuration > maxDurationMs) {
    return null;
  }

  // Check if new duration exceeds total project duration
  const totalDuration = totalEnd.getTime() - totalStart.getTime();
  if (newDuration > totalDuration) {
      return { start: totalStart, end: totalEnd };
  }
  
  // Clamp to total project boundaries
  const duration = end.getTime() - start.getTime();
  if (start < totalStart) {
    start = totalStart;
    end = new Date(start.getTime() + duration);
  }
  if (end > totalEnd) {
    end = totalEnd;
    start = new Date(end.getTime() - duration);
  }
  
  // Final check to ensure start is not after end
  if (start > end) {
    start = totalStart;
    end = totalEnd;
  }

  return { start, end };
}

/**
 * Handles horizontal panning (dragging the chart left/right).
 */
export function handlePan(
  deltaX: number,
  config: ViewportConfig,
  theme: GanttTheme
): { start: Date; end: Date } {
  const { viewStart, viewEnd } = config;
  const totalMs = viewEnd.getTime() - viewStart.getTime();

  // Calculate how much time 1 pixel represents
  const msPerPixel = totalMs / theme.dimensions.containerWidth;
  const timeOffset = deltaX * msPerPixel;

  return {
    start: new Date(viewStart.getTime() + timeOffset),
    end: new Date(viewEnd.getTime() + timeOffset)
  };
}

/**
 * Updates the vertical scroll position.
 */
export function handleVerticalScroll(
  scrollTop: number,
  maxScroll: number
): number {
  return Math.max(0, Math.min(scrollTop, maxScroll));
}
