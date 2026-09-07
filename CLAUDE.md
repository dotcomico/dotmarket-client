# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server at http://localhost:5173 (proxies /api and /uploads to http://localhost:3000)
npm run build    # tsc -b && vite build — always run this before considering a task done
npm run lint     # ESLint (flat config, eslint.config.js)
npm run preview  # Preview the production build
```

There is no test runner configured in this repo (no unit/e2e tests exist yet). Verification is manual — see `FRONTEND_ARCHITECTURE_REVIEW.md` for the standard smoke-test flow (login as customer → browse → cart → checkout; login as admin → walk each admin page).

The backend API must be running at `http://localhost:3000` for `npm run dev` to work (Vite proxies `/api` and `/uploads` there — see `vite.config.ts`).

## Architecture

React 19 + TypeScript + Vite SPA, feature-folder structure. **Do not restructure folders** — the shape below is intentional for this app's size; extend it, don't replace it.

```
src/
├── api/              # axios instance (JWT interceptor, 401 → redirect to /login) + endpoint constants
├── components/
│   ├── layouts/       # AppLayout (Header/Footer/Sidebar) and AdminLayout — wrap routes via <Outlet/>
│   ├── admin/          # Admin-only chrome (AdminHeader, AdminSidebar, RefreshButton)
│   └── ui/             # Generic shared components (StatCard, SearchBar, QuantitySelector, ThemeToggle, UserMenuPopup)
├── features/<domain>/  # auth, cart, categories, orders, products, admin, profile
│   ├── api/            # feature-specific axios calls, built on api/axiosInstance
│   ├── components/     # feature-specific components
│   ├── hooks/          # thin hook wrapping the domain's zustand store (see Store pattern below)
│   ├── types/           # domain types
│   └── index.ts         # public exports — import from the feature's index, not deep paths, where one exists
├── store/              # top-level zustand stores: authStore, cartStore, orderStore, uiStore
├── pages/               # route-level components, composed from features/components
├── routes/              # AppRoutes.tsx, paths.ts (PATHS constant), ProtectedRoute, AdminRoute
├── hooks/                # cross-domain hooks (useTheme, useToast, useLocalStorage, ...)
├── utils/, types/, styles/, constants/
```

### Data flow / store pattern

State lives in zustand stores (`src/store/*` for app-wide concerns like auth/cart/orders/ui, `src/features/<domain>/store` or `src/features/<domain>/*Store.ts` for domain-local state e.g. `categoryStore`, `productStore`, `userStore`). Stores hold state + raw setters; a matching `use<Domain>` hook in `features/<domain>/hooks/` wraps the store and adds orchestration (validation, derived values, side effects) — see `features/cart/hooks/useCart.ts` for the reference shape. **Pages and components should consume the hook, not the store directly.** Not every feature has finished this wiring yet — some admin pages still call the store directly or duplicate logic locally with `useState`; when touching one of those pages, prefer wiring it onto the existing store/hook over adding more local state (see `FRONTEND_ARCHITECTURE_REVIEW.md` for the specific known cases).

`authStore` (`src/store/authStore.ts`) is persisted to localStorage (key `auth-storage`) via zustand's `persist` middleware and holds `token`/`user`/`isAuthenticated`. It is the source of truth read by both route guards.

### Routing & auth guards

Routes are declared in `src/routes/AppRoutes.tsx` using `PATHS` from `src/routes/paths.ts` (never hardcode route strings). Three tiers:
- Public routes — no wrapper.
- `ProtectedRoute` — any authenticated user; redirects to `/login` with `state.from` for post-login redirect.
- `AdminRoute` — authenticated **and** `user.role !== 'customer'` (i.e. admin/manager); wraps its children in `AdminLayout`. Customers are redirected home, not to login.

### API layer

`src/api/axiosInstance.ts` is the single axios instance: injects `Authorization: Bearer <token>` from `localStorage.getItem('token')` on every request, and on a `401` response clears the token and hard-redirects to `/login`. Feature API modules (`features/<domain>/api/*.ts`) import this instance rather than creating their own. Endpoint paths and misc config live in `src/api/apiConfig.ts` (`API_ENDPOINTS`, `API_BASE_URL`, `API_TIMEOUT`).

Note: the JWT is read from `localStorage` directly in the axios interceptor, while `authStore`'s `persist` middleware separately persists auth state under `auth-storage` — these are two separate localStorage writes kept in sync by the auth flow; be careful not to update one without the other when touching login/logout.

## Engineering standards

Hold this codebase to production-quality frontend standards, not just "it renders":

- **Data flow discipline**: Page → feature component → hook/feature logic → API client/store → backend. Keep API calls and business/validation logic out of presentation components; push them into the feature's `hooks/`/`api/` layer described above. Don't add raw `axios`/`fetch` calls inside components.
- **Component boundaries**: split by responsibility (a component doing fetching + validation + formatting + navigation all at once should be split), not by line count. Don't extract one-off abstractions for something used in a single place.
- **State**: keep local UI state local (`useState`), don't lift things to a zustand store unless multiple features need it, and don't store values in state that can be derived from existing state/props on render.
- **TypeScript**: no `any` without a clear justification comment; give props, API request/response shapes, and store state explicit types (`features/<domain>/types/`). When an API contract changes, grep for all consumers before editing the type.
- **Forms/errors**: cover loading, success, empty, and error states for every async UI — this repo has no skeleton/spinner convention yet, so match whatever the nearest existing page/feature already does rather than inventing a new pattern. Don't surface raw backend error bodies to users.
- **Accessibility**: prefer native elements (`button`, `label`, `dialog`) over `div`-with-`onClick`; give form errors and modals proper labels/focus handling. This repo doesn't currently have strong a11y coverage — improve it opportunistically in code you touch rather than as a separate pass.
- **Security**: the backend is the real authorization boundary — `ProtectedRoute`/`AdminRoute` are UX guards, not security. Never trust client-side role checks alone, never put secrets in frontend code/env vars committed to the repo (see `.env`), and be deliberate about any `dangerouslySetInnerHTML`/raw HTML rendering of user content.
- **Performance**: don't reach for `memo`/`useMemo`/`useCallback` by default — this codebase mostly doesn't, and that's fine at its current size; only add memoization where a real re-render cost is identified.
- **Dependencies**: this project intentionally has a small dependency list (axios, react-router, zustand). Check whether an existing pattern already solves the problem before adding a new package.
- **Tests**: none exist yet. When adding meaningfully complex logic (checkout, auth, role-based access, form validation), prefer writing it in a way that's testable (pure functions/hooks) even without wiring up a test runner now, and flag to the user if introducing a real test setup would be worth doing.

## Known issues to be aware of

`FRONTEND_ARCHITECTURE_REVIEW.md` (dated 2026-09-07) is a live, prioritized cleanup checklist for this codebase — check it before large refactors in `src/`, since it documents dead code (`src/models/`, `src/services/`, `src/utils/validators.ts` are all empty/unused) and oversized components (`UserManagement.tsx`, `ProductForm.tsx`) that are mid-refactor. Notably `src/hooks/useAppNavigation .ts` has a trailing space in its filename — this works on Windows but will break on the Linux-based Docker/nginx build; fix the filename and its one import together if you touch it.
