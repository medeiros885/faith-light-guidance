import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface ListenButtonProps {
  text: string;
  size?: "sm" | "md";
}

const ListenButton = ({ text, size = "sm" }: ListenButtonProps) => {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

  const stopSpeaking = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
  }, [supported]);

  const pickVoice = useCallback(() => {
    if (!supported) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    const preferred =
      voices.find((voice) => voice.lang?.toLowerCase().includes("pt-br")) ||
      voices.find((voice) => voice.lang?.toLowerCase().includes("pt")) ||
      voices.find((voice) => /luciana|felipe|maria|brasil/i.test(voice.name)) ||
      voices[0];

    return preferred ?? null;
  }, [supported]);

  const speakNow = useCallback(() => {
    if (!supported) {
      toast.error("Seu dispositivo não suporta leitura em voz.");
      return;
    }

    const safeText = text?.trim();
    if (!safeText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(safeText);
    utterance.lang = "pt-BR";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = pickVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "pt-BR";
    }

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      utteranceRef.current = null;
      setSpeaking(false);
    };

    utterance.onerror = () => {
      utteranceRef.current = null;
      setSpeaking(false);
      toast.error("Não consegui reproduzir esse áudio agora.");
    };

    utteranceRef.current = utterance;

    try {
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    } catch {
      utteranceRef.current = null;
      setSpeaking(false);
      toast.error("Não consegui iniciar a leitura agora.");
    }
  }, [pickVoice, supported, text]);

  const startSpeaking = useCallback(() => {
    if (!supported) {
      toast.error("Seu dispositivo não suporta leitura em voz.");
      return;
    }

    if (!text?.trim()) return;

    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      speakNow();
      return;
    }

    const handleVoicesChanged = () => {
      speakNow();
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };

    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      if (!utteranceRef.current) {
        speakNow();
      }
    }, 700);
  }, [speakNow, supported, text]);

  const toggle = useCallback(() => {
    if (speaking) {
      stopSpeaking();
      return;
    }

    startSpeaking();
  }, [speaking, startSpeaking, stopSpeaking]);

  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  useEffect(() => {
    if (speaking) {
      stopSpeaking();
    }
  }, [text, speaking, stopSpeaking]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && speaking) {
        stopSpeaking();
      }
    };

    const handlePageHide = () => {
      if (speaking) {
        stopSpeaking();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [speaking, stopSpeaking]);

  const iconSize = size === "sm" ? 12 : 14;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      animate={
        speaking
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0px rgba(96,165,250,0)",
                "0 0 18px rgba(96,165,250,0.22)",
                "0 0 0px rgba(96,165,250,0)",
              ],
            }
          : { scale: 1, boxShadow: "0 0 0px rgba(0,0,0,0)" }
      }
      transition={
        speaking
          ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.2 }
      }
      onClick={toggle}
      disabled={!text?.trim()}
      aria-label={speaking ? "Parar leitura" : "Ouvir"}
      aria-pressed={speaking}
      className={`group relative overflow-hidden rounded-full border transition-all duration-250 disabled:cursor-not-allowed disabled:opacity-40 ${
        speaking
          ? "border-blue-300/20 bg-[hsl(var(--blue-soft)/0.16)] text-blue-calm"
          : "border-white/8 bg-white/[0.03] text-muted-foreground/42 hover:border-white/14 hover:bg-white/[0.05] hover:text-foreground/72"
      } ${size === "sm" ? "p-1.5" : "p-2"}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.10),transparent_40%)] opacity-0 transition duration-300 group-hover:opacity-100" />

      <span className="relative z-10 flex items-center justify-center">
        {speaking ? <VolumeX size={iconSize} /> : <Volume2 size={iconSize} />}
      </span>
    </motion.button>
  );
};

export default ListenButton;