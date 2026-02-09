import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import { userEvent } from '@vitest/browser/context';
import GanttChart from './GanttChart.svelte';

test('renders gantt and handles zoom interaction', async () => {
  const { getByTestId } = render(GanttChart, {
    props: {
      tasks: [], // Pass your mock tasks here
      visibleRange: { start: new Date(), end: new Date() }
    }
  });

  const svg = getByTestId('gantt-svg');
  await expect.element(svg).toBeVisible();

  // In Vitest Browser Mode, we can use userEvent for real interactions
  // Example: Zooming with a wheel event
  await userEvent.fill(svg, '...');

  // Assertions happen in the real browser context
  const task = getByTestId('task-1');
  await expect.element(task).toHaveStyle({ transform: /matrix/ });
});
