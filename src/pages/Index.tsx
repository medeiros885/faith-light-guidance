import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, ArrowLeft } from "lucide-react";
import bibleLogo from "@/assets/bible-logo.png";
import SuggestionCard from "@/components/SuggestionCard";
import ResponseView from "@/components/ResponseView";
import HelpTopics from "@/components/HelpTopics";
import TypingIndicator from "@/components/TypingIndicator";
import { generateMockResponse, type BibleResponse } from "@/data/mockResponses";

type Screen = "home" | "help" | "chat";

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
  "Buscando na Palavra...",
  "Meditando...",
  "Preparando resposta...",
];

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput(transcript);

      // Auto-submit on final result
      if (event.results[event.results.length - 1].isFinal) {
        setIsListening(false);
      }
    };

    recognition.onerror = () => setIsListening(false);
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
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading, scrollToBottom]);

  useEffect(() => {
    if (screen === "chat" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [screen]);

  const simulateResponse = useCallback((question: string, append: boolean = true) => {
    setIsLoading(true);

    if (append) {
      setChatHistory((prev) => [...prev, { question, response: null }]);
    } else {
      setChatHistory([{ question, response: null }]);
    }

    setScreen("chat");
    setInput("");

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const response = generateMockResponse(question);
      setChatHistory((prev) =>
        prev.map((entry, i) =>
          i === prev.length - 1 && entry.response === null
            ? { ...entry, response }
            : entry
        )
      );
      setIsLoading(false);
    }, delay);
  }, []);

  const handleSubmit = (question: string) => {
    if (!question.trim() || isLoading) return;
    simulateResponse(question, screen === "chat");
  };

  const handleHelpSelect = (label: string, response: BibleResponse) => {
    const question = `Preciso de ajuda com: ${label}`;
    setChatHistory([{ question, response: null }]);
    setScreen("chat");
    setIsLoading(true);

    setTimeout(() => {
      setChatHistory([{ question, response }]);
      setIsLoading(false);
    }, 1400);
  };

  const handleBack = () => {
    setScreen("home");
    setChatHistory([]);
    setIsLoading(false);
  };

  const headerPhrase = loadingHeaderPhrases[Math.floor(Math.random() * loadingHeaderPhrases.length)];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Header for chat */}
      <AnimatePresence>
        {screen === "chat" && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/30 bg-background/85 px-4 py-3 backdrop-blur-xl"
          >
            <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              <ArrowLeft size={20} />
            </button>
            <img src={bibleLogo} alt="" className="h-7 w-7 opacity-90" />
            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold text-gold">Luz na Palavra</span>
              <AnimatePresence>
                {isLoading && (
                  <motion.span
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] italic text-muted-foreground"
                  >
                    {headerPhrase}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-5">
          <AnimatePresence mode="wait">
            {screen === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-[calc(100dvh-80px)] flex-col items-center justify-center py-10"
              >
                <motion.img
                  src={bibleLogo}
                  alt="Luz na Palavra"
                  width={72}
                  height={72}
                  className="mb-5 drop-shadow-[0_0_24px_hsl(43_55%_52%/0.2)]"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />

                <motion.h1
                  className="font-display text-3xl font-bold text-gold"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  Luz na Palavra
                </motion.h1>

                <motion.p
                  className="mt-2.5 max-w-[280px] text-center text-sm leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  Faça uma pergunta e receba uma resposta baseada na Bíblia
                </motion.p>

                <div className="mt-9 w-full space-y-2.5">
                  {suggestions.map((s, i) => (
                    <SuggestionCard key={s} text={s} index={i} onClick={handleSubmit} />
                  ))}
                </div>

                <div className="my-7 flex w-full items-center gap-4">
                  <div className="h-px flex-1 bg-border/30" />
                  <span className="text-xs text-muted-foreground/60">ou</span>
                  <div className="h-px flex-1 bg-border/30" />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setScreen("help")}
                  className="w-full rounded-2xl gradient-help px-6 py-4 text-base font-semibold text-foreground/95 shadow-lg glow-blue transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  💙 Preciso de ajuda hoje
                </motion.button>

                <motion.p
                  className="mt-4 text-[11px] text-muted-foreground/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.75 }}
                >
                  Você também pode usar o microfone para falar
                </motion.p>
              </motion.div>
            )}

            {screen === "help" && (
              <motion.div
                key="help"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
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
                transition={{ duration: 0.3 }}
                className="py-4 space-y-3"
              >
                {chatHistory.map((entry, i) => (
                  <div key={i}>
                    {entry.response ? (
                      <ResponseView question={entry.question} response={entry.response} />
                    ) : (
                      <div className="flex justify-end mb-2">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ ease: "easeOut" }}
                          className="max-w-[80%] rounded-2xl rounded-tr-sm user-bubble px-4 py-3 text-sm text-foreground/90 leading-relaxed"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 border-t border-border/25 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <button
            onClick={toggleListening}
            className={`flex-shrink-0 rounded-full p-2 transition-all duration-200 ${
              isListening
                ? "bg-destructive/20 text-destructive animate-pulse"
                : "text-muted-foreground/60 hover:text-foreground/80 hover:bg-secondary/50"
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(input)}
            placeholder="Como posso te ajudar hoje?"
            className="flex-1 rounded-full input-field px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 rounded-full bg-gold p-2.5 text-primary-foreground transition-all duration-200 hover:bg-gold-light disabled:opacity-20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
