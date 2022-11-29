import { useEffect, useRef } from 'react';

/**
 * Set an adjustable delay for a callback; like setInterval but for React Hooks.
 * Taken directly from Dan Abramov's code here:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param {Function} callback The function to call after the delay
 * @param {number} delay The delay in milliseconds
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Save the latest callback function
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    /**
     * Execute the current callback
     */
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
