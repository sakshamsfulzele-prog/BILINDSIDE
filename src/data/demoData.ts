import { BlindSpotAnalysis, PerspectiveFlipResult } from '../types/blindspot';

export const DEMO_INPUT = {
  decision: "Should I accept a 6-month off-campus software internship at a high-growth startup, or stay on campus to complete my final college semester and capstone project on schedule?",
  priorities: "Real-world engineering experience, competitive stipend ($45/hr), brand name on resume, graduating without delaying degree.",
  leaning: "Leaning toward accepting the internship because hands-on industry experience feels more valuable than lectures, and the stipend helps pay down loans.",
  uncertainties: "Whether 55+ weekly hours will force me to drop college courses, remote vs in-office relocation costs in SF, and whether the startup will actually convert interns into full-time roles."
};

export const DEMO_ANALYSIS: BlindSpotAnalysis = {
  id: "demo-internship-decision",
  timestamp: Date.now(),
  userInput: DEMO_INPUT,
  summary: {
    decisionTitle: "Startup 6-Month Internship vs. On-Campus Final Semester",
    coreDilemma: "Balancing immediate career acceleration & high stipend against graduation continuity, burnout risk, and academic standing.",
    explicitFacts: [
      "Internship duration is 6 months at a high-growth software startup.",
      "Offered stipend is $45/hour.",
      "Requires decision between off-campus internship and on-campus final college semester / capstone.",
      "Startup working hours are estimated at 55+ hours weekly.",
      "Location involves potential relocation to San Francisco."
    ],
    assumptionsIdentified: [
      "Assuming high-intensity 55+ hr startup culture allows concurrent remote course completion.",
      "Assuming $45/hr stipend yields net savings despite SF short-term lease & living costs.",
      "Assuming the internship automatically boosts employment prospects more than a finished degree with high GPA.",
      "Assuming the startup will offer full-time conversion or return offers upon completion."
    ],
    uncertaintiesNoted: [
      "Impact of working hours on academic credit requirements.",
      "True net financial outcome after SF short-term housing inflation.",
      "Actual rate of full-time intern conversion in current macroeconomic climate."
    ]
  },
  radarScores: [
    {
      category: "Academic & Institutional Risk",
      score: 84,
      label: "Critical Blind Spot",
      description: "Severe exposure regarding university credit caps, capstone team abandonment, and non-linear graduation delay penalties.",
      keyFlag: "University accreditation requirements may forbid concurrent full-time employment."
    },
    {
      category: "True Net Financial Reality",
      score: 72,
      label: "Substantial Blind Spot",
      description: "SF short-term furnished leases and double taxation can consume up to 68% of post-tax stipend earnings.",
      keyFlag: "Relocation and living expenses may eliminate anticipated loan payoff gains."
    },
    {
      category: "Operational & Energy Bandwidth",
      score: 88,
      label: "High Cognitive Load",
      description: "55+ weekly startup sprint hours leave virtually zero cognitive margin for senior-level engineering coursework.",
      keyFlag: "Burnout probability spikes when combining production deployments with term finals."
    },
    {
      category: "Reversibility & Downside Floor",
      score: 65,
      label: "Moderate Exposure",
      description: "Dropping courses halfway through is costly, while deferring an internship offer or negotiating summer timing is often feasible.",
      keyFlag: "Internship cancellation or startup pivot leaves you without either degree or job."
    },
    {
      category: "Conversion & Market Value",
      score: 58,
      label: "Unverified Premise",
      description: "Startup headcount freezes frequently hit interns first, regardless of personal performance.",
      keyFlag: "Conversion rates in venture-backed tech can shift overnight based on fundraising."
    }
  ],
  blindSpots: [
    {
      title: "The Capstone Teammate Dependency & Institutional Penalty",
      severity: "high",
      explanation: "College capstone projects require coordinated group milestones. Stepping away or participating asynchronously often breaches academic department policy, which can defer graduation by a full academic year rather than just 6 months if the capstone sequence is only offered once annually.",
      whyItMatters: "A 1-year degree delay carries massive opportunity costs that exceed the 6-month gross stipend."
    },
    {
      title: "San Francisco Short-Term Housing Friction & Net Math",
      severity: "high",
      explanation: "A $45/hr gross stipend equates to ~$7,200/mo pre-tax, leaving roughly ~$5,200 post-tax. Month-to-month furnished rentals, security deposits, California state taxes, and daily SF transit/food routinely exceed $3,600/mo, leaving negligible net savings to service debt.",
      whyItMatters: "The financial motivation powering the decision may be an illusion without verified lease quotes."
    },
    {
      title: "The Unspoken Early-Stage Startup Intern Dynamic",
      severity: "medium",
      explanation: "High-growth startups operating at 55+ hrs/week often lack structured mentorship programs. Interns are frequently pulled into ad-hoc fire-fighting and boilerplate maintenance rather than architectural design.",
      whyItMatters: "The perceived learning premium over university research might fail to materialize."
    },
    {
      title: "The Hidden Leverage of the 'Deferred Counter-Proposal'",
      severity: "medium",
      explanation: "Candidates often treat offers as binary ('Take it now' vs 'Reject forever'). Most seed-to-Series-B startups are eager to postpone a start date to post-graduation or convert the role into a permanent new-grad offer.",
      whyItMatters: "You may be accepting severe trade-offs without testing whether the counterparty is flexible."
    }
  ],
  hiddenAssumptions: [
    {
      assumption: "I can simultaneously pass 12-15 academic credits while working 55+ hours per week at high performance.",
      whatMustBeTrue: "The academic professors must grant attendance waivers, exam rescheduling, and asynchronous lab access, while your mental endurance must sustain 75 combined weekly working hours without sleep deprivation.",
      verifyingEvidence: "Written, pre-approved accommodation letters from faculty deans and specific course coordinators.",
      disprovingEvidence: "Department syllabus stating mandatory in-person presentations or unbendable final examination schedules."
    },
    {
      assumption: "Accepting now provides greater career trajectory than entering the market 6 months later with a finalized degree in hand.",
      whatMustBeTrue: "The startup's brand recognition among hiring managers must significantly outweigh the risk of an incomplete bachelor's transcript during background verification.",
      verifyingEvidence: "Alumni from that specific startup who transitioned to Tier-1 firms without an immediate degree.",
      disprovingEvidence: "Enterprise hiring filters (especially at top tech firms) that reject applicants lacking conferral dates."
    },
    {
      assumption: "The startup's offer of full-time conversion is structurally viable for their runway.",
      whatMustBeTrue: "The startup has at least 18-24 months of verified cash runway and an approved hiring plan for junior roles in Q3/Q4.",
      verifyingEvidence: "Direct confirmation from leadership of historical intern-to-FTE conversion ratios (>60%).",
      disprovingEvidence: "Recent hiring freezes, down-rounds, or a history of rotating interns as low-cost contractor substitutes."
    }
  ],
  missingInformation: [
    {
      missingFact: "University Academic Deferral & Capstone Re-Enrollment Rules",
      whereToFindIt: "Department academic advisor & registrar handbook.",
      riskOfNotKnowing: "Discovering mid-internship that you cannot graduate without waiting until the subsequent spring semester."
    },
    {
      missingFact: "Team Mentorship Ratio & Actual Intern Engineering Projects",
      whereToFindIt: "Direct messages with past 2 interns via LinkedIn who worked on that specific engineering team.",
      riskOfNotKnowing: "Spending 6 months doing QA testing or unresolved customer ticket triage instead of core systems coding."
    },
    {
      missingFact: "Verified Relocation Allowance & SF Sublet Reality",
      whereToFindIt: "Recruiter compensation breakdown and Craigslist/FurnishedFinder SF market checks.",
      riskOfNotKnowing: "Depleting emergency savings to cover upfront lease deposits and moving overhead."
    }
  ],
  reasoningConflicts: [
    {
      tradeOff: "Stipend Growth vs. Degree Finalization",
      conflictDescription: "You are prioritizing immediate cash flow ($45/hr) to tackle student loans, yet risking an educational delay that postpones full-time engineering compensation ($120k-$170k+ baseline).",
      incompatibleDesires: "Wanting to de-risk finances in the immediate 6 months while potentially stalling full-time earning capacity by 12 months."
    },
    {
      tradeOff: "Maximized Learning vs. Mental Bandwidth Saturation",
      conflictDescription: "You desire accelerated technical mastery, but pairing high-stress startup expectations with academic course deadlines induces chronic fatigue, degrading learning retention in both domains.",
      incompatibleDesires: "Striving for peak professional evaluation while treating a full-time academic load as an afterthought."
    }
  ],
  secondOrderEffects: [
    {
      immediateChoice: "Accept 6-month internship and attempt night coursework",
      firstOrderEffect: "Sleep deprivation and compromised performance on early sprint deliverables.",
      secondOrderEffect: "Startup management perceives lack of full commitment; capstone teammates lodge complaints with department chair.",
      systemicImpact: "Damaged professional references from both your first employer and key academic mentors."
    },
    {
      immediateChoice: "Propose a start date deferred until graduation day",
      firstOrderEffect: "Startup either accepts with enthusiasm or requests an alternative timeline.",
      secondOrderEffect: "You complete the degree with full honors, zero capstone friction, and undivided attention.",
      systemicImpact: "You enter the job market with both an unblemished degree credential and validated professional standing."
    }
  ],
  counterPerspective: {
    steelmanStance: "The Conservative Academic Finish-Line: A completed degree is an irreversible asset; early startup internships are ephemeral.",
    coreArguments: [
      "In a volatile macroeconomic environment, candidate credentials undergo heightened scrutiny. A completed BS/BA acts as an unassailable baseline, whereas an uncompleted degree raises red flags in HR automated screens.",
      "The perceived urgency of this specific startup is an emotional illusion. Startups recruit interns continuously; having your degree locked down unlocks full equity compensation and higher seniority titles immediately.",
      "Fragmented attention guarantees mediocrity across both fronts. Delivering exceptional work on one front builds stronger recommendations than surviving both at 60% capacity."
    ],
    vulnerabilityInCurrentThinking: "Overvaluing the novelty of an off-campus offer while discounting the compounded cost of breaking your graduation momentum."
  },
  criticalQuestions: [
    "If the startup fails or conducts layoffs 3 months into the internship, what is your immediate institutional safety net?",
    "Have you asked the hiring manager point-blank: 'If I accept, would you support deferring my start until my graduation in June?'",
    "What is the net dollar difference between (6 months stipend minus SF living costs) versus (graduating 6 months earlier into a full-time $130k base salary)?",
    "How will you respond when your engineering lead asks you to work over the weekend during your final exam week?",
    "If your university requires you to retake the entire capstone sequence next year, does this decision still make strategic sense?"
  ],
  whatWouldChangeYourMind: [
    {
      triggerCondition: "Startup agrees in writing to a hybrid schedule (25 hrs/week during school) or defers full-time start to post-graduation.",
      potentialImpact: "Eliminates the academic collision entirely, allowing you to capture both benefits.",
      actionToTestNow: "Email recruiter today: 'I am thrilled by this role. Because my capstone is non-deferrable, can we explore a June start date or part-time bridge?'"
    },
    {
      triggerCondition: "Academic Dean confirms in writing that the capstone cannot be completed remotely and requires 12 months delay.",
      potentialImpact: "Makes the internship cost mathematically punitive compared to lost full-time new-grad wages.",
      actionToTestNow: "Schedule a 15-minute advisor appointment tomorrow morning to examine course prerequisites."
    },
    {
      triggerCondition: "Detailed budget reveals net SF savings are under $800/month after rent, food, and tax.",
      potentialImpact: "Disproves the financial justification for taking on massive operational strain.",
      actionToTestNow: "Build a realistic 1-page SF cost-of-living ledger with actual Airbnb/sublet quotes."
    }
  ]
};

export const DEMO_PERSPECTIVE_FLIP: PerspectiveFlipResult = {
  opposingPositionTitle: "The Institutional Completionist Case: Finish the Degree First",
  opposingCorePhilosophy: "Momentum in academia is fragile. Do not trade permanent equity-grade credentials for transient apprentice-tier labor.",
  keyArguments: [
    {
      point: "The False Binary of 'Now or Never'",
      counterpointToUser: "The startup wants your skills today at intern rates ($45/hr) with no health benefits or equity. If you are qualified enough to earn their offer today, you are even more qualified to interview for their full-time engineering pool upon graduation in 4 months.",
      realWorldPrecedentOrAnalogy: "Elite athletics and medical residencies: pausing credentials mid-flight routinely stalls career progression rather than accelerates it."
    },
    {
      point: "The Asymmetry of Risk",
      counterpointToUser: "If the startup's revenue misses projections, they can terminate your contract on 24 hours notice with zero severance. Conversely, your university will not revoke your degree once conferred.",
      realWorldPrecedentOrAnalogy: "During tech downturns, uncompleted student interns without conferred degrees are unable to pivot to large defense, enterprise, or government contracts that mandate accredited diplomas."
    },
    {
      point: "The Hidden Cost of Academic Context Switching",
      counterpointToUser: "Engineering requires deep flow. Juggling production incident pagers at 2 AM with a distributed systems final at 9 AM results in sub-par performance in both arenas.",
      realWorldPrecedentOrAnalogy: "High-stakes multi-tasking leads to a 40% drop in cognitive efficiency, causing interns to receive 'meets expectations' rather than 'exceeds expectations' return offers."
    }
  ],
  hiddenCostsOfUsersLeaning: [
    "Loss of campus recruiting pipelines and career fairs where competing new-grad offers can be leveraged.",
    "Burned goodwill with capstone teammates who must absorb your abandoned project workload.",
    "Tax bracket jump and California non-resident state filing complications.",
    "Emotional exhaustion preventing personal software portfolio building."
  ],
  theSunkCostTrap: "Feeling that rejecting this internship 'wastes' the grueling interview preparation you endured, leading you to accept sub-optimal terms out of psychological momentum.",
  alternativeFrames: [
    {
      frameworkName: "The Optionality Maximizer",
      freshFraming: "Treat the offer as validation of your market readiness. Use the offer letter as immediate leverage to negotiate accelerated final semester projects or lock in summer start dates across 3 other firms."
    },
    {
      frameworkName: "Regret Minimization in 5 Years",
      freshFraming: "In 2031, you will not remember whether you started full-time work in January or June. You will, however, carry the friction of an incomplete transcript if graduate school or international work visas (e.g., H1B/TN/E3) require certified degree documentation."
    }
  ],
  questionsTheOpponentWouldAsk: [
    "Why are you treating a junior internship as a lifetime pinnacle rather than the opening bid of your career?",
    "If this company truly values you, why won't they hold the seat until you finish your final coursework?",
    "Are you running toward this internship, or running away from the friction of your senior academic commitments?"
  ]
};
