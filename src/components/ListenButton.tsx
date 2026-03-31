import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface ListenButtonProps {
  text: string;
  size?: "sm" | "md";
}

const ListenButton = ({ text, size = "sm" }: ListenButtonProps) => {
  const [speaking, setSpeaking] = useState(false);

  const toggle = useCallback(() => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [text, speaking]);

  const iconSize = size === "sm" ? 12 : 14;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      aria-label={speaking ? "Parar leitura" : "Ouvir"}
      className={`rounded-full transition-all duration-200 ${
        speaking
          ? "bg-[hsl(var(--blue-soft)/0.15)] text-blue-calm"
          : "text-muted-foreground/40 hover:text-foreground/60 hover:bg-secondary/30"
      } ${size === "sm" ? "p-1.5" : "p-2"}`}
    >
      {speaking ? <VolumeX size={iconSize} /> : <Volume2 size={iconSize} />}
    </motion.button>
  );
};

export default ListenButton;
