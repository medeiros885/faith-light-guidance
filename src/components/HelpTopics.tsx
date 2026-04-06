import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  BookMarked,
  HandHelping,
  MessageCircle,
  Sparkles,
  Shield,
  Quote,
} from "lucide-react";
import { helpTopics } from "@/data/mockResponses";
import type { BibleResponse } from "@/data/mockResponses";

interface HelpTopicsProps {
  onSelect: (question: string, response: BibleResponse) => void;
  onBack: () => void;
}

const emotionStyles: Record<string, string> = {
  ansiedade:
    "border-cyan-300/12 bg-[linear-gradient(180deg,rgba(34,211,238,0.10),rgba(255,255,255,0.03))]",
  tristeza:
    "border-slate-300/12 bg-[linear-gradient(180deg,rgba(148,163,184,0.10),rgba(255,255,255,0.03))]",
  medo:
    "border-indigo-300/12 bg-[linear-gradient(180deg,rgba(99,102,241,0.10),rgba(255,255,255,0.03))]",
  tentacao:
    "border-amber-300/12 bg-[linear-gradient(180deg,rgba(251,191,36,0.10),rgba(255,255,255,0.03))]",
};

const helpVerses = [
  {
    ref: "Salmos 34:18",
    text: "Perto está o Senhor dos que têm o coração quebrantado.",
  },
  {
    ref: "Isaías 41:10",
    text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.",
  },
  {
    ref: "Mateus 11:28",
    text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
  },
];

const HelpTopics = ({ onSelect, onBack }: HelpTopicsProps) => {
  const [showTalkModal, setShowTalkModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-2 text-sm text-muted-foreground transition-all duration-200 hover:border-white/12 hover:bg-white/[0.05] hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Voltar
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
        className="glass-card relative overflow-hidden rounded-[30px] px-6 py-7 text-center"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,102,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.06),transparent_30%)]" />

        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/10 bg-gold/8 shadow-[0_0_24px_rgba(255,215,102,0.05)]">
            <Heart size={24} className="text-gold/75" strokeWidth={1.7} />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/62">
            Lugar seguro
          </p>

          <h2 className="mt-2 font-display text-[28px] font-semibold text-foreground/96">
            Você não está sozinho
          </h2>

          <p className="mx-auto mt-3 max-w-[300px] text-[13px] leading-6 text-muted-foreground/52">
            Este é um espaço de acolhimento. Deus vê o seu coração, e você pode
            descansar sem precisar fingir força agora.
          </p>
        </div>
      </motion.div>

      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/10 bg-gold/8 text-gold-light">
            <BookMarked size={13} strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-light">
            Palavras de conforto
          </span>
        </div>

        {helpVerses.map((v, i) => (
          <motion.div
            key={v.ref}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16 + i * 0.08, duration: 0.35 }}
            className="glass-card rounded-[22px] p-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gold/10 bg-gold/8 text-gold-light">
                <Quote size={12} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="border-l-2 border-gold/20 pl-3 text-[13.5px] italic leading-6 text-foreground/82">
                  “{v.text}”
                </p>
                <span className="mt-2 block pl-3 text-[11px] font-medium text-gold/60">
                  {v.ref}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.35 }}
        className="glass-card relative overflow-hidden rounded-[24px] border-gold/10 p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,215,102,0.06),transparent_34%)]" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2 text-gold-light">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/10 bg-gold/8">
              <HandHelping size={14} strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">
              Oração
            </span>
          </div>

          <p className="text-[13.5px] italic leading-6 text-foreground/76">
            Senhor, Tu vês meu coração neste momento. Eu não preciso fingir que
            estou bem. Abraça-me, sustenta minha alma, restaura minha esperança
            e me lembra que Tua presença continua comigo. Amém.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52, duration: 0.35 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200">
            <Sparkles size={13} strokeWidth={1.8} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/58">
            Como você está se sentindo?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {helpTopics.map((topic, i) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.58 + i * 0.06, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2 }}
              onClick={() => onSelect(topic.label, topic.response)}
              className={`group relative overflow-hidden rounded-[22px] border p-5 transition-all duration-300 hover:border-white/16 ${
                emotionStyles[topic.id] ||
                "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_30%)] opacity-90" />

              <div className="relative flex flex-col items-center gap-2.5">
                <span className="text-[26px] leading-none">{topic.emoji}</span>
                <span className="text-[12px] font-medium text-foreground/88 transition-colors duration-200 group-hover:text-foreground">
                  {topic.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.86, duration: 0.35 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowTalkModal(true)}
        className="gold-highlight-btn flex w-full items-center justify-center gap-2.5 rounded-[24px] px-6 py-4 text-sm font-semibold text-gold-light"
      >
        <MessageCircle size={16} />
        Falar com alguém de confiança
      </motion.button>

      <AnimatePresence>
        {showTalkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/82 px-6 backdrop-blur-md"
            onClick={() => setShowTalkModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.22 }}
              className="glass-card w-full max-w-sm rounded-[28px] p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/10 bg-gold/8">
                <Shield size={22} className="text-gold/72" strokeWidth={1.7} />
              </div>

              <h3 className="font-display text-[22px] font-semibold text-foreground/92">
                Você é importante
              </h3>

              <p className="mt-3 text-[13px] leading-6 text-muted-foreground/56">
                Se estiver passando por algo muito pesado, procure alguém de
                confiança — um pastor, familiar, amigo próximo ou líder. Você
                não precisa enfrentar isso sozinho.
              </p>

              <p className="mt-4 text-[12px] font-medium text-foreground/72">
                CVV: ligue 188
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground/42">
                atendimento 24 horas
              </p>

              <button
                onClick={() => setShowTalkModal(false)}
                className="mt-5 rounded-full border border-blue-300/10 bg-[linear-gradient(145deg,rgba(96,165,250,0.12),rgba(96,165,250,0.06))] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-blue-calm transition-all duration-200 hover:border-blue-300/16"
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