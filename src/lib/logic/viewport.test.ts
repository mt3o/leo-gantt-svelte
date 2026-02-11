import { describe, it, expect } from 'vitest';
import { timeToPixel, pixelToTime, calculateZoom } from './viewport';
import {GANTT_THEME} from "$lib/gantt-theme";

describe('Viewport Logic', () => {
  const config = {
    viewStart: new Date('2026-01-01T00:00:00Z'),
    viewEnd: new Date('2026-01-01T10:00:00Z'), // 10 hours
    containerWidth: 1000
  };

  it('correctly maps time to pixels', () => {
    const halfWay = new Date('2026-01-01T05:00:00Z');
    expect(timeToPixel(halfWay, config, GANTT_THEME)).toBe(500);
  });

  it('correctly maps pixels to time', () => {
    const date = pixelToTime(250, config, GANTT_THEME);
    expect(date.toISOString()).toContain('02:30:00');
  });

  it('zooms in centered on a point', () => {
    const result = calculateZoom(500, 0.5, config, GANTT_THEME);
    // Zoom in by 2x: Range should be 5 hours instead of 10
    const duration = result.end.getTime() - result.start.getTime();
    expect(duration).toBe(5 * 60 * 60 * 1000);
    // Center point should still be 05:00:00
    expect(result.start.toISOString()).toContain('02:30:00');
  });
});
