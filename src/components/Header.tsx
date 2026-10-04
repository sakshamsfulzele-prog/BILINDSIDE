import React from 'react';
import { Compass, RotateCcw, History, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onNewAnalysis: () => void;
  onTryDemo: () => void;
  onToggleHistory: () => void;
  historyCount: number;
  hasActiveAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewAnalysis,
  onTryDemo,
  onToggleHistory,
  historyCount,
  hasActiveAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] bg-[#FBFBFA]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-3 text-left transition-opacity hover:opacity-85"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-xs">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-neutral-900 text-base">BLINDSIDE</span>
              <span className="text-xs text-neutral-400 font-medium tracking-normal">/ cognitive audit</span>
            </div>
            <p className="text-[11px] text-neutral-500 font-normal leading-none hidden sm:block">
              See what your decision is hiding.
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onTryDemo}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
            <span>Try Demo</span>
          </button>

          <button
            onClick={onToggleHistory}
            className="relative flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            title="Saved Analyses"
          >
            <History className="h-3.5 w-3.5 text-neutral-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 rounded-full bg-neutral-100 px-1.5 py-0.2 text-[10px] font-semibold text-neutral-600">
                {historyCount}
              </span>
            )}
          </button>

          {hasActiveAnalysis && (
            <button
              onClick={onNewAnalysis}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
