export interface DecisionInput {
  decision: string;
  priorities?: string;
  leaning?: string;
  uncertainties?: string;
}

export interface RadarCategory {
  category: string;
  score: number; // 0 to 100 representing blind spot risk / under-examined depth
  label: string;
  description: string;
  keyFlag: string;
}

export interface BlindSpotItem {
  title: string;
  severity: 'high' | 'medium' | 'moderate';
  explanation: string;
  whyItMatters: string;
}

export interface HiddenAssumptionItem {
  assumption: string;
  whatMustBeTrue: string;
  verifyingEvidence: string;
  disprovingEvidence: string;
}

export interface MissingInformationItem {
  missingFact: string;
  whereToFindIt: string;
  riskOfNotKnowing: string;
}

export interface ReasoningConflictItem {
  tradeOff: string;
  conflictDescription: string;
  incompatibleDesires: string;
}

export interface SecondOrderEffectItem {
  immediateChoice: string;
  firstOrderEffect: string;
  secondOrderEffect: string;
  systemicImpact: string;
}

export interface CounterPerspectiveItem {
  steelmanStance: string;
  coreArguments: string[];
  vulnerabilityInCurrentThinking: string;
}

export interface MindChangeTrigger {
  triggerCondition: string;
  potentialImpact: string;
  actionToTestNow: string;
}

export interface BlindSpotAnalysis {
  id: string;
  timestamp: number;
  userInput: DecisionInput;
  summary: {
    decisionTitle: string;
    coreDilemma: string;
    explicitFacts: string[];
    assumptionsIdentified: string[];
    uncertaintiesNoted: string[];
  };
  radarScores: RadarCategory[];
  blindSpots: BlindSpotItem[];
  hiddenAssumptions: HiddenAssumptionItem[];
  missingInformation: MissingInformationItem[];
  reasoningConflicts: ReasoningConflictItem[];
  secondOrderEffects: SecondOrderEffectItem[];
  counterPerspective: CounterPerspectiveItem;
  criticalQuestions: string[];
  whatWouldChangeYourMind: MindChangeTrigger[];
}

export interface PerspectiveFlipResult {
  opposingPositionTitle: string;
  opposingCorePhilosophy: string;
  keyArguments: {
    point: string;
    counterpointToUser: string;
    realWorldPrecedentOrAnalogy: string;
  }[];
  hiddenCostsOfUsersLeaning: string[];
  theSunkCostTrap: string;
  alternativeFrames: {
    frameworkName: string;
    freshFraming: string;
  }[];
  questionsTheOpponentWouldAsk: string[];
}
