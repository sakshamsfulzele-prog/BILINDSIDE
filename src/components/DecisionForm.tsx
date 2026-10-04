import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChevronDown, ChevronUp, AlertCircle, ShieldAlert, Compass } from 'lucide-react';
import { DecisionInput } from '../types/blindspot';
import { DEMO_INPUT } from '../data/demoData';

interface DecisionFormProps {
  onSubmit: (data: DecisionInput) => void;
  onTryDemo: () => void;
  isLoading: boolean;
  initialValues?: DecisionInput;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  onTryDemo,
  isLoading,
  initialValues,
}) => {
  const [decision, setDecision] = useState(initialValues?.decision || '');
  const [priorities, setPriorities] = useState(initialValues?.priorities || '');
  const [leaning, setLeaning] = useState(initialValues?.leaning || '');
  const [uncertainties, setUncertainties] = useState(initialValues?.uncertainties || '');
  const [showOptionalFields, setShowOptionalFields] = useState(
    Boolean(initialValues?.priorities || initialValues?.leaning || initialValues?.uncertainties)
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim() || decision.trim().length < 8) {
      setValidationError('Please describe your decision in at least 8 characters so we can perform a meaningful cognitive audit.');
      return;
    }
    setValidationError(null);
    onSubmit({
      decision: decision.trim(),
      priorities: priorities.trim() || undefined,
      leaning: leaning.trim() || undefined,
      uncertainties: uncertainties.trim() || undefined,
    });
  };

  const handleFillDemo = () => {
    setDecision(DEMO_INPUT.decision);
    setPriorities(DEMO_INPUT.priorities || '');
    setLeaning(DEMO_INPUT.leaning || '');
    setUncertainties(DEMO_INPUT.uncertainties || '');
    setShowOptionalFields(true);
    setValidationError(null);
  };

  const sampleDecisions = [
    {
      title: "Student Startup Internship vs. Final Semester",
      action: handleFillDemo,
    },
    {
      title: "Resigning to Bootstrap a Micro-SaaS",
      action: () => {
        setDecision("Should I quit my senior product manager role ($190k salary) to bootstrap a B2B AI analytics tool full-time with 14 months of personal savings?");
        setPriorities("Autonomy, equity upside, creative control, preserving family stability.");
        setLeaning("Leaning toward quitting next month because I feel stagnant and enterprise customer interviews showed initial willingness to pay.");
        setUncertainties("Market timing, CAC customer acquisition economics, and losing health insurance & employer retirement match.");
        setShowOptionalFields(true);
        setValidationError(null);
      }
    },
    {
      title: "International Relocation Offer",
      action: () => {
        setDecision("Should our family relocate from Chicago to Zurich for a VP of Operations role with a 35% nominal compensation increase?");
        setPriorities("Children's education, long-term wealth, partner's career continuation, cultural experience.");
        setLeaning("Leaning toward accepting for the prestige and adventure, but worried about partner's visa work permits.");
        setUncertainties("High Swiss cost of living eating up the raise, language barrier for kids in school, distance from aging parents.");
        setShowOptionalFields(true);
        setValidationError(null);
      }
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-14">
      {/* Hero Header */}
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100/90 text-neutral-700 text-xs font-medium mb-4 border border-black/[0.04]">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-pulse"></span>
          <span>Cognitive Decision Partner</span>
          <span className="text-neutral-400">·</span>
          <span className="text-neutral-500">Non-Prescriptive</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight mb-3">
          BLINDSIDE
        </h1>
        <p className="text-lg sm:text-xl text-neutral-600 font-normal max-w-xl mx-auto mb-3">
          See what your decision is hiding.
        </p>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
          We never tell you what to choose. We illuminate the blind spots, hidden assumptions, reasoning conflicts, and second-order effects you haven't considered.
        </p>
      </div>

      {/* Main Decision Form Card */}
      <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Large Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="decision" className="block text-sm font-semibold text-neutral-900">
                What decision are you thinking about? <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-neutral-400 font-mono">
                {decision.length > 0 ? `${decision.length} chars` : 'Required'}
              </span>
            </div>
            <textarea
              id="decision"
              value={decision}
              onChange={(e) => {
                setDecision(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="e.g. Should I accept a 6-month startup internship in SF or stay on campus to complete my final semester and capstone?"
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 focus:outline-none transition-all resize-y leading-relaxed"
            />
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50/80 border border-red-200 text-xs sm:text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Toggle Optional Fields */}
          <div>
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {showOptionalFields ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Hide additional context (optional)</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Add context to deepen analysis (priorities, leaning, uncertainties)</span>
                </>
              )}
            </button>
          </div>

          {/* Optional Inputs Stack */}
          {showOptionalFields && (
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <div>
                <label htmlFor="priorities" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  What matters most to you? <span className="font-normal text-neutral-400">(priorities & non-negotiables)</span>
                </label>
                <input
                  id="priorities"
                  type="text"
                  value={priorities}
                  onChange={(e) => setPriorities(e.target.value)}
                  placeholder="e.g. Learning velocity, net financial return, graduation schedule, mental health..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="leaning" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  What are you currently leaning toward? <span className="font-normal text-neutral-400">(your current default stance)</span>
                </label>
                <input
                  id="leaning"
                  type="text"
                  value={leaning}
                  onChange={(e) => setLeaning(e.target.value)}
                  placeholder="e.g. Leaning 70% toward taking the offer because the company has a strong brand..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="uncertainties" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  What are you uncertain about? <span className="font-normal text-neutral-400">(doubts & knowledge gaps)</span>
                </label>
                <input
                  id="uncertainties"
                  type="text"
                  value={uncertainties}
                  onChange={(e) => setUncertainties(e.target.value)}
                  placeholder="e.g. Whether 55+ hr workload makes remote coursework impossible, hidden living expenses..."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Auditing Your Reasoning...</span>
                </>
              ) : (
                <>
                  <span>Reveal Blind Spots</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onTryDemo}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 shadow-2xs transition-colors"
            >
              <Sparkles className="h-4 w-4 text-neutral-500" />
              <span>Try Demo</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Prompts */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
            Or test with a pre-configured decision:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleDecisions.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={sample.action}
                className="text-left text-xs text-neutral-600 bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200/60 transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Non-Prescriptive Pledge */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-neutral-600 text-xs">
        <div className="p-4 rounded-xl bg-white border border-black/[0.04] shadow-2xs">
          <div className="font-semibold text-neutral-900 mb-1 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-neutral-700" />
            <span>Anti-Recommendation</span>
          </div>
          <p className="text-neutral-500 leading-relaxed">
            BLINDSIDE will never tell you what choice to make. You retain 100% agency.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-black/[0.04] shadow-2xs">
          <div className="font-semibold text-neutral-900 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-neutral-700" />
            <span>Assumption Stress Testing</span>
          </div>
          <p className="text-neutral-500 leading-relaxed">
            We isolate the unstated premises that your logic rests on, and tell you how to disprove them.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-black/[0.04] shadow-2xs">
          <div className="font-semibold text-neutral-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-neutral-700" />
            <span>Perspective Flip</span>
          </div>
          <p className="text-neutral-500 leading-relaxed">
            Steel-mans the strongest opposing view so you never get caught off guard by confirmation bias.
          </p>
        </div>
      </div>
    </div>
  );
};
