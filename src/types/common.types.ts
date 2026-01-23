/**
 * Global common type definitions
 * Shared utility types used across the application
 */

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseState {
  isLoading: boolean;
  error: string | null;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}