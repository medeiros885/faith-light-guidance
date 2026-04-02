import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  ArrowLeft,
  BookOpen,
  Heart,
  Home,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import bibleLogo from "@/assets/bible-logo.png";
import SuggestionCard from "@/components/SuggestionCard";
import ResponseView from "@/components/ResponseView";
import HelpTopics from "@/components/HelpTopics";
import TypingIndicator from "@/components/TypingIndicator";
import DailyVerseCard from "@/components/DailyVerseCard";
import BibleReader from "@/components/bible/BibleReader";
import QuickActions from "@/components/QuickActions";
import FollowUpButtons from "@/components/FollowUpButtons";
import StreakBadge from "@/components/StreakBadge";
import DailyMessage from "@/components/DailyMessage";
import EmotionSelector from "@/components/EmotionSelector";
import type { UserEmotion } from "@/components/EmotionSelector";
import GuidedCalm from "@/components/GuidedCalm";
import FloatingBackground from "@/components/FloatingBackground";
import ListenButton from "@/components/ListenButton";
import { useDailyStreak } from "@/hooks/useDailyStreak";
import type { BibleResponse } from "@/data/mockResponses";
import { generateAIResponse } from "@/services/ai";

type Screen = "home" | "help" | "chat" | "bible";

const FALLBACK_RESPONSE: BibleResponse = {
  acolhimento: "Estou aqui com você.",
  contexto: "Tive dificuldade para montar a resposta agora.",
  explicacao: "Pode ter acontecido um erro temporário na conexão com a IA.",
  aplicacao: "Tente enviar sua pergunta novamente em alguns segundos.",
  versiculos: ["Salmos 46:1 — Deus é o nosso refúgio e fortaleza."],
  oracao: "Senhor, traz paz e clareza neste momento. Amém.",
  followUp: "Quer tentar perguntar de novo?",
};

function isBibleResponse(obj: unknown): obj is BibleResponse {
  if (!obj || typeof obj !== "object") return false;
  const r = obj as Partial<BibleResponse>;
  return (
    typeof r.acolhimento === "string" &&
    typeof r.contexto === "string" &&
    typeof r.explicacao === "string" &&
    typeof r.aplicacao === "string" &&
    Array.isArray(r.versiculos) &&
    typeof r.oracao === "string" &&
    typeof r.followUp === "string"
  );
}

interface ChatEntry {
  question: string;
  response: BibleResponse | null;
}

const suggestions = [
  "Quem foi o apóstolo Paulo?",
  "O que a Bíblia diz sobre perdão?",
  "Qual o significado da fé?",
];

const loadingHeaderPhrases = [
  "Preparando uma resposta pra você...",
  "Buscando direção na Palavra...",
  "Meditando nas Escrituras...",
];

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing">("idle");
  const [userEmotion, setUserEmotion] = useState<UserEmotion>(null);
  const [showGuidedCalm, setShowGuidedCalm] = useState(false);
  const [headerPhrase] = useState(
    () => loadingHeaderPhrases[Math.floor(Math.random() * loadingHeaderPhrases.length)]
  );
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addDebug = useCallback((msg: string) => {
    const line = `${new Date().toLocaleTimeString("pt-BR")} ${msg}`;
    console.log("[DEBUG PANEL]", line);
    setDebugLog((prev) => [...prev.slice(-29), line]);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const handleSubmitRef = useRef<(q: string) => void>(() => {});
  const { streakCount, recordInteraction } = useDailyStreak();

  useEffect(() => {
    if (userEmotion) localStorage.setItem("cv-emotion", userEmotion);
  }, [userEmotion]);

  useEffect(() => {
    const saved = localStorage.getItem("cv-emotion") as UserEmotion;
    if (saved) setUserEmotion(saved);
  }, []);

  useEffect(() => {
    recordInteraction();
  }, [recordInteraction]);

  useEffect(() => {
    if (userEmotion === "ansioso") {
      const t = setTimeout(() => setShowGuidedCalm(true), 1500);
      return () => clearTimeout(t);
    }
  }, [userEmotion]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");

      setInput(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        const finalText = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join("");

        setIsListening(false);

        if (finalText.trim()) {
          setVoiceStatus("processing");
          setTimeout(() => {
            setVoiceStatus("idle");
            handleSubmitRef.current(finalText);
          }, 1500);
        }
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceStatus("idle");
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setVoiceStatus("idle");
    } else {
      setInput("");
      setVoiceStatus("listening");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 120);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading, scrollToBottom]);

  useEffect(() => {
    if (screen === "chat") inputRef.current?.focus();
  }, [screen]);

  const requestAIResponse = useCallback(
    async (question: string, append = true) => {
      setIsLoading(true);
      recordInteraction();

      if (append) {
        setChatHistory((prev) => [...prev, { question, response: null }]);
      } else {
        setChatHistory([{ question, response: null }]);
      }

      setScreen("chat");
      setInput("");

      try {
        const keyExists = Boolean(import.meta.env.VITE_GEMINI_API_KEY);
        addDebug(`API key: ${keyExists ? "✓ exists" : "✗ MISSING"}`);
        addDebug(`Sending to AI: "${question.slice(0, 60)}${question.length > 60 ? "…" : ""}"`);
        console.log("SENDING TO AI:", question);

        const raw = await generateAIResponse(question, userEmotion, addDebug);
        console.log("AI RESPONSE RECEIVED:", raw);

        const isValid = isBibleResponse(raw);
        addDebug(`Response valid: ${isValid ? "✓ yes" : "✗ no — fallback used"}`);

        const safeResponse: BibleResponse = isValid
          ? raw
          : (() => {
              console.warn("AI response failed validation, using fallback. raw was:", raw);
              return FALLBACK_RESPONSE;
            })();

        setChatHistory((prev) =>
          prev.map((entry, i) =>
            i === prev.length - 1 && entry.response === null
              ? { ...entry, response: safeResponse }
              : entry
          )
        );
      } catch (error) {
        const errMsg = String(error);
        addDebug(`Error caught: ${errMsg.slice(0, 100)}`);
        console.error("Erro ao gerar resposta da IA:", error);

        setChatHistory((prev) =>
          prev.map((entry, i) =>
            i === prev.length - 1 && entry.response === null
              ? { ...entry, response: FALLBACK_RESPONSE }
              : entry
          )
        );

        toast.error("Não consegui responder agora. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    },
    [recordInteraction, userEmotion, addDebug]
  );

  const handleSubmit = (question: string) => {
    addDebug(`handleSubmit: "${question.slice(0, 50)}" | loading: ${isLoading}`);
    console.log("handleSubmit called with:", question, "| isLoading:", isLoading);
    if (!question.trim() || isLoading) return;
    void requestAIResponse(question, screen === "chat");
  };

  handleSubmitRef.current = handleSubmit;

  const handleHelpSelect = (label: string, response: BibleResponse) => {
    const question = `Preciso de ajuda com: ${label}`;
    setChatHistory([{ question, response: null }]);
    setScreen("chat");
    setIsLoading(true);

    setTimeout(() => {
      setChatHistory([{ question, response }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleBack = () => {
    setScreen("home");
    setChatHistory([]);
    setIsLoading(false);
    setVoiceStatus("idle");
  };

  const handleReflect = (verseText: string) => {
    recordInteraction();
    void requestAIResponse(verseText, false);
  };

  const getGreeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia ☀️";
    if (h < 18) return "Boa tarde 🌤️";
    return "Boa noite 🌙";
  }, []);

  const showFollowUp =
    screen === "chat" &&
    !isLoading &&
    chatHistory.length > 0 &&
    chatHistory[chatHistory.length - 1].response !== null;

  if (screen === "bible") {
    return (
      <>
        <FloatingBackground />
        <BibleReader onBack={handleBack} onReflect={handleReflect} />
      </>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <FloatingBackground />

      <AnimatePresence>
        {screen === "chat" && (
          <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="sticky top-0 z-10 border-b border-border/10 bg-background/78 backdrop-blur-2xl"
          >
            <div className="mx-auto flex max-w-lg items-center gap-3 px-5 py-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-muted-foreground transition-all duration-200 hover:border-white/12 hover:bg-white/[0.05] hover:text-foreground"
              >
                <ArrowLeft size={18} />
              </motion.button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/10 bg-gold/8 shadow-[0_0_18px_rgba(255,215,102,0.05)]">
                <img src={bibleLogo} alt="" className="h-5 w-5 opacity-90" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-display text-sm font-semibold text-gold">
                    Caminho Vivo
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                </div>

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="block truncate text-[10px] italic text-blue-calm"
                    >
                      {headerPhrase}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="online"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="block text-[10px] text-muted-foreground/42"
                    >
                      online
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div
        ref={scrollRef}
        className="relative z-[1] flex-1 overflow-y-auto scroll-smooth pb-24"
      >
        <div className="mx-auto max-w-lg px-5">
          <AnimatePresence mode="wait">
            {screen === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center gap-8 pb-32 pt-10"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="w-full"
                >
                  <div className="glass-card rounded-[32px] px-6 py-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/10 bg-gold/8 shadow-[0_0_24px_rgba(255,215,102,0.05)]">
                      <img
                        src={bibleLogo}
                        alt="Caminho Vivo"
                        width={34}
                        height={34}
                        className="opacity-95"
                      />
                    </div>

                    <div className="mb-3 flex justify-center">
                      <StreakBadge count={streakCount} />
                    </div>

                    <h1 className="font-display text-[26px] font-semibold tracking-[0.01em] text-foreground/96">
                      Caminho Vivo
                    </h1>

                    <p className="mt-2 text-sm font-medium text-foreground/86">
                      {getGreeting}
                    </p>

                    <p className="mx-auto mt-2 max-w-[280px] text-[13px] leading-6 text-muted-foreground/52">
                      Um lugar de direção, consolo e reflexão bíblica para o seu dia.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="w-full space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.45 }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200">
                      <Sparkles size={13} strokeWidth={1.8} />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
                      Como está seu coração agora?
                    </p>
                  </div>

                  <EmotionSelector selected={userEmotion} onSelect={setUserEmotion} />
                </motion.div>

                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.45 }}
                >
                  <div className="relative">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit(input)}
                      placeholder="Escreva ou fale… Deus está ouvindo com você"
                      aria-label="Escreva sua mensagem"
                      className="home-input-glass breathing-border w-full rounded-[26px] px-5 py-4 pr-24 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                    />

                    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                      <motion.button
                        onClick={toggleListening}
                        whileTap={{ scale: 0.88 }}
                        animate={isListening ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                        transition={
                          isListening
                            ? { duration: 1.4, repeat: Infinity }
                            : { duration: 0.2 }
                        }
                        aria-label={isListening ? "Parar gravação" : "Gravar voz"}
                        className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${
                          isListening
                            ? "bg-[hsl(var(--gold)/0.14)] text-gold"
                            : "text-gold/42 hover:text-gold/72"
                        }`}
                      >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </motion.button>

                      <motion.button
                        onClick={() => handleSubmit(input)}
                        disabled={!input.trim() || isLoading}
                        whileTap={{ scale: 0.88 }}
                        aria-label="Enviar mensagem"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-primary-foreground transition-all duration-200 hover:bg-gold-light disabled:opacity-15"
                        style={{ boxShadow: "0 8px 18px hsl(43 74% 64% / 0.14)" }}
                      >
                        <Send size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isListening && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 text-center text-[11px] italic text-blue-calm"
                      >
                        Pode falar, estou aqui 💙
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="w-full space-y-4">
                  <DailyMessage />
                  <DailyVerseCard onReflect={handleReflect} />
                </div>

                <div className="w-full">
                  <QuickActions onAction={handleSubmit} />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen("help")}
                  className="gold-highlight-btn w-full rounded-[24px] px-6 py-[18px] text-[15px] font-semibold text-foreground/92"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.4 }}
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <Heart size={17} className="text-gold/70" strokeWidth={2} />
                    💛 Preciso de ajuda hoje
                  </span>
                </motion.button>

                <div className="w-full space-y-2.5">
                  <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/30">
                    Perguntas frequentes
                  </p>
                  {suggestions.map((s, i) => (
                    <SuggestionCard key={s} text={s} index={i} onClick={handleSubmit} />
                  ))}
                </div>

                <motion.p
                  className="text-[11px] italic tracking-wide text-muted-foreground/28"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                >
                  Você não precisa caminhar sozinho. 💙
                </motion.p>
              </motion.div>
            )}

            {screen === "help" && (
              <motion.div
                key="help"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.3 }}
                className="py-8"
              >
                <HelpTopics onSelect={handleHelpSelect} onBack={handleBack} />
              </motion.div>
            )}

            {screen === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.26 }}
                className="space-y-1 py-4"
              >
                {chatHistory.map((entry, i) => (
                  <div key={i}>
                    {entry.response ? (
                      <div>
                        <ResponseView question={entry.question} response={entry.response} />
                        {i === chatHistory.length - 1 && (
                          <div className="mb-2 -mt-1 flex justify-start pl-2">
                            <ListenButton
                              text={`${entry.response?.acolhimento ?? ""}. ${entry.response?.explicacao ?? ""}`}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-2 flex justify-end">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="user-bubble max-w-[76%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-foreground/86"
                        >
                          {entry.question}
                        </motion.div>
                      </div>
                    )}
                  </div>
                ))}

                <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

                {showFollowUp && (
                  <FollowUpButtons onAction={(text) => handleSubmit(text)} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {screen !== "chat" && screen !== "help" && (
        <motion.nav
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.35 }}
          className="floating-navbar fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-10 rounded-[30px] px-8 py-3.5"
          role="navigation"
          aria-label="Navegação principal"
        >
          <button
            onClick={() => {
              setScreen("home");
              setChatHistory([]);
            }}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              screen === "home"
                ? "text-gold"
                : "text-muted-foreground/50 hover:text-foreground/72"
            }`}
          >
            <Home size={20} />
            <span className="text-[9px] font-medium">Início</span>
          </button>

          <button
            onClick={() => setScreen("bible")}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              screen === "bible"
                ? "text-gold"
                : "text-muted-foreground/50 hover:text-foreground/72"
            }`}
          >
            <BookOpen size={20} />
            <span className="text-[9px] font-medium">Bíblia</span>
          </button>

          <button
            onClick={() => {
              setInput("");
              setScreen("chat");
            }}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              screen === "chat" || screen === "help"
                ? "text-gold"
                : "text-muted-foreground/50 hover:text-foreground/72"
            }`}
          >
            <MessageCircle size={20} />
            <span className="text-[9px] font-medium">Chat</span>
          </button>
        </motion.nav>
      )}

      {(screen === "chat" || screen === "help") && (
        <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-border/10 bg-background/82 px-4 pb-[env(safe-area-inset-bottom,16px)] pt-2.5 backdrop-blur-2xl">
          <AnimatePresence>
            {(isListening || voiceStatus === "processing") && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mx-auto mb-2 max-w-lg text-center"
              >
                <span className="text-xs italic text-blue-calm">
                  {isListening
                    ? "Pode falar, estou aqui 💙"
                    : "Entendi... deixa eu te responder 💙"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mx-auto flex max-w-lg items-center gap-2">
            <motion.button
              onClick={toggleListening}
              animate={
                isListening
                  ? {
                      scale: [1, 1.08, 1],
                      boxShadow: [
                        "0 0 0px hsl(213 55% 68% / 0)",
                        "0 0 18px hsl(213 55% 68% / 0.2)",
                        "0 0 0px hsl(213 55% 68% / 0)",
                      ],
                    }
                  : { scale: 1 }
              }
              transition={
                isListening
                  ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
              whileTap={{ scale: 0.9 }}
              aria-label={isListening ? "Parar gravação" : "Gravar voz"}
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                isListening
                  ? "bg-[hsl(var(--blue-soft)/0.12)] text-blue-calm"
                  : "text-muted-foreground/45 hover:bg-secondary/30 hover:text-foreground/68"
              }`}
            >
              {isListening ? <MicOff size={19} /> : <Mic size={19} />}
            </motion.button>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(input)}
              placeholder={isListening ? "Ouvindo..." : "Escreva ou fale…"}
              aria-label="Campo de mensagem"
              className="input-field flex-1 rounded-full px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
              readOnly={isListening}
            />

            <motion.button
              onClick={() => handleSubmit(input)}
              disabled={!input.trim() || isLoading}
              whileTap={{ scale: 0.88 }}
              aria-label="Enviar"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold text-primary-foreground transition-all duration-200 hover:bg-gold-light disabled:opacity-10"
              style={{ boxShadow: "0 8px 18px hsl(43 74% 64% / 0.14)" }}
            >
              <Send size={17} />
            </motion.button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showGuidedCalm && <GuidedCalm onClose={() => setShowGuidedCalm(false)} />}
      </AnimatePresence>

      {import.meta.env.DEV && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] max-h-48 overflow-y-auto border-t border-white/10 bg-black/95 px-3 py-2 font-mono text-[10px] leading-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-bold text-yellow-400">🔧 AI Debug Panel (dev only)</span>
            <button
              onClick={() => setDebugLog([])}
              className="text-gray-500 hover:text-white"
            >
              clear
            </button>
          </div>
          {debugLog.length === 0 ? (
            <div className="text-gray-600">No activity yet — send a message to start.</div>
          ) : (
            debugLog.map((line, i) => {
              const color =
                line.includes("✓") ? "text-green-400" :
                line.includes("✗") || line.includes("MISSING") || line.includes("failed") || line.includes("Error") ? "text-red-400" :
                line.includes("Retry") || line.includes("warn") ? "text-yellow-300" :
                "text-gray-300";
              return (
                <div key={i} className={color}>
                  {line}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Index;