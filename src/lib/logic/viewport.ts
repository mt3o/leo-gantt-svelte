import type {GanttTheme} from "$lib/gantt-theme";


export interface ViewportConfig {
  viewStart: Date;
  viewEnd: Date;
}

/**
 * Maps a Date to a horizontal pixel coordinate.
 */
export function timeToPixel(date: Date, config: ViewportConfig, theme: GanttTheme): number {
  const { viewStart, viewEnd } = config;
  const containerWidth = theme.dimensions.containerWidth - theme.dimensions.sidebarWidth;
  const totalMs = viewEnd.getTime() - viewStart.getTime();
  const dateMs = date.getTime() - viewStart.getTime();

  return (dateMs / totalMs) * containerWidth;
}

/**
 * Maps a horizontal pixel coordinate to a Date (useful for zooming/seeking).
 */
export function pixelToTime(px: number, config: ViewportConfig, theme: GanttTheme): Date {
  const containerWidth = theme.dimensions.containerWidth - theme.dimensions.sidebarWidth;
    const { viewStart, viewEnd } = config;
  const totalMs = viewEnd.getTime() - viewStart.getTime();
  const timeOffset = (px / containerWidth) * totalMs;

  return new Date(viewStart.getTime() + timeOffset);
}

/**
 * Calculates a new time range based on a zoom factor and a focal point (pixel).
 * factor > 1 zooms out, factor < 1 zooms in.
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
