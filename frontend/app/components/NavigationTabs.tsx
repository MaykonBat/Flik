"use client";

type View = "events" | "create";

interface NavigationTabsProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function NavigationTabs({
  currentView,
  onViewChange,
}: NavigationTabsProps) {
  return (
    <nav
      className="flex flex-col md:flex-row gap-4 justify-center mb-8 flex-wrap"
      role="tablist"
      aria-label="Main navigation"
    >
      <button
        className={`px-8 py-4 rounded-xl cursor-pointer text-base font-bold transition-all duration-300 backdrop-blur-md shadow-lg ${
          currentView === "events"
            ? "bg-gradient-to-r from-[#f7d954] to-[#f5d73a] text-black border-2 border-[#f7d954] hover:scale-105 hover:shadow-[0_8px_32px_rgba(247,217,84,0.4)]"
            : "bg-white/10 text-white/80 border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
        } w-full md:w-auto`}
        onClick={() => onViewChange("events")}
        aria-label="Browse events"
        role="tab"
        aria-selected={currentView === "events"}
      >
        📅 Browse Events
      </button>
      <button
        className={`px-8 py-4 rounded-xl cursor-pointer text-base font-bold transition-all duration-300 backdrop-blur-md shadow-lg ${
          currentView === "create"
            ? "bg-gradient-to-r from-[#f7d954] to-[#f5d73a] text-black border-2 border-[#f7d954] hover:scale-105 hover:shadow-[0_8px_32px_rgba(247,217,84,0.4)]"
            : "bg-white/10 text-white/80 border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
        } w-full md:w-auto`}
        onClick={() => onViewChange("create")}
        aria-label="Create event"
        role="tab"
        aria-selected={currentView === "create"}
      >
        ✨ Create Event
      </button>
    </nav>
  );
}
