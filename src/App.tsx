/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { BlindSpotRadar } from './components/BlindSpotRadar';
import { EpistemicBanner } from './components/EpistemicBanner';
import { AnalysisCards } from './components/AnalysisCards';
import { PerspectiveFlipModal } from './components/PerspectiveFlipModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { BlindSpotAnalysis, DecisionInput, PerspectiveFlipResult } from './types/blindspot';
import { DEMO_ANALYSIS, DEMO_PERSPECTIVE_FLIP, DEMO_INPUT } from './data/demoData';
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Printer,
  AlertCircle,
  HelpCircle,
  Share2,
  ChevronRight
} from 'lucide-react';

const STORAGE_KEY = 'blindside_history_v1';

export default function App() {
  const [activeAnalysis, setActiveAnalysis] = useState<BlindSpotAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Perspective Flip Modal State
  const [isFlipOpen, setIsFlipOpen] = useState(false);
  const [flipData, setFlipData] = useState<PerspectiveFlipResult | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipError, setFlipError] = useState<string | null>(null);

  // History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<BlindSpotAnalysis[]>([]);

  // Copy status
  const [copied, setCopied] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newAnalysis: BlindSpotAnalysis) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== newAnalysis.id);
      const updated = [newAnalysis, ...filtered].slice(0, 20); // keep last 20
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Perform Analysis
  const handleAnalyze = async (input: DecisionInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.error || `Request failed with status ${response.status}`);
      }

      const data: BlindSpotAnalysis = await response.json();
      setActiveAnalysis(data);
      saveToHistory(data);
      setFlipData(null); // Reset previous flip

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred while analyzing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Demo Analysis
  const handleTryDemo = () => {
    setActiveAnalysis(DEMO_ANALYSIS);
    setFlipData(DEMO_PERSPECTIVE_FLIP);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger Perspective Flip
  const handleTriggerPerspectiveFlip = async () => {
    if (!activeAnalysis) return;

    // If viewing demo, we can immediately show pre-computed demo flip or fetch fresh
    if (activeAnalysis.id === DEMO_ANALYSIS.id && DEMO_PERSPECTIVE_FLIP) {
      setFlipData(DEMO_PERSPECTIVE_FLIP);
      setIsFlipOpen(true);
      return;
    }

    setIsFlipOpen(true);
    setIsFlipping(true);
    setFlipError(null);

    try {
      const response = await fetch('/api/perspective-flip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: activeAnalysis.userInput.decision,
          priorities: activeAnalysis.userInput.priorities,
          leaning: activeAnalysis.userInput.leaning,
          uncertainties: activeAnalysis.userInput.uncertainties,
          currentAnalysisSummary: activeAnalysis.summary.coreDilemma,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.error || 'Failed to generate perspective flip.');
      }

      const data: PerspectiveFlipResult = await response.json();
      setFlipData(data);
    } catch (err: any) {
      console.error('Perspective flip error:', err);
      setFlipError(err.message || 'Could not fetch perspective flip. Please retry.');
    } finally {
      setIsFlipping(false);
    }
  };

  // Copy Full Analysis Markdown
  const handleCopyAnalysis = () => {
    if (!activeAnalysis) return;

    const markdown = `# BLINDSIDE COGNITIVE AUDIT
**Decision:** ${activeAnalysis.userInput.decision}
**Core Dilemma:** ${activeAnalysis.summary.coreDilemma}

---

## 1. BLIND SPOTS
${activeAnalysis.blindSpots.map(b => `### ${b.title} [${b.severity.toUpperCase()}]
${b.explanation}
*Why It Matters:* ${b.whyItMatters}`).join('\n\n')}

---

## 2. HIDDEN ASSUMPTIONS (STRESS TEST)
${activeAnalysis.hiddenAssumptions.map(a => `### "${a.assumption}"
- **What Must Be True:** ${a.whatMustBeTrue}
- **Verifying Evidence:** ${a.verifyingEvidence}
- **Disproving Evidence:** ${a.disprovingEvidence}`).join('\n\n')}

---

## 3. MISSING INFORMATION
${activeAnalysis.missingInformation.map(m => `- **${m.missingFact}**
  - Source: ${m.whereToFindIt}
  - Risk of not knowing: ${m.riskOfNotKnowing}`).join('\n')}

---

## 4. REASONING CONFLICTS
${activeAnalysis.reasoningConflicts.map(r => `### ${r.tradeOff}
${r.conflictDescription}
*Incompatible Desires:* ${r.incompatibleDesires}`).join('\n\n')}

---

## 5. SECOND-ORDER EFFECTS
${activeAnalysis.secondOrderEffects.map(s => `- **Path:** ${s.immediateChoice}
  - 1st Order: ${s.firstOrderEffect}
  - 2nd Order: ${s.secondOrderEffect}
  - Compounding Impact: ${s.systemicImpact}`).join('\n\n')}

---

## 6. COUNTER-PERSPECTIVE
**${activeAnalysis.counterPerspective.steelmanStance}**
${activeAnalysis.counterPerspective.coreArguments.map(arg => `- ${arg}`).join('\n')}
*Vulnerability In Current Thinking:* ${activeAnalysis.counterPerspective.vulnerabilityInCurrentThinking}

---

## 7. CRITICAL QUESTIONS
${activeAnalysis.criticalQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---

## 8. WHAT WOULD CHANGE YOUR MIND?
${activeAnalysis.whatWouldChangeYourMind.map(w => `- **Trigger:** ${w.triggerCondition}
  - Impact: ${w.potentialImpact}
  - Test Now: ${w.actionToTestNow}`).join('\n\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1A1A1A] flex flex-col font-sans">
      {/* Header */}
      <Header
        onNewAnalysis={() => setActiveAnalysis(null)}
        onTryDemo={handleTryDemo}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={history.length}
        hasActiveAnalysis={Boolean(activeAnalysis)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50/90 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-0.5">Analysis Encountered an Error</p>
              <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold text-red-700 hover:text-red-950 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switch: Input Form vs. Analysis Result */}
        {!activeAnalysis ? (
          <DecisionForm
            onSubmit={handleAnalyze}
            onTryDemo={handleTryDemo}
            isLoading={isLoading}
          />
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Analysis Header Card */}
            <div className="bg-white rounded-2xl border border-black/[0.08] shadow-xs p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-neutral-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Cognitive Audit
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-xs text-neutral-500 font-mono">
                      {new Date(activeAnalysis.timestamp).toLocaleDateString()}
                    </span>
                    {activeAnalysis.id === DEMO_ANALYSIS.id && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                        Demo Mode
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                    {activeAnalysis.summary.decisionTitle || "Decision Analysis"}
                  </h1>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                    <span className="text-neutral-900 font-bold">Core Dilemma:</span> {activeAnalysis.summary.coreDilemma}
                  </p>
                </div>

                {/* Header Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 shrink-0">
                  <button
                    onClick={handleTriggerPerspectiveFlip}
                    disabled={isFlipping}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 shadow-2xs transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Flip Perspective</span>
                  </button>

                  <button
                    onClick={handleCopyAnalysis}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
                    title="Copy formatted markdown report"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Audit</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
                    title="Print or Save as PDF"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Print</span>
                  </button>

                  <button
                    onClick={() => setActiveAnalysis(null)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>New</span>
                  </button>
                </div>
              </div>

              {/* Input Context Chips/Summary */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-neutral-50/70 border border-neutral-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Your Stated Question
                  </span>
                  <p className="text-neutral-800 font-medium line-clamp-3">
                    {activeAnalysis.userInput.decision}
                  </p>
                </div>

                {activeAnalysis.userInput.priorities && (
                  <div className="p-3 rounded-lg bg-neutral-50/70 border border-neutral-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Stated Priorities
                    </span>
                    <p className="text-neutral-700 line-clamp-3">
                      {activeAnalysis.userInput.priorities}
                    </p>
                  </div>
                )}

                {activeAnalysis.userInput.leaning && (
                  <div className="p-3 rounded-lg bg-neutral-50/70 border border-neutral-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Current Leaning
                    </span>
                    <p className="text-neutral-700 line-clamp-3">
                      {activeAnalysis.userInput.leaning}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Epistemic Distinction Audit */}
            <EpistemicBanner
              explicitFacts={activeAnalysis.summary.explicitFacts || []}
              assumptions={activeAnalysis.summary.assumptionsIdentified || []}
              uncertainties={activeAnalysis.summary.uncertaintiesNoted || []}
            />

            {/* Unique Feature 1: Blind Spot Radar */}
            <BlindSpotRadar categories={activeAnalysis.radarScores || []} />

            {/* Core 8 Analysis Cards */}
            <AnalysisCards
              blindSpots={activeAnalysis.blindSpots || []}
              hiddenAssumptions={activeAnalysis.hiddenAssumptions || []}
              missingInformation={activeAnalysis.missingInformation || []}
              reasoningConflicts={activeAnalysis.reasoningConflicts || []}
              secondOrderEffects={activeAnalysis.secondOrderEffects || []}
              counterPerspective={activeAnalysis.counterPerspective}
              criticalQuestions={activeAnalysis.criticalQuestions || []}
              whatWouldChangeYourMind={activeAnalysis.whatWouldChangeYourMind || []}
              onTriggerPerspectiveFlip={handleTriggerPerspectiveFlip}
              isFlippingPerspective={isFlipping}
            />

            {/* Bottom Footer Actions */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-center space-y-3">
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Remember: BLINDSIDE improves your reasoning, but you own the final decision.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setActiveAnalysis(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
                >
                  Analyze Another Decision
                </button>
                <button
                  onClick={handleCopyAnalysis}
                  className="px-4 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  {copied ? 'Copied Full Report' : 'Copy Full Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Perspective Flip Modal */}
      <PerspectiveFlipModal
        isOpen={isFlipOpen}
        onClose={() => setIsFlipOpen(false)}
        flipData={flipData}
        isLoading={isFlipping}
        error={flipError}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setActiveAnalysis(item);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onClear={handleClearHistory}
        onDeleteOne={handleDeleteHistoryItem}
      />
    </div>
  );
}
