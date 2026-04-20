import { useEffect } from "react";

const usePolling = (callback, delay) => {
  useEffect(() => {
    if (!delay) return;

    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay]);
};

export default usePolling;   // ✅ ADD THIS LINE
