import type { ViewportConfig } from '../types/gantt';
import { timeToPixel } from './viewport';

export interface Tick {
  date: Date;
  x: number;
  label: string;
  isMajor: boolean; // e.g. start of day, week, or month
}

const MIN_TICK_WIDTH_PX = 70; // Minimum space for a label

// Thresholds for switching between granularities, based on pixels per day
const MONTH_THRESHOLD_PX = 15;
const WEEK_THRESHOLD_PX = 30;
const TWO_DAY_THRESHOLD_PX = 50;
const DAY_WIDTH_THRESHOLD_PX = 113; // ~3cm, when to switch to hours

const SUB_DAY_INTERVALS = [
  { ms: 12 * 3600 * 1000 }, { ms: 8 * 3600 * 1000 }, { ms: 6 * 3600 * 1000 },
  { ms: 4 * 3600 * 1000 }, { ms: 2 * 3600 * 1000 }, { ms: 3600 * 1000 },
  { ms: 30 * 60 * 1000 }, { ms: 15 * 60 * 1000 }, { ms: 10 * 60 * 1000 },
  { ms: 5 * 60 * 1000 }, { ms: 60 * 1000 }
];

// Helper to get ISO week number
function getWeekNumber(d: Date): number {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return weekNo;
}

export function generateTicks(config: ViewportConfig): Tick[] {
  const { viewStart, viewEnd } = config;
  const durationMs = viewEnd.getTime() - viewStart.getTime();
  const pixelsPerMs = config.containerWidth / durationMs;
  const pixelsPerDay = pixelsPerMs * 24 * 3600 * 1000;

  const ticks: Tick[] = [];
  let curr = new Date(viewStart);
  curr.setHours(0, 0, 0, 0);

  if (pixelsPerDay < MONTH_THRESHOLD_PX) {
    // --- MONTH ---
    curr.setDate(1);
    if (curr < viewStart) curr.setMonth(curr.getMonth() + 1);
    while (curr < viewEnd) {
      ticks.push({
        date: new Date(curr),
        x: timeToPixel(curr, config),
        label: curr.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        isMajor: true,
      });
      curr.setMonth(curr.getMonth() + 1);
    }
  } else if (pixelsPerDay < WEEK_THRESHOLD_PX) {
    // --- WEEK ---
    curr.setDate(curr.getDate() - curr.getDay()); // Align to Sunday
    if (curr < viewStart) curr.setDate(curr.getDate() + 7);
    while (curr < viewEnd) {
      ticks.push({
        date: new Date(curr),
        x: timeToPixel(curr, config),
        label: `W${getWeekNumber(curr)}`,
        isMajor: true,
      });
      curr.setDate(curr.getDate() + 7);
    }
  } else if (pixelsPerDay < TWO_DAY_THRESHOLD_PX) {
    // --- 2 DAYS ---
    if (curr < viewStart) curr.setDate(curr.getDate() + 1);
    while (curr < viewEnd) {
        ticks.push({
            date: new Date(curr),
            x: timeToPixel(curr, config),
            label: curr.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            isMajor: true
        });
        curr.setDate(curr.getDate() + 2);
    }
  } else if (pixelsPerDay < DAY_WIDTH_THRESHOLD_PX) {
    // --- DAY ---
    if (curr < viewStart) curr.setDate(curr.getDate() + 1);
    while (curr < viewEnd) {
      ticks.push({
        date: new Date(curr),
        x: timeToPixel(curr, config),
        label: curr.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        isMajor: true,
      });
      curr.setDate(curr.getDate() + 1);
    }
  } else {
    // --- HOURS/MINUTES ---
    let intervalMs = 24 * 3600 * 1000;
    for (const interval of SUB_DAY_INTERVALS) {
        if (interval.ms * pixelsPerMs >= MIN_TICK_WIDTH_PX) {
            intervalMs = interval.ms;
        } else {
            break;
        }
    }
    
    let currMs = Math.ceil(viewStart.getTime() / intervalMs) * intervalMs;
    while (currMs < viewEnd.getTime()) {
        const date = new Date(currMs);
        const isStartOfDay = date.getHours() === 0 && date.getMinutes() === 0;
        ticks.push({
            date,
            x: timeToPixel(date, config),
            label: isStartOfDay 
                ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            isMajor: isStartOfDay
        });
        currMs += intervalMs;
    }
  }

  return ticks;
}
