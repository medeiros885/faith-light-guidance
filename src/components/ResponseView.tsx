import { motion } from "framer-motion";
import {
  BookOpen,
  Lightbulb,
  Heart,
  BookMarked,
  HandHelping,
  MessageCircle,
  Sparkles,
  Quote,
} from "lucide-react";
import ListenButton from "@/components/ListenButton";
import type { BibleResponse } from "@/data/mockResponses";

interface ResponseViewProps {
  response: BibleResponse;
  question: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

const ResponseView = ({ response, question }: ResponseViewProps) => {
  const verses = Array.isArray(response.versiculos) ? response.versiculos : [];
  const versesText = verses.join(". ");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* 1. PERGUNTA DO USUÁRIO */}
      <motion.div variants={itemVariants} className="flex justify-end pl-12">
        <div className="relative bg-gradient-to-br from-gold to-gold-dark px-5 py-3 rounded-[24px] rounded-tr-none shadow-xl shadow-gold/10">
          <p className="text-sm font-bold text-black/80 leading-relaxed italic">
            "{question}"
          </p>
          {/* Triângulo da bolha de chat */}
          <div className="absolute top-0 -right-1 w-4 h-4 bg-gold-dark [clip-path:polygon(0_0,0_100%,100%_0)]" />
        </div>
      </motion.div>

      {/* 2. ACOLHIMENTO (A RESPOSTA DA IA) */}
      <motion.div variants={itemVariants} className="flex justify-start pr-6">
        <div className="glass-premium rounded-[28px] rounded-tl-none p-6 border border-white/10 relative overflow-hidden">
          <div className="absolute -left-4 -top-4 opacity-5">
            <Sparkles size={80} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Sparkles size={14} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/60">Consolo Bíblico</span>
          </div>

          <p className="text-[17px] leading-relaxed text-white/90 font-medium antialiased">
            {response.acolhimento}
          </p>
        </div>
      </motion.div>

      {/* 3. ENSINAMENTO (CONTEXTO + EXPLICAÇÃO) */}
      <motion.div variants={itemVariants} className="space-y-6 px-2">
        <div className="grid gap-6">
          <section>
            <div className="flex items-center gap-3 mb-3">
              <BookOpen size={16} className="text-gold/50" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Contexto Histórico</h4>
            </div>
            <p className="text-sm text-white/60 leading-relaxed pl-7">
              {response.contexto}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb size={16} className="text-gold" />
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold/60">A Sabedoria para hoje</h4>
            </div>
            <p className="text-sm text-white/80 leading-relaxed pl-7 font-medium border-l border-gold/20">
              {response.explicacao}
            </p>
          </section>
        </div>
      </motion.div>

      {/* 4. VERSÍCULOS CHAVE (O CENTRO) */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <BookMarked size={16} className="text-blue-400" />
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400/60">Escrituras Sagradas</h4>
          </div>
          {verses.length > 0 && <ListenButton text={versesText} size="sm" />}
        </div>

        <div className="space-y-3">
          {verses.map((verse, i) => (
            <div key={i} className="group relative glass-premium p-5 rounded-[24px] border border-white/5 overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-500/40" />
              <Quote size={20} className="absolute -right-2 -bottom-2 text-white/5 rotate-12" />
              <p className="font-serif italic text-[15px] leading-relaxed text-white/90">
                {verse}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. ORAÇÃO (MOMENTO FINAL) */}
      {response.oracao && (
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative glass-premium border border-gold/20 rounded-[32px] p-8 text-center space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-gold/10 text-gold mb-2">
                <HandHelping size={24} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">Elevemos o Coração</h4>
            </div>

            <p className="font-serif text-lg italic text-gold-light leading-loose">
              "{response.oracao}"
            </p>

            <div className="pt-2 flex justify-center">
              <ListenButton text={response.oracao} size="md" />
            </div>
          </div>
        </motion.div>
      )}

      {/* 6. FOLLOW UP */}
      <motion.div variants={itemVariants} className="pt-4 px-6">
        <div className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-white/5 border border-white/5 italic">
          <MessageCircle size={16} className="text-white/20" />
          <p className="text-xs text-white/40 leading-relaxed">
            {response.followUp}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResponseView;
