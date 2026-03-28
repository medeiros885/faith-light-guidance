import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, ArrowLeft } from "lucide-react";
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

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Focus input when entering chat
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

    // Simulate typing delay (800-1500ms)
    const delay = 800 + Math.random() * 700;
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
    }, 1000);
  };

  const handleBack = () => {
    setScreen("home");
    setChatHistory([]);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Header for chat */}
      <AnimatePresence>
        {screen === "chat" && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-lg"
          >
            <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </button>
            <img src={bibleLogo} alt="" className="h-7 w-7" />
            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold text-gold">Luz na Palavra</span>
              <AnimatePresence>
                {isLoading && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] text-muted-foreground"
                  >
                    escrevendo...
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4">
          <AnimatePresence mode="wait">
            {screen === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex min-h-[calc(100dvh-80px)] flex-col items-center justify-center py-8"
              >
                <motion.img
                  src={bibleLogo}
                  alt="Luz na Palavra"
                  width={80}
                  height={80}
                  className="mb-4 drop-shadow-[0_0_20px_hsl(43_65%_52%/0.3)]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />

                <motion.h1
                  className="font-display text-3xl font-bold text-gold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  Luz na Palavra
                </motion.h1>

                <motion.p
                  className="mt-2 max-w-xs text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  Faça uma pergunta e receba uma resposta baseada na Bíblia
                </motion.p>

                <div className="mt-8 w-full space-y-2">
                  {suggestions.map((s, i) => (
                    <SuggestionCard key={s} text={s} index={i} onClick={handleSubmit} />
                  ))}
                </div>

                <div className="my-6 flex w-full items-center gap-3">
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setScreen("help")}
                  className="w-full rounded-2xl gradient-help px-6 py-4 text-base font-semibold text-foreground shadow-lg glow-blue animate-glow-pulse transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  💙 Preciso de ajuda hoje
                </motion.button>

                <motion.p
                  className="mt-3 text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Você também pode usar o microfone para falar
                </motion.p>
              </motion.div>
            )}

            {screen === "help" && (
              <motion.div
                key="help"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
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
                className="py-4 space-y-2"
              >
                {chatHistory.map((entry, i) => (
                  <div key={i}>
                    {entry.response ? (
                      <ResponseView question={entry.question} response={entry.response} />
                    ) : (
                      /* Show only the user bubble while loading */
                      <div className="flex justify-end mb-2">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gold/20 px-4 py-3 text-sm text-foreground"
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
      <div className="sticky bottom-0 border-t border-border/50 bg-background/90 px-4 py-3 backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <button className="flex-shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary">
            <Mic size={20} />
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(input)}
            placeholder="Pergunte sobre a Bíblia..."
            className="flex-1 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/50"
          />
          <button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 rounded-full bg-gold p-2.5 text-primary-foreground transition-all hover:bg-gold-light disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
