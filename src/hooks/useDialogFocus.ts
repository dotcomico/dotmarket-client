import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * A named radio group is a single Tab stop: only its checked radio (or its
 * first radio when none is checked) is reachable with Tab.
 */
const isTabStop = (el: HTMLElement, container: HTMLElement): boolean => {
  if (!(el instanceof HTMLInputElement) || el.type !== 'radio' || !el.name) return true;
  const group = Array.from(
    container.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${CSS.escape(el.name)}"]`)
  );
  const checked = group.find((radio) => radio.checked);
  return el === (checked ?? group[0]);
};

/** Visible, enabled Tab stops inside `container`, in DOM order. */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.getClientRects().length > 0 && isTabStop(el, container)
  );

interface UseDialogFocusOptions {
  /** For dialogs that stay mounted and toggle; defaults to true (mounted = open). */
  isOpen?: boolean;
  /** False while the dialog must not be dismissed (e.g. a delete in flight). Escape is ignored. */
  canClose?: boolean;
}

/**
 * Modal dialog keyboard behaviour (WAI-ARIA dialog pattern):
 * - moves focus to the first focusable element when the dialog opens,
 * - keeps Tab / Shift+Tab cycling inside the dialog,
 * - calls `onClose` on Escape,
 * - returns focus to whatever was focused before the dialog opened.
 *
 * Attach the returned ref to the element carrying `role="dialog"`.
 */
export const useDialogFocus = <T extends HTMLElement = HTMLDivElement>(
  onClose: () => void,
  { isOpen = true, canClose = true }: UseDialogFocusOptions = {}
) => {
  const dialogRef = useRef<T>(null);
  // Latest callbacks in refs, so inline `onClose` arrows don't re-run the
  // open/close effect (which would steal focus back on every render).
  const onCloseRef = useRef(onClose);
  const canCloseRef = useRef(canClose);

  useEffect(() => {
    onCloseRef.current = onClose;
    canCloseRef.current = canClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusDialogItself = () => {
      if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
      dialog.focus();
    };

    const initial = getFocusableElements(dialog)[0];
    if (initial) initial.focus();
    else focusDialogItself();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (canCloseRef.current) onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        focusDialogItself();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // The trigger may have unmounted meanwhile (e.g. a deleted row); skip it then.
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [isOpen]);

  return dialogRef;
};
