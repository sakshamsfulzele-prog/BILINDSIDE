import React from 'react';
import { X, Trash2, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { BlindSpotAnalysis } from '../types/blindspot';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: BlindSpotAnalysis[];
  onSelect: (analysis: BlindSpotAnalysis) => void;
  onClear: () => void;
  onDeleteOne: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
  onDeleteOne,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md h-full bg-white border-l border-neutral-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-neutral-500" />
            <h3 className="text-base font-bold text-neutral-900">Analysis History</h3>
            <span className="text-xs text-neutral-400 font-mono">({history.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-20 text-center text-neutral-400">
              <BookOpen className="h-8 w-8 mx-auto stroke-1 mb-2" />
              <p className="text-sm font-medium text-neutral-600">No saved analyses yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Your past decision audits will be automatically preserved here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="group relative p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[11px] text-neutral-400 font-mono">{dateStr}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOne(item.id);
                      }}
                      className="text-neutral-300 hover:text-red-600 p-1 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug mb-1">
                    {item.summary?.decisionTitle || item.userInput.decision}
                  </h4>

                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {item.userInput.decision}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/50">
                    <span>{item.blindSpots?.length || 0} blind spots detected</span>
                    <span className="flex items-center gap-0.5 text-neutral-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
            <button
              onClick={onClear}
              className="text-xs text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>

            <button
              onClick={onClose}
              className="text-xs font-semibold text-neutral-800 hover:text-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
