import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { helpTopics } from "@/data/mockResponses";
import type { BibleResponse } from "@/data/mockResponses";

interface HelpTopicsProps {
  onSelect: (question: string, response: BibleResponse) => void;
  onBack: () => void;
}

const emotionStyles: Record<string, string> = {
  ansiedade: "emotion-card-anxiety",
  tristeza: "emotion-card-sadness",
  medo: "emotion-card-fear",
  tentacao: "emotion-card-temptation",
};

const HelpTopics = ({ onSelect, onBack }: HelpTopicsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="text-center space-y-2 py-3">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Como você está se sentindo?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Escolha o que mais se aproxima do que você está vivendo.
          <br />
          <span className="text-[11px] italic text-muted-foreground/70">Você está em um lugar seguro.</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {helpTopics.map((topic, i) => (
          <motion.button
            key={topic.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(topic.label, topic.response)}
            className={`flex flex-col items-center gap-3 rounded-2xl p-6 border transition-all duration-300 ${emotionStyles[topic.id] || "glass-card"}`}
          >
            <span className="text-3xl">{topic.emoji}</span>
            <span className="text-sm font-medium text-foreground/90">{topic.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default HelpTopics;
