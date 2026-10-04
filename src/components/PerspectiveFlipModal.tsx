import React from 'react';
import { X, Sparkles, Scale, AlertTriangle, Lightbulb, Compass, Copy, Check } from 'lucide-react';
import { PerspectiveFlipResult } from '../types/blindspot';

interface PerspectiveFlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  flipData: PerspectiveFlipResult | null;
  isLoading: boolean;
  error?: string | null;
}

export const PerspectiveFlipModal: React.FC<PerspectiveFlipModalProps> = ({
  isOpen,
  onClose,
  flipData,
  isLoading,
  error,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!flipData) return;
    const text = `BLINDSIDE PERSPECTIVE FLIP: ${flipData.opposingPositionTitle}\n\nCore Philosophy:\n${flipData.opposingCorePhilosophy}\n\nKey Counter-Arguments:\n${flipData.keyArguments.map(k => `• ${k.point}: ${k.counterpointToUser}`).join('\n')}\n\nHidden Costs:\n${flipData.hiddenCostsOfUsersLeaning.map(c => `• ${c}`).join('\n')}\n\nSunk Cost Trap:\n${flipData.theSunkCostTrap}\n\nQuestions From The Opposing Stance:\n${flipData.questionsTheOpponentWouldAsk.map(q => `• ${q}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-black/[0.1] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-10 mb-6 pb-4 border-b border-neutral-100">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-neutral-900 text-white text-[11px] font-mono uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Perspective Flip Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            The Steel-Manned Counter-Position
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            An intellectually rigorous case against your current leaning, without prescribing what you should do.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center">
            <div className="h-8 w-8 mx-auto border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-neutral-900">Constructing Steel-Manned Counter-Perspective...</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              Gemini is auditing opposing precedents, hidden costs, and stress-testing unexamined premises.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm my-6">
            <p className="font-semibold mb-1">Failed to generate perspective flip</p>
            <p>{error}</p>
          </div>
        )}

        {/* Content */}
        {flipData && !isLoading && (
          <div className="space-y-6">
            {/* Thesis Card */}
            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Opposing Philosophy
              </span>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                {flipData.opposingPositionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                "{flipData.opposingCorePhilosophy}"
              </p>
            </div>

            {/* Key Arguments */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                <span>Core Counter-Arguments</span>
              </h4>
              <div className="space-y-3">
                {flipData.keyArguments.map((arg, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-neutral-200/80 bg-white">
                    <h5 className="text-sm font-bold text-neutral-900 mb-1">
                      {arg.point}
                    </h5>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-2">
                      {arg.counterpointToUser}
                    </p>
                    {arg.realWorldPrecedentOrAnalogy && (
                      <div className="text-[11px] text-neutral-500 bg-neutral-50 p-2 rounded border border-neutral-100 font-medium">
                        <span className="text-neutral-700 font-semibold">Precedent / Analogy:</span> {arg.realWorldPrecedentOrAnalogy}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Costs & Sunk Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Hidden Costs of Your Leaning</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-700">
                  {flipData.hiddenCostsOfUsersLeaning.map((cost, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>{cost}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-neutral-600" />
                  <span>The Sunk-Cost Trap</span>
                </h4>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {flipData.theSunkCostTrap}
                </p>
              </div>
            </div>

            {/* Alternative Frameworks */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Alternative Mental Frames</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flipData.alternativeFrames.map((frame, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-neutral-200 bg-white">
                    <span className="text-xs font-bold text-neutral-900 block mb-1">
                      {frame.frameworkName}
                    </span>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {frame.freshFraming}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions the Opponent Would Ask */}
            <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-900 text-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2.5">
                Unsparing Questions From The Opposing Side
              </h4>
              <ul className="space-y-2 text-xs text-neutral-200">
                {flipData.questionsTheOpponentWouldAsk.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-400 font-mono mt-0.5">•</span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Counter-Position'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
