"use client";

interface HeaderProps {
  currentUserName: string | undefined;
  error: string | null;
}

export function Header({ currentUserName, error }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8 mb-4">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight mb-2 bg-gradient-to-br from-white to-[#e0e0e0] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Event Platform
          </h1>
          <p className="text-lg leading-relaxed text-white/70 font-light">
            {currentUserName
              ? `Welcome, ${currentUserName}!`
              : "Discover and create events on Farcaster"}
          </p>
        </div>
      </div>
      {error && (
        <div
          className="bg-[rgba(255,107,107,0.1)] border-2 border-[rgba(255,107,107,0.3)] text-[#ff6b6b] px-4 py-3 rounded-lg text-sm mt-4 text-center"
          role="alert"
        >
          {error}
        </div>
      )}
    </header>
  );
}
