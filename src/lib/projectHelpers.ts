import { Project } from '../types';

/**
 * Reorders a project list when an item is dragged and dropped.
 */
export function reorderProjects(projects: Project[], startIndex: number, endIndex: number): Project[] {
  const result = Array.from(projects);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return normalizeDisplayOrder(result);
}

/**
 * Normalizes the display_order of all projects to be sequential (1, 2, 3...).
 * Use this after deleting or moving projects.
 */
export function normalizeDisplayOrder(projects: Project[]): Project[] {
  return projects.map((project, index) => ({
    ...project,
    display_order: index + 1,
  }));
}

/**
 * Moves a project up in the list (decreases its display_order).
 */
export function moveProjectUp(projects: Project[], projectId: string): Project[] {
  const index = projects.findIndex((p) => p.id === projectId);
  if (index <= 0) return projects; // Already at the top
  return reorderProjects(projects, index, index - 1);
}

/**
 * Moves a project down in the list (increases its display_order).
 */
export function moveProjectDown(projects: Project[], projectId: string): Project[] {
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1 || index === projects.length - 1) return projects; // Not found or already at the bottom
  return reorderProjects(projects, index, index + 1);
}
