import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: string | Date;
  onExpire?: () => void;
  size?: "sm" | "md";
}

export default function CountdownTimer({
  endDate,
  onExpire,
  size = "md",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, expired: false,
  });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        onExpire?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <span className={`flex items-center gap-1 text-red-600 font-bold ${size === "sm" ? "text-xs" : "text-sm"}`}>
        <Clock className={size === "sm" ? "size-3" : "size-4"} />
        Ended
      </span>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;

  if (size === "sm") {
    return (
      <span className={`flex items-center gap-1 font-bold text-xs ${isUrgent ? "text-red-600" : "text-slate-600"}`}>
        <Clock className="size-3" />
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isUrgent ? "text-red-600" : "text-slate-700"}`}>
      <Clock className="size-4 flex-shrink-0" />
      <div className="flex items-center gap-1 font-mono font-black text-sm">
        {timeLeft.days > 0 && (
          <><span>{timeLeft.days}d</span><span className="mx-0.5 opacity-50">:</span></>
        )}
        <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
        <span className="mx-0.5 opacity-50">:</span>
        <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
        <span className="mx-0.5 opacity-50">:</span>
        <span className={isUrgent ? "animate-pulse" : ""}>
          {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    </div>
  );
}
