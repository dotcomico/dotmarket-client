import { useEffect, useState } from 'react';

/**
 * Ticks up an elapsed-time value (ms) from the moment this hook mounts.
 * Intended for a component that itself mounts/unmounts alongside the thing
 * being timed (e.g. a "bot is typing" bubble) — mounting fresh is what
 * resets the timer, so there's no reset logic here.
 */
export const useElapsedTimer = () => {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 250);

    return () => window.clearInterval(intervalId);
  }, []);

  return elapsedMs;
};
