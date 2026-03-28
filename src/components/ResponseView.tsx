import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Heart, BookMarked, HandHelping, MessageCircle } from "lucide-react";
import type { BibleResponse } from "@/data/mockResponses";

interface ResponseViewProps {
  response: BibleResponse;
  question: string;
}

const ResponseView = ({ response, question }: ResponseViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2.5 pb-6"
    >
      {/* User question bubble */}
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-[82%] rounded-2xl rounded-tr-sm user-bubble px-4 py-3 text-sm text-foreground/90 leading-relaxed"
        >
          {question}
        </motion.div>
      </div>

      {/* Acolhimento — warm greeting bubble */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, ease: "easeOut" }}
        className="flex justify-start"
      >
        <div className="max-w-[88%] rounded-2xl rounded-tl-sm glass-card px-4 py-3 text-sm leading-relaxed text-foreground/85">
          {response.acolhimento}
        </div>
      </motion.div>

      {/* Contexto Bíblico */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, ease: "easeOut" }}
        className="flex justify-start"
      >
        <div className="max-w-[88%] glass-card rounded-2xl rounded-tl-sm p-4">
          <div className="mb-1.5 flex items-center gap-2 text-gold-light">
            <BookOpen size={14} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Contexto Bíblico</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{response.contexto}</p>
        </div>
      </motion.div>

      {/* Explicação */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ease: "easeOut" }}
        className="flex justify-start"
      >
        <div className="max-w-[88%] glass-card rounded-2xl rounded-tl-sm p-4">
          <div className="mb-1.5 flex items-center gap-2 text-gold-light">
            <Lightbulb size={14} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Explicação</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{response.explicacao}</p>
        </div>
      </motion.div>

      {/* Aplicação Prática */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, ease: "easeOut" }}
        className="flex justify-start"
      >
        <div className="max-w-[88%] glass-card rounded-2xl rounded-tl-sm p-4">
          <div className="mb-1.5 flex items-center gap-2 text-gold-light">
            <Heart size={14} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Na Prática</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">{response.aplicacao}</p>
        </div>
      </motion.div>

      {/* Versículos */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, ease: "easeOut" }}
        className="flex justify-start"
      >
        <div className="max-w-[88%] glass-card rounded-2xl rounded-tl-sm p-4">
          <div className="mb-2 flex items-center gap-2 text-gold-light">
            <BookMarked size={14} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Versículos</span>
          </div>
          <div className="space-y-2">
            {response.versiculos.map((v, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/80 border-l-2 border-gold/20 pl-3 italic">
                {v}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Oração */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, ease: "easeOut" }}
        className="flex justify-start"
      >
        <div className="max-w-[88%] glass-card rounded-2xl rounded-tl-sm p-4 border-gold/10">
          <div className="mb-1.5 flex items-center gap-2 text-gold-light">
            <HandHelping size={14} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Oração</span>
          </div>
          <p className="text-sm italic leading-relaxed text-foreground/75">{response.oracao}</p>
        </div>
      </motion.div>

      {/* Follow-up question */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, ease: "easeOut" }}
        className="flex justify-start"
      >
        <div className="max-w-[88%] rounded-2xl rounded-tl-sm glass-card px-4 py-3 text-sm leading-relaxed text-foreground/85">
          <div className="flex items-start gap-2">
            <MessageCircle size={14} className="mt-0.5 flex-shrink-0 text-blue-calm" strokeWidth={1.8} />
            <span>{response.followUp}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResponseView;
