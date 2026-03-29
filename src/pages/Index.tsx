import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, ArrowLeft, BookOpen, Heart } from "lucide-react";
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
import { useDailyStreak } from "@/hooks/useDailyStreak";
import { generateMockResponse, type BibleResponse } from "@/data/mockResponses";

type Screen = "home" | "help" | "chat" | "bible";

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
  const [headerPhrase] = useState(
    () => loadingHeaderPhrases[Math.floor(Math.random() * loadingHeaderPhrases.length)]
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const handleSubmitRef = useRef<(q: string) => void>(() => {});
  const { streakCount, recordInteraction } = useDailyStreak();

  useEffect(() => {
    recordInteraction();
  }, [recordInteraction]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setInput(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        const finalText = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setIsListening(false);
        if (finalText.trim()) {
          setVoiceStatus("processing");
          setTimeout(() => {
            setVoiceStatus("idle");
            handleSubmitRef.current(finalText);
          }, 1800);
        }
      }
    };
    recognition.onerror = () => { setIsListening(false); setVoiceStatus("idle"); };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => { recognition.abort(); };
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
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 120);
  }, []);

  useEffect(() => { scrollToBottom(); }, [chatHistory, isLoading, scrollToBottom]);
  useEffect(() => { if (screen === "chat") inputRef.current?.focus(); }, [screen]);

  const simulateResponse = useCallback((question: string, append = true) => {
    setIsLoading(true);
    recordInteraction();
    if (append) {
      setChatHistory((prev) => [...prev, { question, response: null }]);
    } else {
      setChatHistory([{ question, response: null }]);
    }
    setScreen("chat");
    setInput("");
    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => {
      const response = generateMockResponse(question);
      setChatHistory((prev) =>
        prev.map((entry, i) =>
          i === prev.length - 1 && entry.response === null ? { ...entry, response } : entry
        )
      );
      setIsLoading(false);
    }, delay);
  }, [recordInteraction]);

  const handleSubmit = (question: string) => {
    if (!question.trim() || isLoading) return;
    simulateResponse(question, screen === "chat");
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
    }, 1800);
  };

  const handleBack = () => {
    setScreen("home");
    setChatHistory([]);
    setIsLoading(false);
    setVoiceStatus("idle");
  };

  const handleReflect = (verseText: string) => {
    recordInteraction();
    simulateResponse(verseText, false);
  };

  if (screen === "bible") {
    return <BibleReader onBack={handleBack} onReflect={handleReflect} />;
  }

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia ☀️";
    if (h < 18) return "Boa tarde 🌤️";
    return "Boa noite 🌙";
  };

  const showFollowUp = screen === "chat" && !isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].response !== null;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Chat header */}
      <AnimatePresence>
        {screen === "chat" && (
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/20 bg-background/90 px-5 py-3.5 backdrop-blur-2xl"
          >
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={handleBack}
              className="rounded-full p-1.5 text-muted-foreground transition-colors duration-200 hover:text-foreground hover:bg-secondary/40"
            >
              <ArrowLeft size={18} />
            </motion.button>
            <img src={bibleLogo} alt="" className="h-7 w-7 opacity-85" />
            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold text-gold">Caminho Vivo</span>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[10px] italic text-blue-calm"
                  >{headerPhrase}</motion.span>
                ) : (
                  <motion.span key="online" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[10px] text-muted-foreground/45"
                  >online</motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="mx-auto max-w-lg px-5">
          <AnimatePresence mode="wait">
            {/* ── HOME ── */}
            {screen === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center pb-10 pt-10 gap-6"
              >
                {/* Logo */}
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <img
                    src={bibleLogo}
                    alt="Caminho Vivo"
                    width={48}
                    height={48}
                    className="drop-shadow-[0_0_18px_hsl(43_55%_52%/0.12)]"
                  />
                  <h1 className="font-display text-xl font-bold text-gold tracking-wide">Caminho Vivo</h1>
                </motion.div>

                {/* Streak */}
                <StreakBadge count={streakCount} />

                {/* Greeting */}
                <motion.div
                  className="w-full text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <p className="text-[15px] font-medium text-foreground/85">{getGreeting()}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground/70">Como você está hoje?</p>
                </motion.div>

                {/* Daily message */}
                <DailyMessage />

                {/* Daily verse */}
                <DailyVerseCard onReflect={handleReflect} />

                {/* Quick actions */}
                <div className="w-full">
                  <QuickActions onAction={handleSubmit} />
                </div>

                {/* Suggestions */}
                <div className="w-full space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-1">
                    Perguntas frequentes
                  </p>
                  {suggestions.map((s, i) => (
                    <SuggestionCard key={s} text={s} index={i} onClick={handleSubmit} />
                  ))}
                </div>

                {/* Help button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen("help")}
                  className="w-full rounded-2xl gold-highlight-btn px-6 py-[18px] text-[15px] font-semibold text-foreground/90"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.45 }}
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <Heart size={17} className="text-gold/65" strokeWidth={2} />
                    💛 Preciso de ajuda hoje
                  </span>
                </motion.button>

                {/* Bible button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen("bible")}
                  className="w-full rounded-2xl glass-card flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-medium text-foreground/70 transition-all duration-200 hover:border-border/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                >
                  <BookOpen size={15} className="text-gold/50" />
                  Ler a Bíblia
                </motion.button>

                {/* Brand */}
                <motion.p
                  className="text-[11px] text-muted-foreground/35 italic tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Você não precisa caminhar sozinho. 💙
                </motion.p>
              </motion.div>
            )}

            {/* ── HELP ── */}
            {screen === "help" && (
              <motion.div
                key="help"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
                className="py-8"
              >
                <HelpTopics onSelect={handleHelpSelect} onBack={handleBack} />
              </motion.div>
            )}

            {/* ── CHAT ── */}
            {screen === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="py-4 space-y-1"
              >
                {chatHistory.map((entry, i) => (
                  <div key={i}>
                    {entry.response ? (
                      <ResponseView question={entry.question} response={entry.response} />
                    ) : (
                      <div className="flex justify-end mb-2">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.93, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="max-w-[75%] rounded-2xl rounded-tr-sm user-bubble px-4 py-3 text-sm leading-relaxed text-foreground/85"
                        >
                          {entry.question}
                        </motion.div>
                      </div>
                    )}
                  </div>
                ))}
                <AnimatePresence>
                  {isLoading && <TypingIndicator />}
                </AnimatePresence>
                {showFollowUp && (
                  <FollowUpButtons onAction={(text) => handleSubmit(text)} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── INPUT BAR ── */}
      <div className="sticky bottom-0 border-t border-border/15 bg-background/90 px-4 pb-[env(safe-area-inset-bottom,16px)] pt-2.5 backdrop-blur-2xl">
        <AnimatePresence>
          {(isListening || voiceStatus === "processing") && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="mx-auto mb-2 max-w-lg text-center"
            >
              <span className="text-xs italic text-blue-calm">
                {isListening ? "Pode falar, estou aqui 💙" : "Entendi... deixa eu te responder 💙"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto flex max-w-lg items-center gap-2">
          <motion.button
            onClick={toggleListening}
            animate={isListening ? { scale: [1, 1.08, 1], boxShadow: ["0 0 0px hsl(213 55% 68% / 0)", "0 0 18px hsl(213 55% 68% / 0.2)", "0 0 0px hsl(213 55% 68% / 0)"] } : { scale: 1 }}
            transition={isListening ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
            whileTap={{ scale: 0.88 }}
            className={`flex-shrink-0 rounded-full p-2.5 transition-all duration-200 ${
              isListening
                ? "bg-[hsl(var(--blue-soft)/0.12)] text-blue-calm"
                : "text-muted-foreground/45 hover:text-foreground/65 hover:bg-secondary/30"
            }`}
          >
            {isListening ? <MicOff size={19} /> : <Mic size={19} />}
          </motion.button>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(input)}
            placeholder={isListening ? "Ouvindo..." : "Como posso te ajudar hoje?"}
            className="flex-1 rounded-full input-field px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/35 focus:outline-none"
            readOnly={isListening}
          />

          <motion.button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isLoading}
            whileTap={{ scale: 0.85 }}
            className="flex-shrink-0 rounded-full bg-[hsl(var(--gold))] p-2.5 text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--gold-light))] disabled:opacity-10"
            style={{ boxShadow: "0 2px 12px hsl(43 55% 52% / 0.18)" }}
          >
            <Send size={17} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Index;
