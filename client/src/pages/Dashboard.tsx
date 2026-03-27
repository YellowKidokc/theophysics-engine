import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ChevronRight,
  Database,
  FileText,
  MessageSquare,
  Search,
  Settings,
  Zap,
  Globe,
  Link2,
  Box,
  BrainCircuit,
  Waves,
  Gavel,
  Users,
  Download,
  Scale,
  ExternalLink,
  GitBranch,
  Play,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  PanelLeftOpen,
  PanelRightOpen,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  YAxis,
} from "recharts";

// Type guide data from the 14 canonical Type files
const TYPE_GUIDE: Record<string, { name: string; role: string; description: string; example: string; exampleId: string }> = {
  "01_Axioms": {
    name: "Axiom",
    role: "Foundation",
    description: "A self-evident truth accepted without proof. Axioms are the bedrock of the entire system — every theorem, corollary, and prediction traces back to these. They cannot be derived from anything simpler within the framework.",
    example: "A1.1 — Reality Exists: Something exists rather than nothing. This is the irreducible starting point that no rational system can deny without self-contradiction.",
    exampleId: "A1.1",
  },
  "02_Definitions": {
    name: "Definition",
    role: "Formal Language",
    description: "A precise specification of what a term means within Theophysics. Definitions fix vocabulary so that every axiom, theorem, and equation uses words with exact, shared meaning — eliminating ambiguity before argument begins.",
    example: "D2.1 — The chi-Field: The self-grounding informational substrate that satisfies axioms A2.1 and A2.2. Not a metaphor — a formally defined entity with specific mathematical properties.",
    exampleId: "D2.1",
  },
  "03_Lemmas": {
    name: "Lemma",
    role: "Stepping Stone",
    description: "A proven intermediate result used to build toward a larger theorem. Lemmas handle the heavy technical lifting so that the main theorems can be stated cleanly. They are fully proven, not assumed.",
    example: "LN3.1 — Coherence Monotonicity: Under specified conditions, the coherence function C is monotonically non-decreasing. This lemma feeds directly into the proof of the Coherence Theorem.",
    exampleId: "LN3.1",
  },
  "04_Equations": {
    name: "Equation",
    role: "Quantitative Law",
    description: "A mathematical relationship that makes the framework computable. Equations translate conceptual claims into formulas that can be tested, simulated, and falsified. They are where Theophysics meets measurement.",
    example: "E1.1 — The Master Equation: chi = G * M * E * (1/(1+S)) * T * K * R * Q * F * C. The single equation that encodes all ten laws into one computable expression.",
    exampleId: "E1.1",
  },
  "05_Propositions": {
    name: "Proposition",
    role: "Derived Claim",
    description: "A statement that follows logically from axioms and definitions but has not yet risen to the status of a full theorem. Propositions are claims the system makes — each one traceable to its logical parents.",
    example: "P1.1 — Information Requires Substrate: Any information-bearing system requires a physical or formal substrate. Derived from A1.3 (Information is Fundamental) and A2.1 (Substrate Requirement).",
    exampleId: "P1.1",
  },
  "06_Theorems": {
    name: "Theorem",
    role: "Major Result",
    description: "A rigorously proven statement that constitutes a major claim of the framework. Theorems are the payoff — they tell you what the axioms actually imply when you follow the logic all the way through.",
    example: "T3.1 — The Coherence Theorem: In any system satisfying the ten laws, coherence C converges to a fixed point under grace injection. This is the central structural result of Theophysics.",
    exampleId: "T3.1",
  },
  "07_Bridge": {
    name: "Bridge (Identification)",
    role: "Cross-Domain Link",
    description: "A formal identification between a physics concept and a theological concept. Bridges are the most distinctive feature of Theophysics — they claim that two things from different domains are structurally the same thing, not merely analogous.",
    example: "ID1.1 — Gravity-Grace Identification: The mathematical structure of gravitational attraction IS the mathematical structure of grace. Same equations, same topology, different domain.",
    exampleId: "ID1.1",
  },
  "08_Corollaries": {
    name: "Corollary",
    role: "Direct Consequence",
    description: "A result that follows immediately from a theorem with little or no additional proof. Corollaries are the low-hanging fruit that a theorem hands you — once the theorem is proven, the corollary is nearly automatic.",
    example: "C3.1 — Grace Necessity: If coherence requires a fixed point (Theorem T3.1), then an open-system grace source is necessary for any finite agent to reach it.",
    exampleId: "C3.1",
  },
  "09_Ontological": {
    name: "Ontological Axiom",
    role: "Existence Claim",
    description: "An axiom that asserts something about what exists or must exist. Ontological axioms go beyond logical structure to make claims about the furniture of reality — what the universe actually contains.",
    example: "O1.1 — Consciousness Exists: Subjective experience is a real feature of reality, not an illusion or epiphenomenon. This cannot be derived — it must be accepted or denied.",
    exampleId: "O1.1",
  },
  "10_Boundary": {
    name: "Boundary Condition",
    role: "Limit & Constraint",
    description: "A condition that specifies what happens at the edges of the system — at t=0, at infinity, at maximum entropy, at perfect coherence. Boundary conditions prevent the equations from producing nonsense at extremes.",
    example: "B1.1 — Initial Coherence: At t=0, C(0) > 0. The universe begins with nonzero coherence. Without this boundary condition, the Master Equation has no well-defined starting point.",
    exampleId: "B1.1",
  },
  "11_Evidence": {
    name: "Evidence",
    role: "Empirical Anchor",
    description: "A documented empirical result from published research that supports or constrains the framework. Evidence nodes connect Theophysics to the real world — they are what separates this from pure philosophy.",
    example: "EV1.1 — PEAR Lab Results: 6-sigma deviation in random event generators correlated with conscious intent (Princeton, 1979-2007). Direct empirical support for consciousness-quantum coupling.",
    exampleId: "EV1.1",
  },
  "12_Experiments": {
    name: "Experiment",
    role: "Proposed Test",
    description: "A specific experimental protocol designed to test a prediction of the framework. Experiments are how Theophysics puts itself at risk — each one is a chance for the framework to be falsified.",
    example: "EXP1.1 — Dorothy Protocol: Double-blind RNG experiment testing whether conscious intent biases quantum collapse. 6-sigma threshold, pre-registered, publish-null commitment.",
    exampleId: "EXP1.1",
  },
  "13_Predictions": {
    name: "Prediction",
    role: "Testable Forecast",
    description: "A specific, falsifiable claim about what future observations will show. Predictions are the currency of science — a framework that makes no predictions is unfalsifiable and therefore unscientific.",
    example: "PRED1.1 — Euclid f-sigma-8: The chi-field predicts a specific growth rate suppression measurable by the Euclid satellite (October 2026). If the data disagrees, the framework is wounded.",
    exampleId: "PRED1.1",
  },
  "14_Protocols": {
    name: "Protocol",
    role: "Methodology",
    description: "A step-by-step procedure for conducting an experiment or validation. Protocols ensure reproducibility — anyone, anywhere, can run the same test and get the same answer.",
    example: "PROT1.1 — Pre-Registration Protocol: All Theophysics experiments must be pre-registered with hypotheses, methods, and analysis plans locked before data collection begins.",
    exampleId: "PROT1.1",
  },
  "15_Falsification": {
    name: "Falsification Criterion",
    role: "Kill Condition",
    description: "A specific condition that, if observed, would destroy part or all of the framework. Falsification criteria are the most honest thing a theory can publish — they tell the world exactly how to kill it.",
    example: "FALS1.1 — Coherence Violation: If a system satisfying all ten laws is found where coherence provably decreases under grace injection, the Coherence Theorem is false and the framework collapses.",
    exampleId: "FALS1.1",
  },
  "16_Open": {
    name: "Open Question",
    role: "Known Gap",
    description: "A question the framework cannot currently answer. Open questions are intellectual honesty made structural — they mark exactly where the frontier is and what work remains to be done.",
    example: "OPEN1.1 — Kappa Derivation: The coupling constant kappa is estimated but not derived from first principles. Until it is, the framework has a free parameter it cannot justify.",
    exampleId: "OPEN1.1",
  },
};

const GRAPH_DATA = [
  { time: '00:00', chi: 0.4, delta: 0.2, grace: 0.1 },
  { time: '04:00', chi: 0.6, delta: 0.3, grace: 0.4 },
  { time: '08:00', chi: 0.5, delta: 0.5, grace: 0.2 },
  { time: '12:00', chi: 0.8, delta: 0.2, grace: 0.7 },
  { time: '16:00', chi: 0.7, delta: 0.4, grace: 0.5 },
  { time: '20:00', chi: 0.9, delta: 0.1, grace: 0.8 },
];

const CHART_DATA = [
  { name: "Phys", val: 40 },
  { name: "Theo", val: 80 },
  { name: "Con", val: 65 },
  { name: "QM", val: 90 },
  { name: "Scr", val: 55 },
  { name: "Evd", val: 75 },
];

function StatusDot({ status }: { status: string }) {
  if (status === "Validated") return <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />;
  return <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />;
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeAxiomId, setActiveAxiomId] = useState("A1.2");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close panels when selecting an axiom on mobile
  const handleAxiomSelect = useCallback((nodeId: string) => {
    setActiveAxiomId(nodeId);
    if (isMobile) setLeftOpen(false);
  }, [isMobile]);

  const { data: categoriesData = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => fetch("/api/categories").then(r => r.json()),
  });

  // Always fetch all axioms for sidebar counts
  const { data: allAxioms = [] } = useQuery({
    queryKey: ["/api/axioms"],
    queryFn: () => fetch("/api/axioms").then(r => r.json()),
  });

  // Compute counts per category slug
  const categoryCounts: Record<string, number> = {};
  allAxioms.forEach((ax: any) => {
    if (ax.categorySlug) {
      categoryCounts[ax.categorySlug] = (categoryCounts[ax.categorySlug] || 0) + 1;
    }
  });

  const { data: axiomsList = [] } = useQuery({
    queryKey: ["/api/axioms", selectedCategory],
    queryFn: () => {
      const url = selectedCategory ? `/api/axioms?category=${selectedCategory}` : "/api/axioms";
      return fetch(url).then(r => r.json());
    },
  });

  const { data: activeAxiom } = useQuery({
    queryKey: ["/api/axioms", activeAxiomId],
    queryFn: () => fetch(`/api/axioms/${activeAxiomId}`).then(r => r.json()),
    enabled: !!activeAxiomId,
  });

  const objections = activeAxiom?.standardObjections || [];
  const crossExams = activeAxiom?.crossExaminations || [];
  const deps = activeAxiom?.dependencies || [];
  const enables = activeAxiom?.enables || [];
  const persp = activeAxiom?.perspectives || [];
  const notClaiming = activeAxiom?.notClaiming || [];

  return (
    <div className="flex h-screen bg-[#010409] text-slate-200 font-sans overflow-hidden relative">

      {/* Mobile backdrop - left */}
      {isMobile && leftOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setLeftOpen(false)} />
      )}
      {/* Mobile backdrop - right */}
      {isMobile && rightOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setRightOpen(false)} />
      )}

      {/* Mobile toggle buttons - fixed at bottom corners, thumb-friendly */}
      {isMobile && !leftOpen && !rightOpen && (
        <>
          <button
            onClick={() => setLeftOpen(true)}
            className="fixed bottom-6 left-4 z-50 w-14 h-14 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Open axiom index"
          >
            <PanelLeftOpen className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setRightOpen(true)}
            className="fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.4)] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Open metadata panel"
          >
            <PanelRightOpen className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Categories Nav */}
      <aside data-testid="sidebar-categories" className={`${isMobile ? 'hidden' : ''} w-64 border-r border-slate-800/40 flex flex-col bg-[#010409]`}>
        <div className="p-6 border-b border-slate-800/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
          <span className="font-black tracking-tighter text-lg uppercase italic">Categories</span>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`w-full flex items-center justify-between px-3 py-2 text-[10px] rounded-lg transition-all font-bold tracking-widest uppercase border ${
                selectedCategory === null 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                : 'text-slate-600 hover:text-slate-400 hover:bg-slate-900 border-transparent'
              }`}
              data-testid="btn-category-all"
            >
              <span>All Axioms</span>
              <span className="opacity-40 font-mono text-[8px]">{axiomsList.length}</span>
            </button>
            {categoriesData.map((cat: any) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[10px] rounded-lg transition-all font-bold tracking-widest uppercase border ${
                  selectedCategory === cat.slug 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]' 
                  : 'text-slate-600 hover:text-slate-400 hover:bg-slate-900 border-transparent'
                }`}
                data-testid={`btn-category-${cat.slug}`}
              >
                <span className="truncate">{cat.label}</span>
                {categoryCounts[cat.slug] > 0 && (
                  <span className="opacity-50 font-mono text-[8px] tabular-nums">{categoryCounts[cat.slug]}</span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-800/40">
           <Button variant="outline" className="w-full justify-start gap-3 border-slate-800 bg-slate-900/50 text-[10px] h-9 font-bold tracking-widest uppercase text-slate-500">
             <Scale className="w-3.5 h-3.5" />
             Axiom Flow
           </Button>
        </div>
      </aside>

      {/* Mobile close button for left panel - positioned inside the panel area */}
      {isMobile && leftOpen && (
        <button
          onClick={() => setLeftOpen(false)}
          className="fixed top-3 z-[60] w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg"
          style={{ left: 'min(85vw - 3rem, calc(24rem - 3rem))' }}
          aria-label="Close panel"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Axiom List */}
      <aside data-testid="sidebar-axioms" className={`${isMobile ? `fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-out ${leftOpen ? 'translate-x-0' : '-translate-x-full'} w-[85vw] max-w-sm` : 'w-72'} border-r border-slate-800/40 flex flex-col bg-[#010409] backdrop-blur-xl`}>
        <div className="p-6 border-b border-slate-800/40">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Axiom Spine</h2>
             <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/10 text-[9px]">{axiomsList.length} LOADED</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
            <input 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="Search Axioms..."
              data-testid="input-search-axioms"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-1">
            {/* Type Guide intro card */}
            {selectedCategory && TYPE_GUIDE[selectedCategory] && (
              <div className="mb-4 p-4 rounded-xl border border-blue-500/15 bg-blue-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.15em]">{TYPE_GUIDE[selectedCategory].name}</span>
                  <span className="text-[8px] text-slate-600 uppercase tracking-widest ml-auto">{TYPE_GUIDE[selectedCategory].role}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{TYPE_GUIDE[selectedCategory].description}</p>
                <div className="p-3 rounded-lg bg-[#010409] border border-slate-800/60">
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Example</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">{TYPE_GUIDE[selectedCategory].example}</p>
                </div>
              </div>
            )}
            {axiomsList.map((axiom: any) => (
              <button 
                key={axiom.id}
                onClick={() => handleAxiomSelect(axiom.nodeId)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs rounded-lg transition-all group border ${
                  activeAxiomId === axiom.nodeId 
                  ? 'bg-blue-500/5 text-blue-400 border-blue-500/20 shadow-[inset_0_0_15px_rgba(59,130,246,0.05)]' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
                data-testid={`btn-axiom-${axiom.nodeId}`}
              >
                <span className={`font-mono text-[10px] ${activeAxiomId === axiom.nodeId ? 'text-blue-400' : 'text-slate-600'}`}>{axiom.nodeId}</span>
                <span className="flex-1 text-left truncate font-medium">{axiom.title}</span>
                <StatusDot status={axiom.status} />
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#010409] via-[#02060f] to-[#010409]">
        
        <header className="h-16 border-b border-slate-800/40 flex items-center justify-between px-10 bg-[#010409]/60 backdrop-blur-md z-20">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono tracking-wider">
            <span className="hover:text-blue-400 cursor-pointer transition-colors uppercase">Theophysics</span>
            <ChevronRight className="w-3 h-3 text-slate-700" />
            <span className="text-slate-200 font-bold uppercase tracking-widest">{activeAxiom?.nodeId} — {activeAxiom?.title?.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" variant="outline" className="h-8 text-[10px] border-slate-800 bg-slate-900/50 hover:bg-slate-800" data-testid="btn-download">
               <Download className="w-3.5 h-3.5 mr-2" />
               Download Paper
            </Button>
            <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 text-[10px] font-bold px-4 shadow-[0_0_20px_rgba(37,99,235,0.2)]" data-testid="btn-ai-sim">
              AI Simulation
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          {activeAxiom ? (
          <div className="max-w-5xl mx-auto p-12 space-y-16 pb-32">
            
            {/* Title */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-[10px] font-black tracking-[0.2em]">NODE: {activeAxiom.nodeId}</Badge>
                <Badge variant="outline" className="border-slate-800 text-slate-500 text-[9px]">{activeAxiom.objectType} • Stage {activeAxiom.stage}</Badge>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                <span className="text-4xl font-mono font-bold text-slate-800 tracking-tighter">{String(activeAxiom.chainPosition).padStart(3, '0')}/{activeAxiom.totalChain}</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-white" data-testid="text-axiom-title">{activeAxiom.title}</h1>
              {activeAxiom.formalStatement && (
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-light" data-testid="text-axiom-formal">{activeAxiom.formalStatement}</p>
              )}
            </div>

            {/* Accordion Drill-Down */}
            <Accordion type="multiple" defaultValue={['formal', 'common-sense', 'mappings', 'math', 'jury', 'objections', 'perspectives']} className="space-y-6">
              
              {/* Formal Statement */}
              {activeAxiom.formalStatement && (
              <AccordionItem value="formal" className="border-slate-800/40 bg-slate-900/20 rounded-2xl overflow-hidden px-4 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-slate-300 uppercase">Formal Statement & Foundation</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 px-12">
                  <div className="space-y-8">
                    <div className="p-8 bg-[#010409] rounded-xl border border-slate-800 font-mono text-2xl text-white font-medium shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                       {activeAxiom.formalStatement}
                    </div>
                    <div className="grid grid-cols-2 gap-12 text-sm leading-relaxed font-light">
                      {activeAxiom.intendedMeaning && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Intended Meaning</h4>
                          <p className="text-slate-400 italic">{activeAxiom.intendedMeaning}</p>
                        </div>
                      )}
                      {notClaiming.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Not Claiming</h4>
                          <ul className="space-y-2 text-slate-500 list-disc pl-4">
                            {notClaiming.map((nc: string, i: number) => <li key={i}>{nc}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              )}

              {/* Common Sense Layer */}
              {activeAxiom.commonSenseTruth && (
              <AccordionItem value="common-sense" className="border-slate-800/40 bg-emerald-500/5 rounded-2xl overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Lightbulb className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-slate-300 uppercase">Common Sense Truth</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 px-12">
                  <div className="bg-[#010409] p-8 rounded-xl border border-slate-800 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                      <Lightbulb className="w-16 h-16 text-emerald-400" />
                    </div>
                    <p className="text-xl font-medium text-slate-200 leading-relaxed italic pr-20" data-testid="text-common-sense">
                      "{activeAxiom.commonSenseTruth}"
                    </p>
                    {activeAxiom.commonSenseExplanation && (
                      <p className="text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-6">
                        {activeAxiom.commonSenseExplanation}
                      </p>
                    )}
                    {activeAxiom.commonSenseAccepted && (
                      <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
                         <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] uppercase font-bold tracking-widest">Accepted</Badge>
                         <p className="text-[11px] text-slate-500 italic">{activeAxiom.commonSenseAccepted}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              )}

              {/* Cross-Domain Mappings */}
              {(activeAxiom.physicsMapping || activeAxiom.theologyMapping) && (
              <AccordionItem value="mappings" className="border-slate-800/40 bg-slate-900/20 rounded-2xl overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <Globe className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-slate-300 uppercase">Cross-Domain Mappings</span>
                    {activeAxiom.bridgeCount > 0 && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px]">{activeAxiom.bridgeCount} BRIDGES</Badge>}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 px-12">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Physics", value: activeAxiom.physicsMapping, color: "blue" },
                      { label: "Theology", value: activeAxiom.theologyMapping, color: "amber" },
                      { label: "Consciousness", value: activeAxiom.consciousnessMapping, color: "purple" },
                      { label: "Quantum", value: activeAxiom.quantumMapping, color: "cyan" },
                      { label: "Scripture", value: activeAxiom.scriptureMapping, color: "amber" },
                      { label: "Evidence", value: activeAxiom.evidenceMapping, color: "emerald" },
                      { label: "Information", value: activeAxiom.informationMapping, color: "blue" },
                    ].filter(m => m.value).map(m => (
                      <div key={m.label} className="p-4 rounded-xl bg-[#010409] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 text-${m.color}-500`}>{m.label}</p>
                        <p className="text-sm text-slate-300">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              )}

              {/* Physics & Math Layer */}
              {(activeAxiom.physicsLayer || activeAxiom.mathLayer) && (
              <AccordionItem value="math" className="border-slate-800/40 bg-slate-900/20 rounded-2xl overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-slate-300 uppercase">Physics & Math Layer</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 px-12 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    {activeAxiom.physicsLayer && (
                      <Card className="p-6 bg-[#010409] border-slate-800">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-4">Physics Layer</h4>
                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{activeAxiom.physicsLayer}</p>
                      </Card>
                    )}
                    {activeAxiom.mathLayer && (
                      <Card className="p-6 bg-[#010409] border-slate-800">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-4">Math Layer</h4>
                        <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{activeAxiom.mathLayer}</p>
                      </Card>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              )}

              {/* Judge & Jury */}
              {activeAxiom.prosecutorDefense && (
              <AccordionItem value="jury" className="border-slate-800/40 bg-slate-900/20 rounded-2xl overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                      <Scale className="w-4 h-4 text-rose-500" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-slate-300 uppercase">Judge & Jury: The Argument</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 px-12 space-y-8">
                   <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-7 space-y-6">
                         <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-blue-400" />
                            <h4 className="text-sm font-black text-white uppercase tracking-tighter italic">The Prosecutor's Defense</h4>
                         </div>
                         <div className="bg-[#0d1117] p-8 rounded-2xl border border-slate-800 space-y-4 relative shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600 rounded-full" />
                            <p className="text-sm text-slate-300 leading-relaxed font-light first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-blue-500" data-testid="text-prosecutor">
                               {activeAxiom.prosecutorDefense}
                            </p>
                            {crossExams.length > 0 && (
                              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-800">
                                 {crossExams.map((ce: any, i: number) => (
                                   <button key={i} className="text-[10px] font-black text-blue-400 hover:text-blue-300 tracking-widest uppercase transition-colors">Cross: {ce.target}</button>
                                 ))}
                              </div>
                            )}
                         </div>
                         {crossExams.length > 0 && (
                           <div className="space-y-3">
                             {crossExams.map((ce: any, i: number) => (
                               <div key={i} className="p-6 rounded-xl bg-[#010409] border border-slate-800">
                                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">{ce.target}</p>
                                 <p className="text-xs text-slate-400 leading-relaxed italic">{ce.text}</p>
                               </div>
                             ))}
                           </div>
                         )}
                      </div>
                      <div className="col-span-5 space-y-6">
                         <div className="flex items-center gap-3">
                            <Gavel className="w-4 h-4 text-rose-500" />
                            <h4 className="text-sm font-black text-white uppercase tracking-tighter italic">The Verdict</h4>
                         </div>
                         {activeAxiom.verdict && (
                           <div className="bg-rose-500/5 p-8 rounded-2xl border border-rose-500/20 space-y-4 relative">
                              <div className="absolute top-0 right-0 p-4 opacity-5">
                                 <Gavel className="w-16 h-16 text-rose-500" />
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed italic font-medium relative z-10" data-testid="text-verdict">
                                 "{activeAxiom.verdict}"
                              </p>
                              <div className="flex justify-end pt-4">
                                 <Badge className="bg-rose-500 text-white font-black tracking-widest border-none px-4 py-1 shadow-[0_10px_20px_rgba(244,63,94,0.3)]">LOGICAL IMPERATIVE</Badge>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                </AccordionContent>
              </AccordionItem>
              )}

              {/* Standard Objections */}
              {objections.length > 0 && (
              <AccordionItem value="objections" className="border-slate-800/40 bg-slate-900/20 rounded-2xl overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <MessageSquare className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-slate-300 uppercase">Standard Objections ({objections.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 px-12 space-y-4">
                  {objections.map((obj: any, i: number) => (
                    <Card key={i} className="p-6 border-orange-500/20 bg-orange-500/5">
                      <div className="flex gap-6">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold shrink-0">{i + 1}</div>
                        <div className="space-y-4">
                          <h4 className="text-base font-bold text-slate-200">"{obj.objection}"</h4>
                          <div className="pl-6 border-l-2 border-blue-500/30 py-2">
                            <p className="text-sm text-slate-400 italic">{obj.response}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </AccordionContent>
              </AccordionItem>
              )}

              {/* Perspectives */}
              {persp.length > 0 && (
              <AccordionItem value="perspectives" className="border-slate-800/40 bg-slate-900/20 rounded-2xl overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-slate-300 uppercase">Explanatory Perspectives ({persp.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 px-12 space-y-4">
                  {persp.map((p: any, i: number) => (
                    <Card key={i} className="p-6 border-purple-500/20 bg-purple-500/5">
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">{p.name}</p>
                      {p.quote && <p className="text-sm text-slate-300 italic mb-4">"{p.quote}"</p>}
                      {p.assessment && <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-4">{p.assessment}</p>}
                    </Card>
                  ))}
                </AccordionContent>
              </AccordionItem>
              )}

            </Accordion>

            {/* Enables & Dependencies */}
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-800/40">
               <section className="space-y-6">
                  <div className="flex items-center gap-3">
                     <GitBranch className="w-4 h-4 text-blue-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Depends On ({deps.length})</span>
                  </div>
                  {deps.map((d: any) => (
                    <Card key={d.id} className="p-4 border-slate-800/40 bg-slate-900/10 hover:border-blue-500/20 transition-all cursor-pointer group" onClick={() => setActiveAxiomId(d.dependsOnNodeId)}>
                       <span className="text-[9px] font-mono text-slate-600 block mb-2 uppercase tracking-widest">{d.dependsOnNodeId}</span>
                       {d.description && <p className="text-[11px] text-slate-400">{d.description}</p>}
                    </Card>
                  ))}
                  {deps.length === 0 && <p className="text-xs text-slate-600 italic">Root axiom (no dependencies)</p>}
               </section>
               <section className="space-y-6">
                  <div className="flex items-center gap-3">
                     <ArrowRight className="w-4 h-4 text-emerald-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Enables ({enables.length})</span>
                  </div>
                  {enables.map((e: any) => (
                    <Card key={e.id} className="p-4 border-slate-800/40 bg-slate-900/10 hover:border-emerald-500/20 transition-all cursor-pointer group" onClick={() => setActiveAxiomId(e.enablesNodeId)}>
                       <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-mono text-slate-600 uppercase">{e.enablesNodeId}</span>
                          <ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-emerald-400 transition-colors" />
                       </div>
                       {e.description && <p className="text-[11px] text-slate-400">{e.description}</p>}
                    </Card>
                  ))}
               </section>
            </div>

            {/* Collapse Analysis */}
            {activeAxiom.collapseAnalysis && (
            <section className="space-y-6 pt-12 border-t border-slate-800/40">
               <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Collapse Analysis</span>
               </div>
               <Card className="p-8 border-rose-500/20 bg-rose-500/5">
                  <p className="text-sm font-light italic text-slate-300 leading-relaxed" data-testid="text-collapse">
                    {activeAxiom.collapseAnalysis}
                  </p>
               </Card>
            </section>
            )}

          </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600">
              <p className="text-sm">Select an axiom to view details</p>
            </div>
          )}
        </ScrollArea>
      </main>

      {/* Mobile close button for right panel */}
      {isMobile && rightOpen && (
        <button
          onClick={() => setRightOpen(false)}
          className="fixed top-4 left-4 z-[60] w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"
          aria-label="Close panel"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Right Sidebar */}
      <aside className={`${isMobile ? `fixed top-0 right-0 h-full z-50 transition-transform duration-300 ease-out ${rightOpen ? 'translate-x-0' : 'translate-x-full'} w-[85vw] max-w-sm flex` : 'hidden xl:flex w-80'} border-l border-slate-800/40 bg-[#010409] backdrop-blur-xl flex-col`}>
        <ScrollArea className="flex-1 p-8">
          {activeAxiom && (
          <div className="space-y-12">
            
            <section className="space-y-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Logic Metadata</p>
              <div className="space-y-4">
                 {[
                  { label: "Chain #", value: `${activeAxiom.chainPosition} of ${activeAxiom.totalChain}` },
                  { label: "Object", value: activeAxiom.objectType },
                  { label: "Stage", value: activeAxiom.stage },
                  { label: "Status", value: activeAxiom.status, color: activeAxiom.status === "Validated" ? "text-emerald-400" : "text-slate-400" },
                  { label: "CR Rating", value: activeAxiom.crRating, color: "text-rose-500" },
                  { label: "Bridge Count", value: String(activeAxiom.bridgeCount) },
                  { label: "Conflicts", value: String(activeAxiom.conflicts), color: activeAxiom.conflicts === 0 ? "text-emerald-400" : "text-rose-500" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-2 border-b border-slate-800/40 last:border-0">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{row.label}</span>
                    <span className={`text-[11px] font-mono ${row.color || "text-slate-200"}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {activeAxiom.sourceFiles && activeAxiom.sourceFiles.length > 0 && (
            <section className="space-y-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Source Reference</p>
              <div className="space-y-2">
                 {activeAxiom.sourceFiles.map((src: string, i: number) => (
                   <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center gap-3">
                      <Database className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-[10px] font-mono text-slate-400 truncate">{src.split('/').pop()}</span>
                   </div>
                 ))}
              </div>
            </section>
            )}

            <section className="space-y-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Bridge Distribution</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA}>
                    <Bar dataKey="val" fill="#3b82f6" radius={[2, 2, 0, 0]} fillOpacity={0.6} />
                    <XAxis dataKey="name" fontSize={8} tickLine={false} axisLine={false} tick={{fill: '#475569'}} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

          </div>
          )}
        </ScrollArea>
      </aside>
    </div>
  );
}
