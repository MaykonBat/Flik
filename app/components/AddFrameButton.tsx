"use client";

interface AddFrameButtonProps {
  onAddFrame: () => Promise<void>;
}

export function AddFrameButton({ onAddFrame }: AddFrameButtonProps) {
  return (
    <div className="mb-6">
      <button
        onClick={onAddFrame}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Save to Farcaster
      </button>
    </div>
  );
}
