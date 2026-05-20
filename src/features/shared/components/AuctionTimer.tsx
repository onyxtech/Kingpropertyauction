import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface AuctionTimerProps {
  startDateTime: string | Date;
  endDateTime: string | Date;
  status: string;
  className?: string;
  showLabel?: boolean;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "0s";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export default function AuctionTimer({
  startDateTime,
  endDateTime,
  status,
  className = "",
  showLabel = true,
}: AuctionTimerProps) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [color, setColor] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const start = new Date(startDateTime).getTime();
      const end = new Date(endDateTime).getTime();

      // Smart status detection: use real time even if status prop hasn't updated yet
      let effectiveStatus = status;
      if (status === 'scheduled' && now >= start) {
        effectiveStatus = 'live';
      }
      if ((status === 'live' || status === 'scheduled') && now >= end) {
        effectiveStatus = 'completed';
      }

      if (effectiveStatus === "completed" || effectiveStatus === "cancelled") {
        const endDate = new Date(endDateTime);
        setLabel("Ended");
        setValue(
          endDate.toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/London",
          }) + " GMT",
        );
        setColor("bg-slate-50 border-slate-200 text-slate-500");
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      if (effectiveStatus === "live") {
        const remaining = end - now;
        setLabel("Ends in");
        setValue(remaining > 0 ? formatDuration(remaining) : "Ending soon");
        setColor("bg-red-50 border-red-200 text-red-600");
        return;
      }

      // scheduled or any other status
      const until = start - now;
      if (until <= 0) {
        setLabel("Starting soon");
        setValue("");
        setColor("bg-amber-50 border-amber-200 text-amber-600");
      } else {
        setLabel("Starts in");
        setValue(formatDuration(until));
        setColor("bg-blue-50 border-blue-200 text-blue-600");
      }
    };

    update();
    if (status !== "completed" && status !== "cancelled") {
      intervalRef.current = setInterval(update, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startDateTime, endDateTime, status]);

  if (!label) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${color} ${className}`}
    >
      {showLabel && <Clock className="size-3.5 flex-shrink-0" />}
      <span>{label}{value ? ":" : ""}</span>
      {value && <span className="font-black">{value}</span>}
    </div>
  );
}
