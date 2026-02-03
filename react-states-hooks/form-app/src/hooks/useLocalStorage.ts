import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state in localStorage.
 * Demonstrates:
 * - Custom hooks must start with "use"
 * - Custom hooks can use other hooks (useState, useEffect)
 * - Proper cleanup and error handling
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state - hooks must be called at top level (Rule #1)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect to sync with localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Wrapper function that allows both direct values and updater functions
  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  };

  return [storedValue, setValue];
}
