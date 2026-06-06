import { useMenuData } from "@/hooks/useMenuData";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router";

interface MenuSlotProps {
  location: string;
  variant?: "horizontal" | "vertical";
  className?: string;
  itemClassName?: string;
  showIcons?: boolean;
  fallback?: React.ReactNode;
}

export default function MenuSlot({
  location,
  variant = "horizontal",
  className = "",
  itemClassName = "",
  showIcons = true,
  fallback = null,
}: MenuSlotProps) {
  const navigate = useNavigate();
  const { menus } = useMenuData();

  const menu = menus.find(
    (m: any) => m.location === location && m.status === "active",
  );

  if (!menu?.items?.length) return <>{fallback}</>;

  const items = menu.items
    .filter((item: any) => !item.parent)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  const containerClass = variant === "vertical"
    ? `flex flex-col gap-1 ${className}`
    : `flex items-center gap-2 flex-wrap ${className}`;

  return (
    <nav className={containerClass}>
      {items.map((item: any) => {
        const icons: any = LucideIcons;
        const IconComp = item.icon ? icons[item.icon] : null;
        return (
          <button
            key={item._id}
            onClick={() => item.url && navigate(item.url)}
            className={`flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-all ${itemClassName}`}
          >
            {showIcons && IconComp && <IconComp className="size-4" />}
            {item.label}
            {item.badge && (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-black animate-pulse">
                {item.badgeLabel || "LIVE"}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
