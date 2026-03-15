import { useState, useEffect } from "react";

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
  lightGradient: string;
  hover: string;
  border: string;
}

export const themes: ColorTheme[] = [
  {
    id: "blue",
    name: "Ocean Blue",
    primary: "from-blue-600 via-indigo-600 to-purple-600",
    secondary: "from-blue-500 to-indigo-600",
    gradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
    lightGradient: "bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30",
    hover: "hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700",
    border: "border-blue-500",
  },
  {
    id: "emerald",
    name: "Emerald Green",
    primary: "from-emerald-600 via-teal-600 to-cyan-600",
    secondary: "from-emerald-500 to-teal-600",
    gradient: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600",
    lightGradient: "bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/30",
    hover: "hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700",
    border: "border-emerald-500",
  },
  {
    id: "purple",
    name: "Royal Purple",
    primary: "from-purple-600 via-violet-600 to-fuchsia-600",
    secondary: "from-purple-500 to-violet-600",
    gradient: "bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600",
    lightGradient: "bg-gradient-to-br from-purple-50 via-violet-50/30 to-fuchsia-50/30",
    hover: "hover:from-purple-700 hover:via-violet-700 hover:to-fuchsia-700",
    border: "border-purple-500",
  },
  {
    id: "rose",
    name: "Rose Red",
    primary: "from-rose-600 via-pink-600 to-red-600",
    secondary: "from-rose-500 to-pink-600",
    gradient: "bg-gradient-to-r from-rose-600 via-pink-600 to-red-600",
    lightGradient: "bg-gradient-to-br from-rose-50 via-pink-50/30 to-red-50/30",
    hover: "hover:from-rose-700 hover:via-pink-700 hover:to-red-700",
    border: "border-rose-500",
  },
  {
    id: "amber",
    name: "Golden Amber",
    primary: "from-amber-600 via-orange-600 to-yellow-600",
    secondary: "from-amber-500 to-orange-600",
    gradient: "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600",
    lightGradient: "bg-gradient-to-br from-amber-50 via-orange-50/30 to-yellow-50/30",
    hover: "hover:from-amber-700 hover:via-orange-700 hover:to-yellow-700",
    border: "border-amber-500",
  },
  {
    id: "cyan",
    name: "Cyan Sky",
    primary: "from-cyan-600 via-sky-600 to-blue-600",
    secondary: "from-cyan-500 to-sky-600",
    gradient: "bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600",
    lightGradient: "bg-gradient-to-br from-cyan-50 via-sky-50/30 to-blue-50/30",
    hover: "hover:from-cyan-700 hover:via-sky-700 hover:to-blue-700",
    border: "border-cyan-500",
  },
];

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(themes[0]);

  useEffect(() => {
    // Load saved theme
    const savedThemeId = localStorage.getItem("kingAuctionTheme") || "blue";
    const theme = themes.find((t) => t.id === savedThemeId) || themes[0];
    setCurrentTheme(theme);

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent<ColorTheme>) => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener("themeChange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange as EventListener);
    };
  }, []);

  return currentTheme;
}
