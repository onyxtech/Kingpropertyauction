import { useState, useEffect } from "react";

export function useCountdown(endDate: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      if (!endDate) return;
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;
      if (diff <= 0) { setTimeLeft("Ended"); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      if (days > 0) setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      else if (minutes > 0) setTimeLeft(`${minutes}m ${seconds}s`);
      else setTimeLeft(`${seconds}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
}