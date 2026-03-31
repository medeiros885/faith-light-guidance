import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Heart, BookMarked, HandHelping, MessageCircle } from "lucide-react";
import ListenButton from "@/components/ListenButton";
import type { BibleResponse } from "@/data/mockResponses";

interface ResponseViewProps {
  response: BibleResponse;
  question: string;
}

const sectionDelay = (base: number) => ({ delay: base, ease: "easeOut" as const });

const ResponseView = ({ response, question }: ResponseViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2.5 pb-6"
    >
      {/* User question */}
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-[75%] rounded-2xl rounded-tr-sm user-bubble px-4 py-3 text-sm leading-relaxed text-foreground/85"
        >
          {question}
        </motion.div>
      </div>

      {/* Acolhimento — direct answer first */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={sectionDelay(0.1)}
        className="flex justify-start"
      >
        <div className="max-w-[86%] rounded-2xl rounded-tl-sm assistant-bubble px-4 py-3 text-sm leading-relaxed text-foreground/80">
          {response.acolhimento}
        </div>
      </motion.div>

      {/* Contexto Bíblico */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={sectionDelay(0.25)}
        className="flex justify-start"
      >
        <div className="max-w-[86%] assistant-bubble rounded-2xl rounded-tl-sm p-4">
          <div className="mb-1.5 flex items-center gap-2 text-gold-light">
            <BookOpen size={13} strokeWidth={1.6} />
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">Contexto Bíblico</span>
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/75">{response.contexto}</p>
        </div>
      </motion.div>

      {/* Explicação */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={sectionDelay(0.4)}
        className="flex justify-start"
      >
        <div className="max-w-[86%] assistant-bubble rounded-2xl rounded-tl-sm p-4">
          <div className="mb-1.5 flex items-center gap-2 text-gold-light">
            <Lightbulb size={13} strokeWidth={1.6} />
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">Explicação</span>
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/75">{response.explicacao}</p>
        </div>
      </motion.div>

      {/* Aplicação Prática */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={sectionDelay(0.55)}
        className="flex justify-start"
      >
        <div className="max-w-[86%] assistant-bubble rounded-2xl rounded-tl-sm p-4">
          <div className="mb-1.5 flex items-center gap-2 text-gold-light">
            <Heart size={13} strokeWidth={1.6} />
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">Na Prática</span>
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/75">{response.aplicacao}</p>
        </div>
      </motion.div>

      {/* Versículos */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={sectionDelay(0.7)}
        className="flex justify-start"
      >
        <div className="max-w-[86%] assistant-bubble rounded-2xl rounded-tl-sm p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold-light">
              <BookMarked size={13} strokeWidth={1.6} />
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">Versículos</span>
            </div>
            <ListenButton text={response.versiculos.join(". ")} size="sm" />
          </div>
          <div className="space-y-2">
            {response.versiculos.map((v, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-foreground/75 border-l-2 border-gold/12 pl-3 italic">
                {v}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Oração */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={sectionDelay(0.85)}
        className="flex justify-start"
      >
        <div className="max-w-[86%] assistant-bubble rounded-2xl rounded-tl-sm p-4">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold-light">
              <HandHelping size={13} strokeWidth={1.6} />
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">Oração</span>
            </div>
            <ListenButton text={response.oracao} size="sm" />
          </div>
          <p className="text-[13px] italic leading-relaxed text-foreground/60">{response.oracao}</p>
        </div>
      </motion.div>

      {/* Follow-up — always guide to next step */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={sectionDelay(1.0)}
        className="flex justify-start"
      >
        <div className="max-w-[86%] rounded-2xl rounded-tl-sm assistant-bubble px-4 py-3 text-[13px] leading-relaxed text-foreground/75">
          <div className="flex items-start gap-2">
            <MessageCircle size={13} className="mt-0.5 flex-shrink-0 text-blue-calm" strokeWidth={1.6} />
            <span>{response.followUp}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResponseView;
