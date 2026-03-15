import { useState, useEffect } from "react";
import { Palette, Check, X } from "lucide-react";
import { themes, type ColorTheme } from "../hooks/useTheme";

export default function ColorThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("blue");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("kingAuctionTheme");
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    // Store theme classes as CSS variables for global access
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("kingAuctionTheme", themeId);

    // Dispatch custom event so other components can react to theme changes
    window.dispatchEvent(new CustomEvent("themeChange", { detail: theme }));
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
    
    // Show confirmation feedback
    const button = document.querySelector(`[data-theme-button="${themeId}"]`);
    if (button) {
      button.classList.add("animate-pulse");
      setTimeout(() => {
        button.classList.remove("animate-pulse");
      }, 600);
    }
  };

  return (
    <>
      {/* Floating Color Picker Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-6 bottom-6 z-50 size-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group border-2 border-white/20"
        aria-label="Change color theme"
      >
        <Palette className="size-7 text-white group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 size-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full animate-pulse" />
      </button>

      {/* Color Theme Panel */}
      {isOpen && (
        <div className="fixed left-6 bottom-24 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/60 w-[380px] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Palette className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Color Theme</h3>
                  <p className="text-xs text-white/80 font-medium">Customize your experience</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="size-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 active:scale-95"
                type="button"
                aria-label="Close theme selector"
              >
                <X className="size-5 text-white" />
              </button>
            </div>

            {/* Theme Options */}
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              <p className="text-sm font-bold text-slate-700 mb-4">
                Choose your preferred color scheme:
              </p>

              {themes.map((theme) => (
                <button
                  key={theme.id}
                  data-theme-button={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                    selectedTheme === theme.id
                      ? "border-slate-900 bg-slate-50 shadow-lg"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Color Preview */}
                    <div
                      className={`size-16 rounded-xl bg-gradient-to-br ${theme.primary} shadow-lg flex items-center justify-center flex-shrink-0`}
                    >
                      {selectedTheme === theme.id && (
                        <Check className="size-8 text-white animate-in zoom-in duration-300" />
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-slate-900 text-base mb-1">
                        {theme.name}
                      </h4>
                      <div className="flex gap-1.5">
                        <div className={`size-4 rounded-full bg-gradient-to-br ${theme.primary.split(" ")[0].replace("from-", "bg-")}`} />
                        <div className={`size-4 rounded-full bg-gradient-to-br ${theme.primary.split(" ")[1].replace("via-", "bg-")}`} />
                        <div className={`size-4 rounded-full bg-gradient-to-br ${theme.primary.split(" ")[2].replace("to-", "bg-")}`} />
                      </div>
                    </div>

                    {/* Selected Badge */}
                    {selectedTheme === theme.id && (
                      <div className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                        <Check className="size-3" />
                        Active
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t-2 border-slate-100">
              <p className="text-xs text-slate-500 text-center font-medium">
                🎨 Theme applied across all pages
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}