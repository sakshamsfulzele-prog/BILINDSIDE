import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Blind Spot Main Analysis Schema
const blindSpotAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        decisionTitle: { type: Type.STRING, description: 'Concise title capturing the core choice' },
        coreDilemma: { type: Type.STRING, description: 'The fundamental tension or paradox at the center of the decision' },
        explicitFacts: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Facts explicitly provided and confirmed by the user in their prompt'
        },
        assumptionsIdentified: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Premises or assumptions the user appears to be taking for granted without proof'
        },
        uncertaintiesNoted: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Uncertainties or unknowns acknowledged directly or indirectly'
        }
      },
      required: ['decisionTitle', 'coreDilemma', 'explicitFacts', 'assumptionsIdentified', 'uncertaintiesNoted']
    },
    radarScores: {
      type: Type.ARRAY,
      description: 'Scores for 5 key dimensions representing blind spot exposure (0-100 where higher = higher risk / more under-examined)',
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: 'Category name (e.g. Financial & Opportunity Cost, Operational Bandwidth, Downside & Reversibility, Long-Term Alignment, Information Completeness)' },
          score: { type: Type.INTEGER, description: 'Risk exposure score 0-100' },
          label: { type: Type.STRING, description: 'Label such as Critical Blind Spot, High Exposure, Moderate, or Balanced' },
          description: { type: Type.STRING, description: 'Specific explanation of why this dimension is under-examined' },
          keyFlag: { type: Type.STRING, description: 'One single provocative sentence highlighting the hidden hazard' }
        },
        required: ['category', 'score', 'label', 'description', 'keyFlag']
      }
    },
    blindSpots: {
      type: Type.ARRAY,
      description: '3 to 5 distinct blind spots that the user is likely missing',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Punchy name of the blind spot' },
          severity: { type: Type.STRING, description: 'high, medium, or moderate' },
          explanation: { type: Type.STRING, description: 'Detailed breakdown of what is being overlooked' },
          whyItMatters: { type: Type.STRING, description: 'Why ignoring this could have severe compounding consequences' }
        },
        required: ['title', 'severity', 'explanation', 'whyItMatters']
      }
    },
    hiddenAssumptions: {
      type: Type.ARRAY,
      description: 'Assumption Stress Test items (3 to 4 items)',
      items: {
        type: Type.OBJECT,
        properties: {
          assumption: { type: Type.STRING, description: 'The unstated assumption' },
          whatMustBeTrue: { type: Type.STRING, description: 'What conditions must strictly hold true for this assumption not to collapse' },
          verifyingEvidence: { type: Type.STRING, description: 'Concrete empirical data or signals that would verify this assumption' },
          disprovingEvidence: { type: Type.STRING, description: 'Concrete counter-signals that would invalidate or disconfirm it' }
        },
        required: ['assumption', 'whatMustBeTrue', 'verifyingEvidence', 'disprovingEvidence']
      }
    },
    missingInformation: {
      type: Type.ARRAY,
      description: 'Critical missing information that should be gathered before deciding',
      items: {
        type: Type.OBJECT,
        properties: {
          missingFact: { type: Type.STRING, description: 'Specific data point or insight currently absent' },
          whereToFindIt: { type: Type.STRING, description: 'Actionable source or person to query' },
          riskOfNotKnowing: { type: Type.STRING, description: 'Downside penalty of deciding without this data' }
        },
        required: ['missingFact', 'whereToFindIt', 'riskOfNotKnowing']
      }
    },
    reasoningConflicts: {
      type: Type.ARRAY,
      description: 'Internal contradictions, trade-offs, or competing motives',
      items: {
        type: Type.OBJECT,
        properties: {
          tradeOff: { type: Type.STRING, description: 'Name of the conflicting dynamic' },
          conflictDescription: { type: Type.STRING, description: 'Why these two desires or outcomes cannot be easily reconciled' },
          incompatibleDesires: { type: Type.STRING, description: 'The two mutually resistant goals the user is trying to preserve simultaneously' }
        },
        required: ['tradeOff', 'conflictDescription', 'incompatibleDesires']
      }
    },
    secondOrderEffects: {
      type: Type.ARRAY,
      description: 'Downstream, delayed, or cascading consequences',
      items: {
        type: Type.OBJECT,
        properties: {
          immediateChoice: { type: Type.STRING, description: 'The trigger action' },
          firstOrderEffect: { type: Type.STRING, description: 'Direct immediate consequence' },
          secondOrderEffect: { type: Type.STRING, description: 'Subsequent knock-on effect (3-12 months out)' },
          systemicImpact: { type: Type.STRING, description: 'Broad compounding impact on career, relationships, or optionality' }
        },
        required: ['immediateChoice', 'firstOrderEffect', 'secondOrderEffect', 'systemicImpact']
      }
    },
    counterPerspective: {
      type: Type.OBJECT,
      properties: {
        steelmanStance: { type: Type.STRING, description: 'Title of the strongest counter-position' },
        coreArguments: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Compelling arguments against the user current leaning'
        },
        vulnerabilityInCurrentThinking: { type: Type.STRING, description: 'The fragile premise in the user current stance' }
      },
      required: ['steelmanStance', 'coreArguments', 'vulnerabilityInCurrentThinking']
    },
    criticalQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '5 incisive, uncomfortably clarifying questions that force deeper reflection'
    },
    whatWouldChangeYourMind: {
      type: Type.ARRAY,
      description: '3 testable discoveries that could completely flip the user thinking',
      items: {
        type: Type.OBJECT,
        properties: {
          triggerCondition: { type: Type.STRING, description: 'Hypothetical finding or event' },
          potentialImpact: { type: Type.STRING, description: 'How it invalidates the current thinking' },
          actionToTestNow: { type: Type.STRING, description: 'Quick probe or question to test this today' }
        },
        required: ['triggerCondition', 'potentialImpact', 'actionToTestNow']
      }
    }
  },
  required: [
    'summary',
    'radarScores',
    'blindSpots',
    'hiddenAssumptions',
    'missingInformation',
    'reasoningConflicts',
    'secondOrderEffects',
    'counterPerspective',
    'criticalQuestions',
    'whatWouldChangeYourMind'
  ]
};

// 2. Perspective Flip Schema
const perspectiveFlipSchema = {
  type: Type.OBJECT,
  properties: {
    opposingPositionTitle: { type: Type.STRING, description: 'Title representing the complete opposing stance' },
    opposingCorePhilosophy: { type: Type.STRING, description: 'The philosophical or strategic thesis behind this counter-perspective' },
    keyArguments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          point: { type: Type.STRING, description: 'Core counter-argument point' },
          counterpointToUser: { type: Type.STRING, description: 'Direct challenge to the user unstated beliefs' },
          realWorldPrecedentOrAnalogy: { type: Type.STRING, description: 'A tangible historical parallel, industry case, or cognitive analogy' }
        },
        required: ['point', 'counterpointToUser', 'realWorldPrecedentOrAnalogy']
      }
    },
    hiddenCostsOfUsersLeaning: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Overlooked penalties and taxes of pursuing the user current preference'
    },
    theSunkCostTrap: { type: Type.STRING, description: 'How emotional investment or prior effort might be skewing the user objectivity' },
    alternativeFrames: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          frameworkName: { type: Type.STRING, description: 'Mental model name (e.g. Regret Minimization, Inversion, Opportunity Cost Audit)' },
          freshFraming: { type: Type.STRING, description: 'How viewing the dilemma through this lens alters the perception' }
        },
        required: ['frameworkName', 'freshFraming']
      }
    },
    questionsTheOpponentWouldAsk: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 sharp, unsparing questions from the counter-position'
    }
  },
  required: [
    'opposingPositionTitle',
    'opposingCorePhilosophy',
    'keyArguments',
    'hiddenCostsOfUsersLeaning',
    'theSunkCostTrap',
    'alternativeFrames',
    'questionsTheOpponentWouldAsk'
  ]
};

// Resilient generation helper with model fallback and retries
async function generateStructuredJsonWithRetry(options: {
  contents: string;
  systemInstruction: string;
  responseSchema: any;
}): Promise<string> {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai!.models.generateContent({
          model,
          contents: options.contents,
          config: {
            systemInstruction: options.systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: options.responseSchema,
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        console.warn(`[Gemini] Model ${model} attempt ${attempt} failed: ${errMsg}`);
        // If 503 or transient rate limit, wait briefly
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError || new Error('AI analysis service temporarily unavailable. Please retry in a moment.');
}

// POST /api/analyze
app.post('/api/analyze', async (req, res) => {
  try {
    const { decision, priorities, leaning, uncertainties } = req.body;

    if (!decision || typeof decision !== 'string' || decision.trim().length < 8) {
      return res.status(400).json({ error: 'Please describe your decision in at least 8 characters.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API is not configured on this server. Please ensure GEMINI_API_KEY is provided in the Secrets panel.'
      });
    }

    const userPrompt = `
DECISION UNDER SCRUTINY:
${decision}

${priorities ? `WHAT MATTERS MOST TO THE USER:\n${priorities}\n` : ''}
${leaning ? `WHAT THE USER IS CURRENTLY LEANING TOWARD:\n${leaning}\n` : ''}
${uncertainties ? `WHAT THE USER IS UNCERTAIN ABOUT:\n${uncertainties}\n` : ''}

CRITICAL OPERATIONAL RULES FOR BLINDSIDE:
1. NEVER make the decision for the user. NEVER say "you should choose X", "Option A is better", or provide a recommendation.
2. The product exists solely to improve critical thinking, surface blind spots, stress-test hidden assumptions, identify second-order effects, and ask probing questions.
3. Distinguish sharply between:
   - Facts explicitly stated by the user
   - Assumptions they are making without verification
   - Future possibilities vs guaranteed outcomes
   - Critical missing information they do not currently have.
4. Do NOT fabricate facts. Keep radar categories sharp, realistic, and directly tailored to the user's specific scenario.
5. Provide a rigorous, intellectually honest analysis with clear prose and high-density insight.
`;

    const text = await generateStructuredJsonWithRetry({
      contents: userPrompt,
      systemInstruction: `You are BLINDSIDE: an elite, hyper-rigorous cognitive analyst and critical-thinking partner.
Your mission is to reveal what the user's decision is hiding.
CRITICAL MANDATE: NEVER make the decision for the user. Never say "you should", never endorse one path, never rank options as winner/loser. Instead, interrogate their reasoning, illuminate systemic blind spots, stress-test their premises, trace second-order consequences, and frame questions that expose under-examined trade-offs.`,
      responseSchema: blindSpotAnalysisSchema,
    });

    const parsedData = JSON.parse(text);
    const enrichedData = {
      ...parsedData,
      id: `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      userInput: { decision, priorities, leaning, uncertainties },
    };

    res.json(enrichedData);
  } catch (error: any) {
    console.error('Error during /api/analyze:', error);
    let message = error.message || 'Failed to complete blind spot analysis. Please try again.';
    try {
      const parsedInner = JSON.parse(message);
      if (parsedInner?.error?.message) {
        message = parsedInner.error.message;
      }
    } catch (_) {}

    res.status(500).json({ error: message });
  }
});

// POST /api/perspective-flip
app.post('/api/perspective-flip', async (req, res) => {
  try {
    const { decision, priorities, leaning, uncertainties, currentAnalysisSummary } = req.body;

    if (!decision || typeof decision !== 'string') {
      return res.status(400).json({ error: 'Valid decision text is required.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API is not configured on this server. Please ensure GEMINI_API_KEY is provided.'
      });
    }

    const flipPrompt = `
THE USER'S DILEMMA:
${decision}

${leaning ? `CURRENT LEANING / PREFERENCE:\n${leaning}\n` : ''}
${priorities ? `STATED PRIORITIES:\n${priorities}\n` : ''}
${uncertainties ? `NOTED UNCERTAINTIES:\n${uncertainties}\n` : ''}
${currentAnalysisSummary ? `CONTEXT FROM PREVIOUS ANALYSIS:\n${currentAnalysisSummary}\n` : ''}

TASK FOR PERSPECTIVE FLIP:
Construct the strongest, most coherent, steel-manned counter-perspective against the user's current stance or default leaning.
If the user is leaning toward Action A, build the compelling, intellectually rigorous case for Action B (or for doing nothing / delaying / rethinking the premise).
CRITICAL RULE: Do NOT say "You must choose this" or make the decision for the user. Present this counter-perspective as an articulate devil's advocate and strategic peer pushing them to confront the hidden costs, unacknowledged risks, and sunk-cost traps in their current posture.
`;

    const text = await generateStructuredJsonWithRetry({
      contents: flipPrompt,
      systemInstruction: `You are the Perspective Flip engine of BLINDSIDE.
Your goal is to steel-man the strongest reasonable opposing stance to the user's inclination. You never make the decision for the user, but you shatter comfortable assumptions and highlight the hidden virtues of the alternative path.`,
      responseSchema: perspectiveFlipSchema,
    });

    const parsedFlip = JSON.parse(text);
    res.json(parsedFlip);
  } catch (error: any) {
    console.error('Error during /api/perspective-flip:', error);
    let message = error.message || 'Failed to generate perspective flip. Please try again.';
    try {
      const parsedInner = JSON.parse(message);
      if (parsedInner?.error?.message) {
        message = parsedInner.error.message;
      }
    } catch (_) {}

    res.status(500).json({ error: message });
  }
});

// Setup Vite middleware or static serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BLINDSIDE server active on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic();
