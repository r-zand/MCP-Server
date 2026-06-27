import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Wrench, 
  Terminal, 
  ArrowRight, 
  Search, 
  Chrome, 
  GitBranch, 
  FileText, 
  Check, 
  Cpu, 
  Layers, 
  Lock, 
  Code, 
  Copy, 
  Sparkles, 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeftRight, 
  Settings,
  BookOpen,
  MessageSquare,
  Play,
  Github,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  mcpConcepts, 
  popularServers, 
  jsonRpcExamples, 
  farsiExplanation, 
  englishExplanation,
  MCPConcept,
  PopularServer,
  JsonRpcExample
} from "./data";

export default function App() {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [activeTab, setActiveTab] = useState<"learn" | "visualizer" | "generator" | "popular">("learn");
  
  // Concept exploration state
  const [activeConceptId, setActiveConceptId] = useState<string>("resources");
  
  // JSON-RPC Visualizer state
  const [activeExampleId, setActiveExampleId] = useState<string>("tools_list");
  const [simulatedParam, setSimulatedParam] = useState<string>("5");
  const [simulatedResponse, setSimulatedResponse] = useState<string>("");
  
  // AI Generator state
  const [generatePrompt, setGeneratePrompt] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);
  
  // AI Assistant state
  const [chatInput, setChatInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Copied state indicator
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const t = lang === "fa" ? farsiExplanation : englishExplanation;

  // Sync simulated parameter logic
  useEffect(() => {
    if (activeExampleId === "tools_call") {
      const responseTemplate = `{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "The factorial of ${simulatedParam || 0} is ${factorial(Number(simulatedParam || 0))}."
      }
    ]
  }
}`;
      setSimulatedResponse(responseTemplate);
    }
  }, [simulatedParam, activeExampleId]);

  const factorial = (num: number): number => {
    if (num < 0) return 0;
    if (num === 0 || num === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(num, 12); i++) {
      res *= i;
    }
    return res;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleGenerateMcp = async (presetPrompt?: string) => {
    const promptToUse = presetPrompt || generatePrompt;
    if (!promptToUse.trim()) return;

    if (!presetPrompt) {
      setGeneratePrompt(promptToUse);
    }
    setIsGenerating(true);
    setGeneratorError(null);
    setGeneratedCode("");

    try {
      const response = await fetch("/api/mcp-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          language: lang,
          mode: "generate"
        })
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedCode(data.response);
      } else {
        setGeneratorError(data.error || "Failed to generate boilerplate code.");
      }
    } catch (err: any) {
      setGeneratorError("Connection error. Ensure Server is running on port 3000.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendChat = async (presetChat?: string) => {
    const message = presetChat || chatInput;
    if (!message.trim()) return;

    const newHistory = [...chatHistory, { role: "user" as const, text: message }];
    setChatHistory(newHistory);
    if (!presetChat) {
      setChatInput("");
    }
    setIsChatLoading(true);
    setChatError(null);

    try {
      const response = await fetch("/api/mcp-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message,
          language: lang,
          mode: "explain"
        })
      });
      const data = await response.json();
      if (response.ok) {
        setChatHistory([...newHistory, { role: "assistant" as const, text: data.response }]);
      } else {
        setChatError(data.error || "Failed to fetch response from Gemini.");
      }
    } catch (err) {
      setChatError("Connection error. Please check if your server-side is running.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const activeConcept = mcpConcepts.find(c => c.id === activeConceptId) || mcpConcepts[0];
  const activeExample = jsonRpcExamples.find(e => e.id === activeExampleId) || jsonRpcExamples[0];

  const getIconComponent = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case "database": return <Database className={className} />;
      case "wrench": return <Wrench className={className} />;
      case "terminal": return <Terminal className={className} />;
      case "arrow-left-right": return <ArrowLeftRight className={className} />;
      case "chrome": return <Chrome className={className} />;
      case "search": return <Search className={className} />;
      case "git-branch": return <GitBranch className={className} />;
      case "file-text": return <FileText className={className} />;
      default: return <Cpu className={className} />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-900 ${lang === "fa" ? "rtl" : "ltr"}`}>
      {/* Top Header Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950">
            <Cpu className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">Model Context Protocol</span>
              <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-500/20">v1.0</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Standardized Context Bridge</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm font-medium">
          <button 
            onClick={() => setActiveTab("learn")}
            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === "learn" 
                ? "bg-slate-800 text-cyan-400 border border-slate-700" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.tabLearn}</span>
          </button>
          <button 
            onClick={() => setActiveTab("visualizer")}
            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === "visualizer" 
                ? "bg-slate-800 text-cyan-400 border border-slate-700" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{t.tabVisualizer}</span>
          </button>
          <button 
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === "generator" 
                ? "bg-slate-800 text-cyan-400 border border-slate-700" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.tabAiGenerator}</span>
          </button>
          <button 
            onClick={() => setActiveTab("popular")}
            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === "popular" 
                ? "bg-slate-800 text-cyan-400 border border-slate-700" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.tabPopular}</span>
          </button>

          {/* Language Switcher Badge */}
          <button
            onClick={() => setLang(lang === "fa" ? "en" : "fa")}
            className="ml-2 sm:ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold hover:border-cyan-500/50 hover:text-cyan-300 transition-all text-slate-300"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === "fa" ? "English (EN)" : "فارسی (FA)"}</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* Banner Hero Concept Explanation */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 rounded-3xl blur-2xl"></div>
          
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="mb-4">
                <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-500/20">
                  {lang === "fa" ? "پروتکل استاندارد ارتباطی" : "Standardized AI Protocol"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400">
                {t.title}
              </h1>
              <p className="text-cyan-400 font-medium mb-4 text-sm sm:text-base">
                {t.subtitle}
              </p>
              <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-3">
                <p>{t.whatIsMcp.replace(/\*\*(.*?)\*\*/g, "$1")}</p>
                <p>{t.whatIsServer.replace(/\*\*(.*?)\*\*/g, "$1")}</p>
              </div>

              {/* Quick Language Toggle Tip */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">{lang === "fa" ? "پیشنهاد ما برای شروع:" : "Quick Start Suggestions:"}</span>
                <button 
                  onClick={() => { setActiveTab("visualizer"); }} 
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 rounded-full transition-colors flex items-center gap-1 border border-slate-700"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  {lang === "fa" ? "شبیه‌ساز پیام‌های سرور" : "Protocol Messages Simulator"}
                </button>
                <button 
                  onClick={() => { setActiveTab("generator"); }} 
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-xs text-slate-950 font-bold rounded-full transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {lang === "fa" ? "کدنویسی سرور با هوش مصنوعی" : "Code an MCP Server with AI"}
                </button>
              </div>
            </div>

            {/* Visual Interactive Architecture Flow Chart */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-full bg-slate-950/80 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center gap-4">
                <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest text-center mb-1 w-full border-b border-slate-900 pb-2">
                  {t.architectureLabel}
                </div>
                
                {/* Client Node */}
                <div className="w-full p-3.5 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-xl transition-all group relative cursor-help">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">MCP CLIENT (کلاینت)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div className="font-bold text-sm text-slate-200 mt-1">AI App (e.g. Claude Desktop, Cursor, App)</div>
                  
                  {/* Tooltip detail */}
                  <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 invisible group-hover:visible z-30 shadow-xl pointer-events-none">
                    {t.mcpClientDesc}
                  </div>
                </div>

                {/* Connecting Line */}
                <div className="flex flex-col items-center">
                  <div className="h-5 w-0.5 bg-gradient-to-b from-cyan-400 to-indigo-500"></div>
                  <span className="text-[9px] font-mono font-bold bg-slate-800/80 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
                    Stdio / SSE Transport (JSON-RPC)
                  </span>
                  <div className="h-5 w-0.5 bg-gradient-to-b from-indigo-500 to-violet-500"></div>
                </div>

                {/* Server Node */}
                <div className="w-full p-4 bg-cyan-950/40 border-2 border-cyan-500/80 rounded-xl shadow-lg shadow-cyan-500/5 transition-all group relative cursor-help">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-cyan-300 font-mono font-bold uppercase">MCP SERVER (سرور)</span>
                    <span className="bg-cyan-500 text-slate-950 font-bold font-mono text-[9px] px-1.5 py-0.2 rounded">Host Bridge</span>
                  </div>
                  <div className="font-extrabold text-sm text-white mt-1">Local/Cloud Tool bridge</div>
                  <div className="text-[11px] text-cyan-400 mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 border-t border-cyan-900/60 pt-1.5 font-medium">
                    <span>• Resources</span>
                    <span>• Tools</span>
                    <span>• Prompts</span>
                  </div>

                  {/* Tooltip detail */}
                  <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 invisible group-hover:visible z-30 shadow-xl pointer-events-none">
                    {t.mcpServerDesc}
                  </div>
                </div>

                {/* Connecting Line */}
                <div className="flex flex-col items-center">
                  <div className="h-4 w-0.5 bg-gradient-to-b from-violet-500 to-slate-800"></div>
                </div>

                {/* Data Sources Node */}
                <div className="w-full grid grid-cols-3 gap-2">
                  <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-lg text-center">
                    <Database className="w-3.5 h-3.5 text-slate-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 font-mono">Databases</span>
                  </div>
                  <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-lg text-center">
                    <FileText className="w-3.5 h-3.5 text-slate-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 font-mono">Filesystem</span>
                  </div>
                  <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-lg text-center">
                    <Chrome className="w-3.5 h-3.5 text-slate-500 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 font-mono">Web APIs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Workspace Viewports */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CONCEPT LEARNER */}
            {activeTab === "learn" && (
              <motion.div
                key="tab-learn"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Concept Navigator Cards */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>{lang === "fa" ? "مفاهیم کلیدی پروتکل MCP" : "Core Specifications & API Concepts"}</span>
                  </h3>

                  {mcpConcepts.map((concept) => {
                    const isSelected = concept.id === activeConceptId;
                    return (
                      <button
                        key={concept.id}
                        onClick={() => setActiveConceptId(concept.id)}
                        className={`text-right p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                          lang === "fa" ? "flex-row" : "flex-row-reverse"
                        } ${
                          isSelected 
                            ? "bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/5 text-white" 
                            : "bg-slate-900/30 border-slate-800/80 text-slate-300 hover:bg-slate-900/50 hover:border-slate-700"
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                          {getIconComponent(concept.icon, "w-5 h-5")}
                        </div>
                        <div className="flex-1 text-right">
                          <div className={`font-bold text-sm ${isSelected ? "text-cyan-400" : "text-slate-200"}`}>
                            {lang === "fa" ? concept.titleFa : concept.titleEn}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {lang === "fa" ? concept.descFa : concept.descEn}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-500 self-center transition-transform ${isSelected ? "rotate-90 text-cyan-400" : ""}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Concept Detail Previewer Panel */}
                <div className="lg:col-span-7">
                  <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                          {getIconComponent(activeConcept.icon, "w-6 h-6")}
                        </div>
                        <div>
                          <h4 className="text-xl font-extrabold text-white">
                            {lang === "fa" ? activeConcept.titleFa : activeConcept.titleEn}
                          </h4>
                          <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">{activeConcept.id} protocol layer</span>
                        </div>
                      </div>

                      <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base space-y-4">
                        <p className="font-medium text-slate-200 leading-relaxed border-l-2 border-cyan-500 pl-4 py-1">
                          {lang === "fa" ? activeConcept.descFa : activeConcept.descEn}
                        </p>
                        <p className="leading-relaxed">
                          {lang === "fa" ? activeConcept.detailsFa : activeConcept.detailsEn}
                        </p>
                      </div>

                      {/* Informative block based on selection */}
                      <div className="mt-8 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex items-start gap-3">
                        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-400 space-y-1">
                          <span className="font-semibold text-slate-300 block">
                            {lang === "fa" ? "چرا این مفهوم مهم است؟" : "Architectural Context"}
                          </span>
                          <span>
                            {activeConcept.id === "resources" && (lang === "fa" 
                              ? "منابع راهکار خواندن فایل‌ها، مستندات و دیتابیس بدون احتمال ویرایش ناخواسته است." 
                              : "Resources provide secure read access for things like DB schemas, context context files, or logs.")}
                            {activeConcept.id === "tools" && (lang === "fa" 
                              ? "ابزارها به هوش مصنوعی اجازه تغییر وضعیت، نوشتن فایل یا ساخت API کال را طبق خروجی دلخواه می‌دهند." 
                              : "Tools represent LLM-executable functions that can mutate state, execute code, or trigger webhooks.")}
                            {activeConcept.id === "prompts" && (lang === "fa" 
                              ? "پرامپت‌ها باعث هم‌ترازی آسان کاربر با هوش مصنوعی برای انجام تحلیل یا کارهای تکراری روزانه می‌شوند." 
                              : "Prompts provide customized template cards to standardise and improve user instructions.")}
                            {activeConcept.id === "transports" && (lang === "fa" 
                              ? "Stdio برای پردازش لوکال کلاینت و سرور روی سیستم مناسب است، در حالی که SSE ارتباط امن ابری را هموار می‌سازد." 
                              : "Stdio facilitates quick command-line communication, while SSE powers network/remote services.")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                      <span>JSON-RPC 2.0 Spec Compliant</span>
                      <button 
                        onClick={() => setActiveTab("visualizer")} 
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>{lang === "fa" ? "مشاهده کدهای پیام" : "View Protocol Payloads"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: PROTOCOL JSON-RPC VISUALIZER */}
            {activeTab === "visualizer" && (
              <motion.div
                key="tab-visualizer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Method Switcher */}
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-slate-300 mb-1 flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    <span>{lang === "fa" ? "پیام‌های تبادل شده پروتکل" : "Client <-> Server Payloads"}</span>
                  </h3>
                  
                  {jsonRpcExamples.map((example) => {
                    const isSelected = example.id === activeExampleId;
                    return (
                      <button
                        key={example.id}
                        onClick={() => setActiveExampleId(example.id)}
                        className={`text-right p-4 rounded-xl border text-sm transition-all flex flex-col gap-1.5 ${
                          isSelected 
                            ? "bg-slate-900 border-cyan-500 text-white" 
                            : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-900/50 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`font-bold ${isSelected ? "text-cyan-400" : "text-slate-200"}`}>
                            {lang === "fa" ? example.nameFa : example.nameEn}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                            {example.id === "tools_list" ? "GET" : "POST"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed text-right">
                          {lang === "fa" ? example.descriptionFa : example.descriptionEn}
                        </p>
                      </button>
                    );
                  })}

                  {/* Interactive Parameter Simulator Block */}
                  {activeExampleId === "tools_call" && (
                    <div className="mt-4 p-4 bg-cyan-950/10 border border-cyan-500/20 rounded-xl">
                      <label className="block text-xs font-bold text-cyan-400 mb-2">
                        {lang === "fa" ? "شبیه‌سازی آرگومان ورودی ابزار (n):" : "Simulate Tool Argument (n):"}
                      </label>
                      <input 
                        type="number" 
                        min="0" 
                        max="12"
                        value={simulatedParam}
                        onChange={(e) => setSimulatedParam(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white font-mono text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500" 
                      />
                      <p className="text-[10px] text-slate-500 mt-2">
                        {lang === "fa" 
                          ? "تغییر این پارامتر فوراً مقدار پاسخ متد tools/call بالا را آپدیت می‌کند!" 
                          : "Changing this values dynamically rewrites the tools/call output response below!"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payload Code Blocks side-by-side or stacked */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* JSON RPC REQUEST */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
                        <span className="text-cyan-400 font-semibold">{lang === "fa" ? "درخواست کلاینت (Request)" : "Client JSON-RPC Request"}</span>
                        <button 
                          onClick={() => handleCopy(activeExample.request, "req")}
                          className="hover:text-white transition-colors flex items-center gap-1"
                        >
                          {copiedText === "req" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText === "req" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed bg-slate-900/90 flex-1">
                        <code>{activeExample.request}</code>
                      </pre>
                    </div>

                    {/* JSON RPC RESPONSE */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
                        <span className="text-indigo-400 font-semibold">{lang === "fa" ? "پاسخ سرور (Response)" : "Server JSON-RPC Response"}</span>
                        <button 
                          onClick={() => handleCopy(activeExampleId === "tools_call" ? simulatedResponse : activeExample.response, "res")}
                          className="hover:text-white transition-colors flex items-center gap-1"
                        >
                          {copiedText === "res" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText === "res" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs font-mono text-indigo-300 leading-relaxed bg-slate-900/90 flex-1">
                        <code>{activeExampleId === "tools_call" ? simulatedResponse : activeExample.response}</code>
                      </pre>
                    </div>

                  </div>

                  {/* Informative guide */}
                  <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2 leading-relaxed">
                    <span className="font-bold text-slate-300 block">{lang === "fa" ? "مکانیسم انتقال و پروتکل:" : "Transport & Protocol Mechanics:"}</span>
                    <p>
                      {lang === "fa" 
                        ? "تمام تراکنش‌های پروتکل MCP بر اساس پروتکل استاندارد JSON-RPC 2.0 می‌باشد. در محیط‌های محلی (Stdio)، کلاینت پیام‌های JSON را روی جریان stdin سرور می‌نویسد و پاسخ‌ها را از جریان stdout می‌خواند. این روش به شدت سریع، امن و بدون شبکه است."
                        : "All MCP messages are structured as JSON-RPC 2.0 payloads. Over Stdio, the client writes JSON strings to the server's stdin stream and parses responses from its stdout stream. Highly performant and secure since it bypasses network overhead entirely."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: AI CODE GENERATOR & ASSISTANT */}
            {activeTab === "generator" && (
              <motion.div
                key="tab-generator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Inputs and Control */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* MCP AI Generator Box */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-bold text-slate-200">{lang === "fa" ? "مولد هوشمند سرور MCP" : "AI MCP Server Code Generator"}</h4>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      {lang === "fa" 
                        ? "بر اساس نوع دیتابیس یا فایل، کدهای آماده سرور MCP به همراه نحوه پیکربندی آن برای Claude Desktop تولید کنید."
                        : "Generate complete, functional MCP server boilerplate tailored to your target database, files or third-party service."}
                    </p>

                    <textarea
                      rows={3}
                      value={generatePrompt}
                      onChange={(e) => setGeneratePrompt(e.target.value)}
                      placeholder={t.generatePlaceholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors mb-4 resize-none"
                    />

                    {/* Pre-made Quick Select buttons */}
                    <div className="mb-4">
                      <span className="text-[11px] text-slate-500 block mb-2">{lang === "fa" ? "قالب‌های سریع:" : "Quick Ideas:"}</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { title: "SQLite Server", prompt: "A custom SQLite database viewer MCP server that exposes tools to query data and fetch schemas" },
                          { title: "Notion API Bridge", prompt: "An MCP server that uses Notion API to fetch page database entries and create workspace tasks" },
                          { title: "Gmail Tool", prompt: "An MCP server that exposes tools to draft emails, search inbox messages, and fetch threads with Gmail API" },
                          { title: "Web Scraper", prompt: "An MCP server using Puppeteer or fetch to crawl websites, search keywords, and grab markdown" }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setGeneratePrompt(preset.prompt);
                              handleGenerateMcp(preset.prompt);
                            }}
                            className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 hover:text-cyan-400 text-[11px] text-slate-300 rounded-lg border border-slate-700/60 transition-colors"
                          >
                            {preset.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleGenerateMcp()}
                      disabled={isGenerating || !generatePrompt.trim()}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-cyan-500/10 cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>{t.generating}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-slate-950" />
                          <span>{t.generateBtn}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Explainer Q&A Chat */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-bold text-slate-200">{lang === "fa" ? "دستیار تخصصی پروتکل MCP" : "AI Technical Assistant"}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                        {lang === "fa" 
                          ? "هر سوال فنی یا ابهامی درباره نصب، مسیرهای انتقال، کلاینت‌ها و تفاوت‌های Stdio و SSE دارید بپرسید."
                          : "Ask detailed questions about configuration, transport streams, debugging, or custom clients."}
                      </p>

                      {/* Small inline preset questions */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { text: "چگونه سرور MCP را روی کلودهاست دپلوی کنم؟", en: "How to deploy MCP server to remote cloud host?" },
                          { text: "تفاوت دقیق Stdio و SSE در چیست؟", en: "What is the difference between Stdio and SSE?" },
                          { text: "چطور سرور را در فایل claude_desktop_config ست کنم؟", en: "How to configure claude_desktop_config.json?" }
                        ].map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setChatInput(lang === "fa" ? q.text : q.en);
                              handleSendChat(lang === "fa" ? q.text : q.en);
                            }}
                            className="text-right px-2.5 py-1 bg-slate-800/40 hover:bg-slate-800 hover:text-indigo-300 text-[10px] text-slate-400 rounded-lg border border-slate-800 transition-colors block w-full truncate"
                          >
                            {lang === "fa" ? q.text : q.en}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendChat();
                          }}
                          placeholder={t.aiAssistantPlaceholder}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                          onClick={() => handleSendChat()}
                          disabled={isChatLoading || !chatInput.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-3 py-2 rounded-xl transition-all text-xs flex items-center justify-center cursor-pointer"
                        >
                          {isChatLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : t.askBtn}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Display Output Screens */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Generated Boilerplate / Code viewer */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col flex-1 min-h-[450px]">
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-slate-300">
                          {isGenerating 
                            ? (lang === "fa" ? "هوش مصنوعی در حال کدنویسی سرور..." : "AI coding your custom server...")
                            : (lang === "fa" ? "کدهای خروجی و راهنمای راه‌اندازی" : "Generated Boilerplate & Setup Guide")}
                        </span>
                      </div>
                      {generatedCode && (
                        <button
                          onClick={() => handleCopy(generatedCode, "code")}
                          className="hover:text-white transition-colors flex items-center gap-1.5 font-semibold text-xs py-1 px-3 bg-slate-900 rounded-lg border border-slate-800"
                        >
                          {copiedText === "code" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText === "code" ? (lang === "fa" ? "کپی شد" : "Copied") : (lang === "fa" ? "کپی کد" : "Copy Code")}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto text-sm leading-relaxed max-h-[550px]">
                      {isGenerating ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 gap-4">
                          <RefreshCw className="w-10 h-10 animate-spin text-cyan-500" />
                          <div>
                            <p className="font-bold text-slate-200">{lang === "fa" ? "در حال تحلیل ایده و نوشتن سرور استاندارد..." : "Analyzing requirements & architecting standard MCP server..."}</p>
                            <p className="text-xs text-slate-500 mt-1">{lang === "fa" ? "این فرایند چند ثانیه زمان می‌برد." : "This will compile model context protocols in a moment."}</p>
                          </div>
                        </div>
                      ) : generatedCode ? (
                        <div className={`prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm font-mono space-y-4 ltr text-left`}>
                          <div className="whitespace-pre-wrap leading-relaxed font-sans">{generatedCode}</div>
                        </div>
                      ) : generatorError ? (
                        <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl flex items-start gap-3 text-red-400">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">{lang === "fa" ? "خطا در برقراری ارتباط" : "API Call Error"}</span>
                            <p className="text-xs mt-1 leading-relaxed">{generatorError}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500">
                          <Sparkles className="w-12 h-12 text-slate-700 mb-3" />
                          <p className="font-medium text-slate-400">{lang === "fa" ? "منتظر درخواست شما برای تولید کدهای سرور..." : "Ready to code. Choose a template or prompt above."}</p>
                          <p className="text-xs text-slate-600 mt-1 max-w-md">
                            {lang === "fa" 
                              ? "هوش مصنوعی کلاس‌ها، ابزارها و کدهای پیکربندی را با استانداردهای رسمی SDK هماهنگ و تولید می‌کند."
                              : "Our backend utilizes the Google GenAI SDK to compose official Model Context Protocol templates."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chat Assistant responses below */}
                  {chatHistory.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col max-h-[300px]">
                      <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
                        <span className="font-bold">{lang === "fa" ? "تاریخچه چت با دستیار هوشمند" : "Assistant Conversation History"}</span>
                        <button 
                          onClick={() => setChatHistory([])}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {lang === "fa" ? "پاک کردن تاریخچه" : "Clear Chat"}
                        </button>
                      </div>
                      <div className="p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
                        {chatHistory.map((item, index) => (
                          <div 
                            key={index} 
                            className={`flex flex-col gap-1 p-3 rounded-xl max-w-[85%] ${
                              item.role === "user" 
                                ? (lang === "fa" ? "mr-auto bg-slate-800 text-slate-100 align-left text-left ltr" : "ml-auto bg-slate-800 text-slate-100")
                                : (lang === "fa" ? "ml-auto bg-cyan-950/20 border border-cyan-900/40 text-slate-200" : "mr-auto bg-cyan-950/20 border border-cyan-900/40 text-slate-200")
                            }`}
                          >
                            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                              {item.role === "user" ? (lang === "fa" ? "کاربر" : "User") : (lang === "fa" ? "دستیار MCP" : "MCP Assistant")}
                            </span>
                            <div className="whitespace-pre-wrap leading-relaxed font-sans">{item.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* TAB 4: POPULAR SERVERS DIRECTORY */}
            {activeTab === "popular" && (
              <motion.div
                key="tab-popular"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {lang === "fa" ? "سرورهای متن‌باز آماده و پرکاربرد" : "Popular Pre-built MCP Servers"}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {lang === "fa" 
                        ? "این سرورها به صورت رسمی توسط کامیونیتی توسعه داده شده و بلافاصله قابل ادغام هستند."
                        : "These ready-made integrations can be added instantly to your Claude Desktop configuration."}
                    </p>
                  </div>
                  <span className="bg-slate-900 border border-slate-800 text-xs px-3 py-1 rounded-full text-cyan-400 font-semibold font-mono">
                    Official & Community Hub
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularServers.map((server, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-5 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-cyan-500/5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-slate-800 text-[10px] text-slate-400 font-mono font-bold px-2 py-0.5 rounded">
                            {server.category}
                          </span>
                          <div className="p-2 bg-slate-800 text-cyan-400 rounded-lg">
                            {getIconComponent(server.icon, "w-4 h-4")}
                          </div>
                        </div>

                        <h4 className="font-bold text-slate-100 text-base mb-2">{server.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {lang === "fa" ? server.descriptionFa : server.descriptionEn}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-mono">@modelcontextprotocol</span>
                        {server.githubUrl && (
                          <a 
                            href={server.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Integration Info Box */}
                <div className="mt-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20 shrink-0">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-200 mb-1">
                      {lang === "fa" ? "آموزش نصب سرورها در کلاینت (مانند Claude Desktop)" : "How to load these servers in Claude Desktop?"}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {lang === "fa"
                        ? "برای اجرای سرورهای لوکال، باید فایل پیکربندی Claude Desktop را ویرایش کرده و نام، روش اجرا و آرگومان‌های سرور خود را تعریف کنید."
                        : "To load an MCP server, edit your local Claude Desktop config file and specify the node startup script or command execution parameters."}
                    </p>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-[11px] text-cyan-300 ltr text-left overflow-x-auto">
                      <pre>{`{
  "mcpServers": {
    "sqlite-local": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "/Users/username/data.db"]
    }
  }
}`}</pre>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Highlighted Persian specific informational brief block */}
        {lang === "fa" && (
          <section className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>پاسخ تکمیلی به پرسش شما: سرور MCP چیست؟</span>
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed space-y-4 text-justify">
              <p>
                در واقع **MCP Server** مانند یک گیت‌وی (Gateway) امن عمل می‌کند که کلاینت یا برنامه هوش مصنوعی (مانند Claude) به آن متصل شده و دیتای محلی یا ابزار شما را درخواست می‌کند. 
              </p>
              <p>
                مزیت اصلی سرور MCP این است که **منطق کدها به صورت محلی باقی می‌ماند** و لازم نیست دیتابیس یا فایل‌های شخصی خود را مستقیماً به کدهای عمومی هوش مصنوعی آپلود کنید. هوش مصنوعی فقط درخواست خود را بر اساس پروتکل استاندارد فرستاده، سرور شما آن را اجرا کرده و خروجی فیلتر شده را بازمی‌گرداند.
              </p>
              <p>
                به عنوان مثال، فرض کنید یک پایگاه‌داده از محصولات فروشگاه خود دارید. هوش مصنوعی نمی‌تواند به دیتابیس لوکال شما وصل شود. اما شما یک **سرور MCP دیتابیس** اجرا می‌کنید. وقتی کاربر از Claude می‌پرسد «موجودی محصول X چقدر است؟»، کلاینت Claude پیام `tools/call` را با پارامتر نام محصول به سرور شما می‌فرستد. سرور شما کوئری SQL لوکال زده و در یک پیام ساختاریافته تعداد را پاسخ می‌دهد تا به کاربر نمایش داده شود.
              </p>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-500" />
            <span>Standardized Model Context Protocol (MCP) Guides & AI Playground</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini 3.5 & Google AI Studio</span>
            <span className="text-slate-600">|</span>
            <span>Developed by Anthropic & Open Source Community</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
