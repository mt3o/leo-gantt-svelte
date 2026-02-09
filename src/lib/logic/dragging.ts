import { pixelToTime, type ViewportConfig } from './viewport';

/**
 * Calculates the new start and end dates based on pixel delta.
 */
export function calculateDragMovement(
  deltaX: number,
  originalStart: Date,
  originalEnd: Date,
  config: ViewportConfig
): { start: Date; end: Date } {
  const totalMs = config.viewEnd.getTime() - config.viewStart.getTime();
  const msPerPixel = totalMs / config.containerWidth;
  const timeOffset = deltaX * msPerPixel;

  return {
    start: new Date(originalStart.getTime() + timeOffset),
    end: new Date(originalEnd.getTime() + timeOffset)
  };
}
