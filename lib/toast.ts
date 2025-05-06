/**
 * Toast utility functions for displaying notifications
 * Provides a simple API for showing success, error, and info messages
 * Using Sonner toast library (ShadCN's default)
 */
import { toast } from "sonner";

/**
 * Toast utility for displaying notifications
 */
export const showToast = {
  /**
   * Show a success toast notification
   * @param message - Message to display
   */
  success: (message: string) => {
    toast.success(message);
  },

  /**
   * Show an error toast notification
   * @param message - Error message to display
   */
  error: (message: string) => {
    toast.error(message);
  },

  /**
   * Show an info toast notification
   * @param message - Info message to display
   */
  info: (message: string) => {
    toast(message);
  },

  /**
   * Show a custom toast notification with promise
   * @param promise - Promise to track
   * @param options - Loading/success/error messages
   */
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return toast.promise(promise, options);
  },

  /**
   * Dismiss all toast notifications
   */
  dismiss: () => {
    toast.dismiss();
  },
};
