import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface EpistemicBannerProps {
  explicitFacts: string[];
  assumptions: string[];
  uncertainties: string[];
}

export const EpistemicBanner: React.FC<EpistemicBannerProps> = ({
  explicitFacts,
  assumptions,
  uncertainties,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-black/[0.08] shadow-xs overflow-hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Epistemic Distinction Audit
          </span>
          <span className="text-xs text-neutral-400 font-normal hidden sm:inline">
            · Separating verified inputs from assumptions and unknowns
          </span>
        </div>

        <button className="text-neutral-400 hover:text-neutral-700">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-neutral-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Explicitly Provided */}
            <div className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-neutral-900">1. Explicit User Facts</span>
              </div>
              <p className="text-[11px] text-neutral-500 mb-2">
                Information provided directly in your prompt:
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-700">
                {explicitFacts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-neutral-400 font-mono mt-0.5">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Hidden Assumptions */}
            <div className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-neutral-900">2. Detected Assumptions</span>
              </div>
              <p className="text-[11px] text-neutral-500 mb-2">
                Unverified premises underlying your current thinking:
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-700">
                {assumptions.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-neutral-400 font-mono mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Unknowns & Uncertainties */}
            <div className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-neutral-600 shrink-0" />
                <span className="text-xs font-bold text-neutral-900">3. Uncertainties & Gaps</span>
              </div>
              <p className="text-[11px] text-neutral-500 mb-2">
                Missing empirical variables that require testing:
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-700">
                {uncertainties.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-neutral-400 font-mono mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
