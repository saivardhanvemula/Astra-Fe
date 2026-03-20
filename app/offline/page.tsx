export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <p className="text-[#E50914] text-[10px] font-black tracking-[0.4em] uppercase mb-8">
        Astra
      </p>

      {/* Icon */}
      <div className="w-20 h-20 border border-[#2A2A2A] flex items-center justify-center mb-8">
        <svg
          className="w-8 h-8 text-[#333]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3 text-center">
        You&apos;re Offline
      </h1>
      <p className="text-[#555] text-sm tracking-wide text-center max-w-xs">
        No internet connection. Please check your network and try again.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-10 bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase px-8 py-4 transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );
}
