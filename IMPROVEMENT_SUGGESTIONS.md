# Improvement Suggestions Log

A running log of non-urgent suggestions raised during code review — things that
work fine as-is but are worth reconsidering if the surrounding code grows.
Not a task list: nothing here is required reading before shipping. Pull an
item out into a real task (or `FRONTEND_ARCHITECTURE_REVIEW.md`) when it
becomes worth acting on.

| Date | Area | Suggestion | Status |
|------|------|------------|--------|
| 2026-09-08 | `src/features/products/components/ProductForm/ProductImageUpload.tsx` | Component takes 11 props including two raw CSS-class overrides (`previewClassName`/`dropzoneClassName`) just to toggle the 360° badge/border styling. Works today, but if a third image slot is ever added, prefer a `variant: 'main' \| '360'` prop over leaking class names through the component API. | Open |
| 2026-09-09 | `src/features/*/components/*Modal/` | The branch added 6 modals that each hand-roll the same `modal-overlay` → `modal` → `modal-header` + `modal-close` shell. `DeleteCategoryModal` and `DeleteProductModal` are structurally identical (differing only in entity type, title, warning copy and indentation). If a 7th modal appears, extract a shared `<Modal title onClose>` primitive in `components/ui/` and let these render only their body. | Open |
| 2026-09-09 | `src/components/ui/StatTile/` | New `StatTile`/`StatTileGrid` + its own CSS sits alongside the existing `StatCard`, which `FRONTEND_ARCHITECTURE_REVIEW.md` recommends extending rather than duplicating. Decide which is the survivor and fold the other into it before a third stat component appears. | Open |
| 2026-09-09 | `src/features/orders/hooks/useOrders.ts:38-45` | `getOrderStats` re-encodes the backend→display status mapping inline (`shipped`→processing, `paid`→completed) instead of reusing `mapStatusForDisplay` from `orderUtils.ts`, which already owns that exact mapping. Two sources of truth: if the backend adds a status, the badges update and the stat tiles silently don't. It also omits `cancelled` entirely. Reuse `mapStatusForDisplay` and count by `DisplayStatus`. | Open |
| 2026-09-09 | `src/features/admin/utils/userDisplay.ts` | `getUserInitials` duplicates the inline `username.substring(0, 2).toUpperCase()` still written by hand in `UserMenuPopup.tsx:50` and `ProfileDropdown.tsx:66`. The helper is the right home — point the two components at it. (Note: `formatUserDate` is *deliberately* distinct from `formatDate` and already reuses the shared `getRelativeTime`; that one is not duplication.) | Open |
| 2026-09-09 | `src/pages/admin/OrderManagement/OrderManagement.tsx:118-135` | Same error/empty collision that was just fixed in `UserManagement`: the `error` banner and the "No orders found" empty state are siblings, and `orderStore` nulls `orders` on fetch failure — so a failed load tells the admin to adjust their filters. Pre-existing on `main`, left out of the hook-wiring PR deliberately. Apply the same `showLoading`/`showEmpty`/`hasRows` flag shape. | Open |
| 2026-09-09 | `src/pages/admin/ProductManagement/ProductManagement.tsx:15` | The page never destructures `error` from `useProducts` (the hook does expose it), so a products fetch failure surfaces **no** banner at all — the admin just sees "No products found" and no reason why. Pre-existing on `main`. | Open |
