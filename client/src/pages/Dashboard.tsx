import { useState } from "react";
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
  ArrowRight
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

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeAxiomId, setActiveAxiomId] = useState("A1.2");

  const { data: categoriesData = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => fetch("/api/categories").then(r => r.json()),
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
    <div className="flex h-screen bg-[#010409] text-slate-200 font-sans overflow-hidden">
      
      {/* Categories Nav */}
      <aside data-testid="sidebar-categories" className="w-64 border-r border-slate-800/40 flex flex-col bg-[#010409]">
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

      {/* Axiom List */}
      <aside data-testid="sidebar-axioms" className="w-72 border-r border-slate-800/40 flex flex-col bg-[#010409]/80 backdrop-blur-xl">
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
            {axiomsList.map((axiom: any) => (
              <button 
                key={axiom.id}
                onClick={() => setActiveAxiomId(axiom.nodeId)}
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

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-slate-800/40 bg-[#010409]/80 backdrop-blur-xl hidden xl:flex flex-col">
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
