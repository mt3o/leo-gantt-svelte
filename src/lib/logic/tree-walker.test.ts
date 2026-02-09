import { describe, it, expect } from 'vitest';
import { flattenResources } from './tree-walker';
import type { ResourceGroup } from '../types/gantt';

describe('Tree Walker Logic', () => {
  const mockData: ResourceGroup[] = [{
    id: 'g1',
    label: 'Team Alpha',
    type: 'group',
    children: [
      { id: 'r1', label: 'Developer 1', type: 'row' },
      { id: 'r2', label: 'Developer 2', type: 'row' }
    ]
  }];

  it('should only show group when collapsed', () => {
    const expanded = new Set<string>();
    const result = flattenResources(mockData, expanded);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('g1');
  });

  it('should show children when expanded', () => {
    const expanded = new Set<string>(['g1']);
    const result = flattenResources(mockData, expanded);
    expect(result).toHaveLength(3); // Group + 2 Rows
    expect(result[1].level).toBe(1); // Nested level check
    expect(result[1].parentId).toBe('g1');
  });
});
