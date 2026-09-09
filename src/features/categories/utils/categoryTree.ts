import type { Category } from '../types/category.types';

/** A category paired with its nesting level in the tree (roots are depth 0). */
export interface FlatCategory {
  category: Category;
  depth: number;
}

/**
 * Flattens the category tree into a pre-order (depth-first) list, tagging each
 * entry with its nesting depth.
 *
 * Depth is what lets callers render indentation — `categoryStore` throws it
 * away for its own `Category[]` needs, but the product form relies on it, so
 * the depth-aware version is the shared one and the store derives from it.
 */
export const flattenCategoryTree = (categories: Category[], depth = 0): FlatCategory[] =>
  categories.reduce<FlatCategory[]>((acc, category) => {
    acc.push({ category, depth });
    if (category.children && category.children.length > 0) {
      acc.push(...flattenCategoryTree(category.children, depth + 1));
    }
    return acc;
  }, []);
