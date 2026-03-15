import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: Date;
  compact?: boolean;
  gradient?: string;
  showIcon?: boolean;
}

export default function CountdownTimer({ endDate, compact = false, gradient = "from-red-500 to-orange-500", showIcon = true }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          total: difference
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.total <= 0) {
    return (
      <div className={`px-3 py-2 bg-gradient-to-r from-slate-500 to-slate-700 text-white rounded-xl shadow-xl flex items-center gap-2`}>
        {showIcon && <Clock className="size-4" />}
        <span className="text-sm font-black">Auction Ended</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`px-3 py-2 bg-gradient-to-r ${gradient} text-white rounded-xl shadow-xl`}>
        <div className="flex items-center gap-2">
          {showIcon && <Clock className="size-4" />}
          <span className="text-sm font-black">
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`px-4 py-3 bg-gradient-to-r ${gradient} text-white rounded-2xl shadow-xl`}>
      <div className="flex items-center gap-3">
        {showIcon && <Clock className="size-5 animate-pulse" />}
        <div className="flex items-center gap-2">
          {timeLeft.days > 0 && (
            <>
              <div className="text-center">
                <div className="text-2xl font-black leading-none">{timeLeft.days}</div>
                <div className="text-xs font-semibold opacity-90 uppercase">Days</div>
              </div>
              <span className="text-xl font-black">:</span>
            </>
          )}
          <div className="text-center">
            <div className="text-2xl font-black leading-none">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs font-semibold opacity-90 uppercase">Hours</div>
          </div>
          <span className="text-xl font-black">:</span>
          <div className="text-center">
            <div className="text-2xl font-black leading-none">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs font-semibold opacity-90 uppercase">Mins</div>
          </div>
          <span className="text-xl font-black">:</span>
          <div className="text-center">
            <div className="text-2xl font-black leading-none">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs font-semibold opacity-90 uppercase">Secs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
