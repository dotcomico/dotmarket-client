/**
 * Error Handling Utilities
 * 
 * Provides type-safe error handling for API calls
 */

// Axios error shape
interface AxiosError {
  response?: {
    data?: {
      message?: string;
      errors?: Array<{ msg: string }>;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Type guard to check if error is an Axios error
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

/**
 * Extract a user-friendly error message from any error type
 * 
 * @param error - The caught error (unknown type)
 * @param fallbackMessage - Default message if no specific error found
 * @returns User-friendly error message
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage = 'An unexpected error occurred'
): string => {
  // Handle Axios errors (from API calls)
  if (isAxiosError(error)) {
    // Try to get message from response data
    const apiMessage = error.response?.data?.message;
    if (apiMessage) return apiMessage;

    // Try to get validation errors (from express-validator)
    const validationErrors = error.response?.data?.errors;
    if (validationErrors && validationErrors.length > 0) {
      return validationErrors.map(err => err.msg).join(', ');
    }

    // Handle HTTP status codes
    const status = error.response?.status;
    if (status === 401) return 'Invalid credentials';
    if (status === 403) return 'Access denied';
    if (status === 404) return 'Resource not found';
    if (status === 500) return 'Server error. Please try again later';
    if (status === 429) return 'Too many requests. Please wait and try again';
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return fallbackMessage;
};

/**
 * Log error to console (development) or error tracking service (production)
 */
export const logError = (error: unknown, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error);
  }
};