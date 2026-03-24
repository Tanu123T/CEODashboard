import { useEffect, useState } from 'react';

export default function useSimulatedLoading(delayMs = 500) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return isLoading;
}
