import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, type = 'info', duration = 2500) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, show };
}
