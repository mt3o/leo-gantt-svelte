import type { ResourceGroup, ResourceRow, FlattenedItem, RowId } from '../types/gantt';

/**
 * Flattens a nested resource structure into a linear list for rendering.
 * Only children of expanded groups are marked as isVisible.
 */
export function flattenResources(
  resources: (ResourceGroup | ResourceRow)[],
  expandedIds: Set<RowId>,
  level = 0,
  parentId: RowId | null = null
): FlattenedItem[] {
  let result: FlattenedItem[] = [];

  for (const item of resources) {
    const isExpanded = item.type === 'group' ? expandedIds.has(item.id) : undefined;

    const flatItem: FlattenedItem = {
      id: item.id,
      label: item.label,
      type: item.type,
      level,
      parentId,
      isExpanded,
      isVisible: true // Initial visibility; parent logic handles filtering
    };

    result.push(flatItem);

    if (item.type === 'group' && item.children && isExpanded) {
      result = [
        ...result,
        ...flattenResources(item.children, expandedIds, level + 1, item.id)
      ];
    }
  }

  return result;
}

export interface Projection {
  targetId: RowId;
  label: string;
}

/**
 * Builds a map of RowId -> Visible Ancestor Info.
 * Used to project tasks from hidden rows onto their collapsed group headers.
 */
export function getTaskProjectionMap(
  resources: (ResourceGroup | ResourceRow)[],
  expandedIds: Set<RowId>,
  map = new Map<RowId, Projection>(),
  ancestor: { id: RowId, label: string } | null = null
): Map<RowId, Projection> {
  for (const item of resources) {
    if (ancestor) {
      // Hidden by ancestor
      map.set(item.id, { targetId: ancestor.id, label: ancestor.label });
      
      // Recurse with same ancestor
      if (item.type === 'group' && item.children) {
        getTaskProjectionMap(item.children, expandedIds, map, ancestor);
      }
    } else {
      // Visible
      let nextAncestor = null;
      if (item.type === 'group' && !expandedIds.has(item.id)) {
        // Collapsed group -> becomes ancestor for children
        nextAncestor = { id: item.id, label: item.label };
      }
      
      if (item.type === 'group' && item.children) {
        getTaskProjectionMap(item.children, expandedIds, map, nextAncestor);
      }
    }
  }
  return map;
}
