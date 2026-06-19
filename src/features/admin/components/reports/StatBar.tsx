import { ArrowUpRight } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: any;
  color: string;
}

interface StatBarProps {
  stats: StatItem[];
}

export default function StatBar({ stats }: StatBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <Icon className="size-5 opacity-80" />
              <ArrowUpRight className="size-4 opacity-60" />
            </div>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-white/80 text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}