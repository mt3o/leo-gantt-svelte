import { calculateZoom, pixelToTime, type ViewportConfig } from './viewport';
import type {GanttTheme} from "$lib/gantt-theme";

/**
 * Handles the logic for zooming via the mouse wheel.
 * Prevents default browser behavior and returns the new time range.
 */
export function handleWheelZoom(
  event: WheelEvent,
  container: HTMLElement,
  config: ViewportConfig,
  theme: GanttTheme,
  minDurationMs = 1000 * 60 * 60, // 1 hour min zoom
  maxDurationMs = 1000 * 60 * 60 * 24 * 365 // 1 year max zoom
): { start: Date; end: Date } | null {
  // Only zoom if Ctrl/Meta is pressed, otherwise let it be a normal scroll
  if (!event.ctrlKey && !event.metaKey) return null;

  const containerWidth = theme.dimensions.containerWidth - theme.dimensions.sidebarWidth

  event.preventDefault();

  const rect = container.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;

  // Sensitivity: adjust the 0.001 to speed up/slow down zoom
  const zoomFactor = 1 + event.deltaY * 0.001;

  const newRange = calculateZoom(offsetX, zoomFactor, config);
  const newDuration = newRange.end.getTime() - newRange.start.getTime();

  // Constrain zoom levels
  if (newDuration < minDurationMs || newDuration > maxDurationMs) {
    return null;
  }

  return newRange;
}

/**
 * Handles horizontal panning (dragging the chart left/right).
 */
export function handlePan(
  deltaX: number,
  config: ViewportConfig
): { start: Date; end: Date } {
  const { viewStart, viewEnd, containerWidth } = config;
  const totalMs = viewEnd.getTime() - viewStart.getTime();

  // Calculate how much time 1 pixel represents
  const msPerPixel = totalMs / containerWidth;
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
