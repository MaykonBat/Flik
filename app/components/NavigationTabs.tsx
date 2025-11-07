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
    <nav className="flex flex-col md:flex-row gap-4 justify-center mb-8 flex-wrap">
      <button
        className={`px-6 py-3 rounded-xl cursor-pointer text-base font-semibold transition-all duration-300 backdrop-blur-md ${
          currentView === "events"
            ? "bg-[#f7d954] text-black border-2 border-[#f7d954] hover:bg-[#f5d73a] hover:border-[#f5d73a]"
            : "bg-white/10 text-white/80 border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5"
        } w-full md:w-auto`}
        onClick={() => onViewChange("events")}
        aria-label="View events"
      >
        📅 Browse Events
      </button>
      <button
        className={`px-6 py-3 rounded-xl cursor-pointer text-base font-semibold transition-all duration-300 backdrop-blur-md ${
          currentView === "create"
            ? "bg-[#f7d954] text-black border-2 border-[#f7d954] hover:bg-[#f5d73a] hover:border-[#f5d73a]"
            : "bg-white/10 text-white/80 border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5"
        } w-full md:w-auto`}
        onClick={() => onViewChange("create")}
        aria-label="Create event"
      >
        ➕ Create Event
      </button>
    </nav>
  );
}
