import { ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useAdminStats } from "@/features/admin/api/useAdminApi";

interface DynamicDropdownProps {
  items: any[];
  show: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (path: string) => void;
  width?: string;
  bgTheme?: "blue" | "emerald" | "orange";
}

const getIcon = (iconName: string) => {
  const icons: any = LucideIcons;
  return icons[iconName] || icons.FileText;
};

const colorMap: Record<string, { button: string; icon: string; title: string; arrow: string; shadow: string }> = {
  blue: {
    button: "hover:text-blue-600 hover:from-blue-50/80 hover:to-indigo-50/80",
    icon: "from-blue-500 via-blue-600 to-indigo-600",
    title: "group-hover:text-blue-600",
    arrow: "group-hover:text-blue-600",
    shadow: "group-hover:shadow-blue-500/40",
  },
  red: {
    button: "hover:text-red-600 hover:from-red-50/80 hover:to-orange-50/80",
    icon: "from-red-500 via-red-600 to-orange-600",
    title: "group-hover:text-red-600",
    arrow: "group-hover:text-red-600",
    shadow: "group-hover:shadow-red-500/40",
  },
  emerald: {
    button: "hover:text-emerald-600 hover:from-emerald-50/80 hover:to-teal-50/80",
    icon: "from-emerald-500 via-emerald-600 to-teal-600",
    title: "group-hover:text-emerald-600",
    arrow: "group-hover:text-emerald-600",
    shadow: "group-hover:shadow-emerald-500/40",
  },
  orange: {
    button: "hover:text-orange-600 hover:from-orange-50/80 hover:to-amber-50/80",
    icon: "from-orange-500 via-orange-600 to-amber-600",
    title: "group-hover:text-orange-600",
    arrow: "group-hover:text-orange-600",
    shadow: "group-hover:shadow-orange-500/40",
  },
  rose: {
    button: "hover:text-rose-600 hover:from-rose-50/80 hover:to-red-50/80",
    icon: "from-rose-500 via-rose-600 to-red-600",
    title: "group-hover:text-rose-600",
    arrow: "group-hover:text-rose-600",
    shadow: "group-hover:shadow-rose-500/40",
  },
  purple: {
    button: "hover:text-purple-600 hover:from-purple-50/80 hover:to-pink-50/80",
    icon: "from-purple-500 via-purple-600 to-pink-600",
    title: "group-hover:text-purple-600",
    arrow: "group-hover:text-purple-600",
    shadow: "group-hover:shadow-purple-500/40",
  },
  cyan: {
    button: "hover:text-cyan-600 hover:from-cyan-50/80 hover:to-blue-50/80",
    icon: "from-cyan-500 via-cyan-600 to-blue-600",
    title: "group-hover:text-cyan-600",
    arrow: "group-hover:text-cyan-600",
    shadow: "group-hover:shadow-cyan-500/40",
  },
  green: {
    button: "hover:text-green-600 hover:from-green-50/80 hover:to-emerald-50/80",
    icon: "from-green-500 via-green-600 to-emerald-600",
    title: "group-hover:text-green-600",
    arrow: "group-hover:text-green-600",
    shadow: "group-hover:shadow-green-500/40",
  },
  amber: {
    button: "hover:text-amber-600 hover:from-amber-50/80 hover:to-yellow-50/80",
    icon: "from-amber-500 via-amber-600 to-yellow-600",
    title: "group-hover:text-amber-600",
    arrow: "group-hover:text-amber-600",
    shadow: "group-hover:shadow-amber-500/40",
  },
  indigo: {
    button: "hover:text-indigo-600 hover:from-indigo-50/80 hover:to-blue-50/80",
    icon: "from-indigo-500 via-indigo-600 to-blue-600",
    title: "group-hover:text-indigo-600",
    arrow: "group-hover:text-indigo-600",
    shadow: "group-hover:shadow-indigo-500/40",
  },
};

const defaultColors = ["blue", "red", "emerald", "orange", "rose", "purple", "cyan", "green", "indigo", "amber"];

const getBadgeBg = (color: string) => {
  const map: Record<string, string> = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
    cyan: "bg-cyan-500",
    rose: "bg-rose-500",
  };
  return map[color] || "bg-red-500";
};

const bgGradients = {
  blue: "from-blue-500/10 via-indigo-500/5 to-purple-500/10",
  emerald: "from-emerald-500/10 via-teal-500/5 to-cyan-500/10",
  orange: "from-orange-500/10 via-rose-500/5 to-red-500/10",
};
const bgBlur1 = {
  blue: "from-blue-400/20",
  emerald: "from-emerald-400/20",
  orange: "from-orange-400/20",
};
const bgBlur2 = {
  blue: "from-indigo-400/20",
  emerald: "from-teal-400/20",
  orange: "from-rose-400/20",
};

export default function DynamicDropdown({
  items,
  show,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
  width = "320px",
  bgTheme = "blue",
}: DynamicDropdownProps) {
  const { data: stats } = useAdminStats();

  if (!show || !items?.length) return null;

  const firstDividerIndex = items.findIndex((item: any) => item.dividerBefore);
  const mainItems = firstDividerIndex > -1 ? items.slice(0, firstDividerIndex) : items;
  const serviceItems = firstDividerIndex > -1 ? items.slice(firstDividerIndex) : [];
  const dividerItem = serviceItems[0];

  const renderButton = (item: any, originalIndex: number) => {
    const IconComponent = getIcon(item.icon || "FileText");
    const colorKey = item.color || defaultColors[originalIndex % defaultColors.length];
    const colors = colorMap[colorKey] || colorMap.blue;

    return (
      <button
        key={item._id}
        onClick={() => {
          if (item.target === "_blank") {
            window.open(item.url, "_blank");
          } else {
            onNavigate(item.url);
          }
        }}
        className={`w-full px-5 py-4 text-left text-sm font-bold text-slate-700 ${colors.button} bg-gradient-to-r from-transparent to-transparent rounded-2xl transition-all flex items-center justify-between gap-4 group relative overflow-hidden`}
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className={`size-11 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-lg group-hover:shadow-xl ${colors.shadow} transition-all group-hover:scale-110 group-hover:rotate-3`}>
            <IconComponent className="size-5 text-white" />
          </div>
          <div>
            <div className={`font-bold ${colors.title} transition-colors flex items-center gap-2`}>
              {item.label}
              {item.badge && (
                <span className={`px-2 py-0.5 ${getBadgeBg(item.badgeColor || "red")} text-white text-[10px] rounded-full animate-pulse font-black`}>
                  {item.badgeLabel || "LIVE"}
                </span>
              )}
              {item.highlight && item.highlight !== "FREE" && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] rounded-full font-black">
                  {item.highlight}
                </span>
              )}
            </div>
            {item.subtitle && (
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {item.subtitle}
              </div>
            )}
          </div>
        </div>
        {item.highlight === "FREE" ? (
          <div className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black rounded-full flex-shrink-0">
            FREE
          </div>
        ) : (
          <ChevronRight className={`size-4 text-slate-400 ${colors.arrow} group-hover:translate-x-1 transition-all`} />
        )}
      </button>
    );
  };

  return (
    <div
      className="absolute top-full left-0 pt-2 z-[100] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ width }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[bgTheme]} pointer-events-none`} />
        <div className={`absolute top-0 right-0 size-64 bg-gradient-to-br ${bgBlur1[bgTheme]} to-transparent rounded-full blur-3xl pointer-events-none`} />
        <div className={`absolute bottom-0 left-0 size-64 bg-gradient-to-br ${bgBlur2[bgTheme]} to-transparent rounded-full blur-3xl pointer-events-none`} />

        <div className="relative p-6 space-y-3">
          {mainItems.map((item: any) => renderButton(item, items.indexOf(item)))}
        </div>

        {serviceItems.length > 0 && (
          <>
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 py-1 text-xs font-bold text-slate-400 bg-white/80 backdrop-blur-sm rounded-full">
                  {dividerItem?.dividerLabel || "MORE"}
                </span>
              </div>
            </div>
            <div className="space-y-1.5 pb-3 px-3">
              {serviceItems.map((item: any) => renderButton(item, items.indexOf(item)))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
