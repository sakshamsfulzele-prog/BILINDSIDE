import React, { useState } from 'react';
import {
  EyeOff,
  ShieldAlert,
  Search,
  Scale,
  GitBranch,
  ArrowRight,
  HelpCircle,
  Sparkles,
  ExternalLink,
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  BlindSpotItem,
  HiddenAssumptionItem,
  MissingInformationItem,
  ReasoningConflictItem,
  SecondOrderEffectItem,
  CounterPerspectiveItem,
  MindChangeTrigger
} from '../types/blindspot';

interface AnalysisCardsProps {
  blindSpots: BlindSpotItem[];
  hiddenAssumptions: HiddenAssumptionItem[];
  missingInformation: MissingInformationItem[];
  reasoningConflicts: ReasoningConflictItem[];
  secondOrderEffects: SecondOrderEffectItem[];
  counterPerspective: CounterPerspectiveItem;
  criticalQuestions: string[];
  whatWouldChangeYourMind: MindChangeTrigger[];
  onTriggerPerspectiveFlip: () => void;
  isFlippingPerspective: boolean;
}

export const AnalysisCards: React.FC<AnalysisCardsProps> = ({
  blindSpots,
  hiddenAssumptions,
  missingInformation,
  reasoningConflicts,
  secondOrderEffects,
  counterPerspective,
  criticalQuestions,
  whatWouldChangeYourMind,
  onTriggerPerspectiveFlip,
  isFlippingPerspective,
}) => {
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const toggleQuestion = (idx: number) => {
    setCheckedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-8">
      {/* 1. BLIND SPOTS */}
      <section className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Section 01</span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-semibold text-neutral-600">Hidden Realities</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2 mb-6">
          <EyeOff className="h-5 w-5 text-neutral-900" />
          <span>Blind Spots</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blindSpots.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-neutral-200/80 bg-neutral-50/40 hover:bg-neutral-50/80 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                    {item.title}
                  </h3>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.severity === 'high'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : item.severity === 'medium'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {item.severity} severity
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                  {item.explanation}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Why It Matters
                </span>
                <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                  {item.whyItMatters}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. HIDDEN ASSUMPTIONS (Assumption Stress Test) */}
      <section className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Section 02</span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-semibold text-neutral-600">Stress Test Protocol</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-neutral-900" />
            <span>Hidden Assumptions & Stress Test</span>
          </h2>
          <p className="text-xs text-neutral-500">
            What must strictly be true for your logic to hold without collapsing
          </p>
        </div>

        <div className="space-y-5">
          {hiddenAssumptions.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-xl border border-neutral-200/90 bg-white shadow-2xs hover:border-neutral-300 transition-all"
            >
              {/* Assumption Title */}
              <div className="flex items-start gap-2.5 mb-4">
                <div className="h-6 w-6 rounded-md bg-neutral-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Unstated Premise
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                    "{item.assumption}"
                  </h3>
                </div>
              </div>

              {/* Stress Test Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-3 border-t border-neutral-100">
                <div className="p-3.5 rounded-lg bg-neutral-50/70 border border-neutral-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                    <span>What Must Be True</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.whatMustBeTrue}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-100/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Verifying Evidence</span>
                  </div>
                  <p className="text-xs text-emerald-800/90 leading-relaxed">
                    {item.verifyingEvidence}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-red-50/40 border border-red-100/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-900 mb-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                    <span>Disproving Evidence</span>
                  </div>
                  <p className="text-xs text-red-800/90 leading-relaxed">
                    {item.disprovingEvidence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MISSING INFORMATION & 4. REASONING CONFLICTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Missing Information */}
        <section className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Section 03</span>
              <span className="text-neutral-300">/</span>
              <span className="text-xs font-semibold text-neutral-600">Empirical Deficit</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2 mb-5">
              <Search className="h-5 w-5 text-neutral-900" />
              <span>Missing Information</span>
            </h2>

            <div className="space-y-4">
              {missingInformation.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-neutral-200/70 bg-neutral-50/40">
                  <h3 className="text-sm font-bold text-neutral-900 mb-1.5">
                    {item.missingFact}
                  </h3>
                  <div className="text-xs text-neutral-600 space-y-1.5">
                    <p>
                      <span className="font-semibold text-neutral-700">Where to find it:</span> {item.whereToFindIt}
                    </p>
                    <p className="text-neutral-500">
                      <span className="font-semibold text-neutral-700">Risk of deciding without it:</span> {item.riskOfNotKnowing}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reasoning Conflicts */}
        <section className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Section 04</span>
              <span className="text-neutral-300">/</span>
              <span className="text-xs font-semibold text-neutral-600">Zero-Sum Trade-Offs</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2 mb-5">
              <Scale className="h-5 w-5 text-neutral-900" />
              <span>Reasoning Conflicts</span>
            </h2>

            <div className="space-y-4">
              {reasoningConflicts.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-neutral-200/70 bg-neutral-50/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                    <span>{item.tradeOff}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-2 leading-relaxed">
                    {item.conflictDescription}
                  </p>
                  <div className="p-2.5 rounded-lg bg-neutral-100/70 text-[11px] text-neutral-700 font-medium">
                    <span className="text-neutral-500 block mb-0.5">Incompatible Desires:</span>
                    {item.incompatibleDesires}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 5. SECOND-ORDER EFFECTS */}
      <section className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Section 05</span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-semibold text-neutral-600">Cascading Outcomes</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-neutral-900" />
            <span>Second-Order Effects</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Mapping downstream chain reactions beyond the initial outcome
          </p>
        </div>

        <div className="space-y-5">
          {secondOrderEffects.map((item, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-neutral-200/80 bg-neutral-50/30">
              <div className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-mono uppercase">
                  Path
                </span>
                <span>{item.immediateChoice}</span>
              </div>

              {/* 3-Step Domino Chain */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                <div className="p-3.5 rounded-lg bg-white border border-neutral-200/70 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      1st Order Effect (Immediate)
                    </span>
                    <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                      {item.firstOrderEffect}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-neutral-200/70 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      2nd Order Effect (3-12 Months)
                    </span>
                    <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                      {item.secondOrderEffect}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-neutral-900 text-white flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Systemic Compounding
                    </span>
                    <p className="text-xs text-neutral-100 leading-relaxed font-medium">
                      {item.systemicImpact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. COUNTER-PERSPECTIVE & PERSPECTIVE FLIP CTA */}
      <section className="bg-gradient-to-b from-white to-neutral-50/50 rounded-2xl border border-black/[0.1] shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Section 06</span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-semibold text-neutral-600">The Strongest Counter-Stance</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neutral-900" />
              <span>Counter-Perspective</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Steel-manning the intellectual case against your current leaning
            </p>
          </div>

          <button
            onClick={onTriggerPerspectiveFlip}
            disabled={isFlippingPerspective}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 shadow-xs transition-all disabled:opacity-50"
          >
            {isFlippingPerspective ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Running Perspective Flip...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Flip My Perspective</span>
              </>
            )}
          </button>
        </div>

        {/* Counter perspective summary box */}
        <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 bg-white shadow-2xs">
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              The Steel-Manned Opposing Thesis
            </span>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              {counterPerspective.steelmanStance}
            </h3>
          </div>

          <div className="space-y-2.5 mb-5">
            {counterPerspective.coreArguments.map((arg, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                <span className="text-neutral-400 font-mono mt-0.5">•</span>
                <span>{arg}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-start gap-2.5 text-xs text-neutral-700 bg-neutral-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0 text-neutral-500 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900">Vulnerability In Current Thinking:</span>{' '}
              <span>{counterPerspective.vulnerabilityInCurrentThinking}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CRITICAL QUESTIONS */}
      <section className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Section 07</span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-semibold text-neutral-600">Socratic Interrogation</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-neutral-900" />
            <span>Critical Questions</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Tick questions off as you reflect or discuss them with your peers
          </p>
        </div>

        <div className="space-y-3">
          {criticalQuestions.map((q, idx) => {
            const isChecked = Boolean(checkedQuestions[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleQuestion(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'border-neutral-200 bg-neutral-50/60 opacity-60'
                    : 'border-neutral-200/90 bg-white hover:border-neutral-300'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  {isChecked ? (
                    <CheckSquare className="h-4 w-4 text-neutral-900" />
                  ) : (
                    <Square className="h-4 w-4 text-neutral-400" />
                  )}
                </button>
                <div className="flex-1">
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isChecked ? 'line-through text-neutral-500' : 'font-medium text-neutral-900'
                    }`}
                  >
                    {q}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. WHAT WOULD CHANGE YOUR MIND? */}
      <section className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Analysis Section 08</span>
          <span className="text-neutral-300">/</span>
          <span className="text-xs font-semibold text-neutral-600">Falsification Protocol</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-neutral-900" />
            <span>What Would Change Your Mind?</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Specific empirical discoveries that would invalidate your current preference
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {whatWouldChangeYourMind.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-neutral-200/80 bg-neutral-50/30 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Condition 0{idx + 1}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-neutral-900 mb-2 leading-snug">
                  {item.triggerCondition}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  <span className="font-semibold text-neutral-800">Impact:</span> {item.potentialImpact}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                  Action To Test Now:
                </span>
                <p className="text-xs text-neutral-800 font-medium leading-relaxed bg-white p-2.5 rounded border border-neutral-200/50">
                  {item.actionToTestNow}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
