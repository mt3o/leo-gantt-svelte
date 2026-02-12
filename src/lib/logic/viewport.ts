import type { ViewportConfig } from '../types/gantt';
import type {GanttTheme} from "$lib/gantt-theme";

/**
 * Maps a Date to a horizontal pixel coordinate within the Gantt chart.
 *
 * @param date The date to convert.
 * @param config The viewport configuration containing start/end dates and container width.
 * @param theme the theming object
 * @returns The horizontal pixel coordinate relative to the container start.
 */
export function timeToPixel(date: Date, config: ViewportConfig, theme: GanttTheme): number {
  if (!date || !config || !theme) return 0;
  const { viewStart, viewEnd } = config;
  if (!viewStart || !viewEnd) return 0;
  const containerWidth = theme.dimensions.containerWidth - theme.dimensions.sidebarWidth;
  const totalMs = viewEnd.getTime() - viewStart.getTime();
  if (totalMs === 0) return 0;
  const dateMs = date.getTime() - viewStart.getTime();

  return (dateMs / totalMs) * containerWidth;
}

/**
 * Maps a horizontal pixel coordinate to a Date.
 * Useful for handling click events or drag interactions on the timeline.
 *
 * @param px The horizontal pixel coordinate.
 * @param config The viewport configuration.
 * @param theme the theming object
 * @returns The date corresponding to the pixel coordinate.
 */
export function pixelToTime(px: number, config: ViewportConfig, theme: GanttTheme): Date {
  if (px === undefined || !config || !theme) return new Date();
  const containerWidth = theme.dimensions.containerWidth - theme.dimensions.sidebarWidth;
  const { viewStart, viewEnd } = config;
  if (!viewStart || !viewEnd) return new Date();
  const totalMs = viewEnd.getTime() - viewStart.getTime();
  if (totalMs === 0) return new Date(viewStart.getTime());
  const timeOffset = (px / containerWidth) * totalMs;

  return new Date(viewStart.getTime() + timeOffset);
}

/**
 * Calculates a new time range based on a zoom factor and a focal point (pixel).
 *
 * @param anchorPx The pixel coordinate of the mouse/focal point.
 * @param zoomFactor The zoom factor (e.g., 1.1 for zooming out, 0.9 for zooming in).
 * @param config The current viewport configuration.
 * @param theme the theming object
 * @returns The new start and end dates for the viewport.
 */
export function calculateZoom(
  anchorPx: number,
  zoomFactor: number,
  config: ViewportConfig,
  theme: GanttTheme,
): { start: Date; end: Date } {
  const anchorTime = pixelToTime(anchorPx, config, theme).getTime();
  const startMs = config.viewStart.getTime();
  const endMs = config.viewEnd.getTime();

  const newStart = anchorTime - (anchorTime - startMs) * zoomFactor;
  const newEnd = anchorTime + (endMs - anchorTime) * zoomFactor;

  return { start: new Date(newStart), end: new Date(newEnd) };
}
