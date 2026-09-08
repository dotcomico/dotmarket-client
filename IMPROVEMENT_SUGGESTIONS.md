# Improvement Suggestions Log

A running log of non-urgent suggestions raised during code review — things that
work fine as-is but are worth reconsidering if the surrounding code grows.
Not a task list: nothing here is required reading before shipping. Pull an
item out into a real task (or `FRONTEND_ARCHITECTURE_REVIEW.md`) when it
becomes worth acting on.

| Date | Area | Suggestion | Status |
|------|------|------------|--------|
| 2026-09-08 | `src/features/products/components/ProductForm/ProductImageUpload.tsx` | Component takes 11 props including two raw CSS-class overrides (`previewClassName`/`dropzoneClassName`) just to toggle the 360° badge/border styling. Works today, but if a third image slot is ever added, prefer a `variant: 'main' \| '360'` prop over leaking class names through the component API. | Open |
