# Frontend Architecture Review & Improvement Plan

Date: 2026-09-07
Scope: `frontend/src` (React 19 + Vite + TypeScript + Zustand + React Router)

This document records the findings of an architecture review and lays out the
recommended changes **in execution order — smallest/safest first, hardest/most
invasive last** — so the team can ship improvements incrementally without a
big-bang rewrite.

See the conversation/PR description for the full narrative review (what's
good, what's not, ideal structure, data flow). This file is the actionable
checklist.

---

## Guiding principle

The feature-folder structure (`features/<domain>/{api,components,hooks,store,types}`)
is already correct for this app's size. **Do not restructure folders.** The
work below is: remove dead code, finish wiring patterns that already exist in
most places, and split a handful of oversized components. No new layers, no
new abstractions.

---

## Step 1 — Fix the broken filename/import (5 min, do this first)

`src/hooks/useAppNavigation .ts` has a **trailing space in the filename**, and
`src/components/ui/SearchBar/SearchBar.tsx` imports it with the space baked
into the path (`'../../../hooks/useAppNavigation '`). This currently "works"
only because of Windows' lenient path resolution — it is a real risk on the
Linux-based Docker/nginx build this project ships with.

- [x] Rename `useAppNavigation .ts` → `useAppNavigation.ts`
- [x] Fix the import in `SearchBar.tsx`
- [x] Rebuild once (`npm run build`) to confirm

---

## Step 2 — Delete confirmed dead code (10 min)

Verified via repo-wide grep: zero imports anywhere.

- [x] `src/models/` (entire folder — `api.model.ts`, `cart.model.ts`,
      `common.model.ts`, `order.model.ts`, `product.model.ts` — all 0 bytes)
- [x] `src/services/` (entire folder — `authServes.ts`,
      `notificationService.ts`, `storageService.ts`, `validationService.ts` —
      all 0 bytes)
- [x] `src/utils/validators.ts` (0 bytes, unused)
- [x] Stray empty directory `src/components/admin/AdminSidebar.tsx`
      (shadows the real `AdminSidebar/AdminSidebar.tsx` — confusing, unused)

No behavior changes; this is pure cleanup. Good first PR.

---

## Step 3 — De-duplicate small utility logic (30 min)

- [x] `UserManagement.tsx` defines its own local `formatDate` and
      `getRelativeTime`. Move `getRelativeTime` into `utils/formatters.ts`
      (which already has `formatDate`, used elsewhere e.g.
      `OrderManagement.tsx`) and import both from there.

---

## Step 4 — Rewire `UserManagement.tsx` onto the existing store/hook (1–2 hrs)

`features/admin/store/userStore.ts` and `features/admin/hooks/useUsers.ts`
already implement `fetchUsers`, `filterUsers`, `changeRole`, `getStats`,
`error` handling — fully built, currently **unused**. Meanwhile
`pages/admin/UserManagements/UserManagement.tsx` (431 lines, the largest file
in the app) reimplements all of the same logic locally with `useState`.

- [x] Replace the local `users`/`isLoading`/`fetchUsers`/filtering/stats state
      in `UserManagement.tsx` with `useUsers()`
- [x] Delete the now-redundant local implementations
- [x] Confirm role-change flow still works end-to-end (manual test below)

This is the single highest-value fix — it removes ~150 lines of duplicated,
unmaintained logic and makes the page consistent with how `Checkout`/`Login`/
`Register` already consume `useAuth`/`useCheckout`/`useCart`.

---

## Step 5 — Generalize `StatCard` and remove duplicated stat grids (2–3 hrs)

`components/ui/StatCard` exists and is used in exactly one place
(`DashboardStats`). `UserManagement`, `ProductManagement`,
`CategoryManagement`, and `OrderManagement` each hand-roll a near-identical
"stat card grid" (same markup shape, separate CSS).

- [x] Extend `StatCard` (or add a small `StatCardGrid` wrapper) to cover the
      variants needed (icon, value, label, optional active/click state used
      by `UserManagement`'s clickable filter cards)
- [x] Replace the 4 duplicated implementations with the shared component
- [x] Delete the duplicated CSS blocks once replaced

---

## Step 6 — Split the oversized admin page components (half a day, one page at a time)

Do this **one page per PR**, in size order, so each is easy to review:

1. ✅ **Done.** `UserManagement.tsx` (388 → 160 lines) split into:
   - `features/admin/components/UsersTable`
   - `features/admin/components/UserDetailsModal`
   - `features/admin/components/ChangeRoleModal`
   - shared display helpers in `features/admin/utils/userDisplay.ts`
   - page keeps only `useUsers()`, local UI state, and composition
   - CSS deliberately left in `UserManagement.css` (global stylesheet, so
     extracted children still pick it up). Note the duplicated
     `.admin-table` / `.modal-overlay` blocks across all 5 admin
     stylesheets — worth its own step after 6.3.
2. ✅ **Done.** `ProductForm.tsx` (396 lines) split into `ProductForm.tsx` +
   `ProductFormFields.tsx` + an upload piece, with validation extracted to
   `features/products/utils/productFormValidation.ts`.
3. ✅ **Done (CategoryManagement).** `CategoryManagement.tsx` (377 → 262 lines)
   split into `features/categories/components/CategoryTable`,
   `CategoryFormModal`, and `DeleteCategoryModal`; page keeps only store
   calls, local UI state, and composition.
   **Still open: `ProductManagement.tsx` (342)** — same pattern (`Table` +
   `Modal(s)` extracted, page stays thin).
4. `ProductDetails.tsx` (277) / `CategoryForm.tsx` (262) → lower priority,
   revisit only if touched for other reasons.

Acceptance bar for "done" on each: the page component contains fetch/hook
calls, layout composition, and event wiring — no inline table/modal JSX over
~40 lines.

---

## Step 7 — Standardize store-access pattern across admin pages (half a day)

Today `useAuth`/`useCart` wrap their store in a hook (state + orchestration +
navigation). `ProductManagement`/`CategoryManagement`/`OrderManagement` call
their zustand stores directly from the page and do filtering/derived stats
inline with `useMemo`.

Pick one pattern and apply it everywhere — recommended: **introduce thin
hooks** (`useProducts`, `useCategories`, `useOrders`) mirroring `useCart`, so
every admin page follows the same shape as `UserManagement` after Step 4.

- [ ] `useProducts` (wraps `useProductStore`, houses `filterProducts`,
      `getCategoryOptions`)
- [ ] `useCategories` (wraps `useCategoryStore`)
- [ ] `useOrders` (wraps `useOrderStore`, houses status-filter logic already
      in `features/orders/utils/orderUtils.ts` — keep that file, just call it
      from the hook instead of from the page)
- [ ] Update the 3 admin pages to use the new hooks instead of calling the
      store directly

This is the largest, most invasive step — do it last, after the smaller wins
above have already reduced page size and established the target shape.

---

## Step 8 (optional, low urgency) — Route-level code splitting

- [ ] Wrap the `/admin/*` route elements in `AppRoutes.tsx` with
      `React.lazy` + `Suspense` so anonymous/customer users don't load the
      admin bundle on first paint.

Not urgent at current app size, but cheap to add once Step 6/7 have settled
the admin page boundaries.

---

## How to verify nothing broke, after each step

Manual smoke test (no automated frontend tests exist yet in this repo):

1. `npm run dev`, confirm app boots with no console errors.
2. Login as customer → browse Products → add to cart → Checkout → place
   order. Confirm cart/order state clears correctly on logout (tests the
   `useAuth` cross-store reset logic, unaffected by these changes but a good
   regression check).
3. Login as admin → visit Dashboard, Products, Categories, Orders, Users
   admin pages. For whichever page was touched in a given step: confirm list
   loads, search/filter works, and (for Users) role change still updates the
   table and persists after a refresh.
4. `npm run build` to confirm the production TypeScript build still passes
   (this alone would have caught the Step 1 filename issue on a case-sensitive
   filesystem).

---

## Commit

```
docs: add frontend architecture review and improvement plan
```
