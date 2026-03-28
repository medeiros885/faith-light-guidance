import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, BookMarked, HandHelping, MessageCircle } from "lucide-react";
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

const helpVerses = [
  { ref: "Salmos 34:18", text: "Perto está o Senhor dos que têm o coração quebrantado." },
  { ref: "Isaías 41:10", text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus." },
  { ref: "Mateus 11:28", text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei." },
];

const HelpTopics = ({ onSelect, onBack }: HelpTopicsProps) => {
  const [showTalkModal, setShowTalkModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-6"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      {/* Hero message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center space-y-3 py-4"
      >
        <Heart size={32} className="mx-auto text-gold/60" strokeWidth={1.5} />
        <h2 className="font-display text-2xl font-bold text-foreground/95">
          Você não está sozinho
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
          Este é um lugar seguro. Deus está aqui, e eu também. 💙
        </p>
      </motion.div>

      {/* Verse cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gold-light px-1">
          <BookMarked size={13} strokeWidth={1.8} />
          <span className="text-[10px] font-semibold uppercase tracking-widest">
            Palavras de conforto
          </span>
        </div>
        {helpVerses.map((v, i) => (
          <motion.div
            key={v.ref}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="glass-card rounded-xl p-4"
          >
            <p className="text-sm italic leading-relaxed text-foreground/80 border-l-2 border-gold/20 pl-3">
              "{v.text}"
            </p>
            <span className="mt-2 block text-[11px] font-medium text-gold/60 pl-3">
              {v.ref}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Prayer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass-card rounded-xl p-5 border-gold/10"
      >
        <div className="flex items-center gap-2 text-gold-light mb-3">
          <HandHelping size={14} strokeWidth={1.8} />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Oração</span>
        </div>
        <p className="text-sm italic leading-relaxed text-foreground/75">
          Senhor, Tu vês meu coração neste momento. Eu não preciso fingir que estou bem.
          Abraça-me, restaura minha esperança, e me lembra que essa dor não vai durar pra sempre.
          Eu confio em Ti. Amém. 🙏
        </p>
      </motion.div>

      {/* Emotion selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="space-y-3"
      >
        <p className="text-center text-sm text-muted-foreground">
          Se quiser, me conte como se sente:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {helpTopics.map((topic, i) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.08, duration: 0.35 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(topic.label, topic.response)}
              className={`flex flex-col items-center gap-2.5 rounded-2xl p-5 border transition-all duration-300 ${emotionStyles[topic.id] || "glass-card"}`}
            >
              <span className="text-2xl">{topic.emoji}</span>
              <span className="text-xs font-medium text-foreground/85">{topic.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Talk to someone button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setShowTalkModal(true)}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-gold/15 bg-[hsl(var(--gold)/0.06)] px-6 py-4 text-sm font-medium text-gold-light transition-all duration-300 hover:bg-[hsl(var(--gold)/0.1)]"
      >
        <MessageCircle size={16} />
        Falar com alguém de confiança
      </motion.button>

      {/* Simple modal */}
      <AnimatePresence>
        {showTalkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
            onClick={() => setShowTalkModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card rounded-2xl p-6 max-w-sm w-full text-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart size={28} className="mx-auto text-gold/60" />
              <h3 className="font-display text-lg font-semibold text-foreground/90">
                Você é importante
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Se estiver passando por algo difícil, procure alguém de confiança —
                um pastor, amigo, familiar ou líder. Você não precisa enfrentar isso sozinho(a). 💙
              </p>
              <p className="text-xs text-muted-foreground/60">
                CVV: ligue 188 (24h) — Centro de Valorização da Vida
              </p>
              <button
                onClick={() => setShowTalkModal(false)}
                className="rounded-full bg-[hsl(var(--blue-soft)/0.12)] px-6 py-2.5 text-xs font-medium text-blue-calm transition-colors hover:bg-[hsl(var(--blue-soft)/0.18)]"
              >
                Entendi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HelpTopics;
