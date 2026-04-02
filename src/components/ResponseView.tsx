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

const sectionTransition = (delay: number) => ({
  duration: 0.42,
  delay,
  ease: "easeOut" as const,
});

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.988 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function SectionHeader({
  icon,
  label,
  accent = "text-blue-calm",
  right,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl ${accent}`}
        >
          {icon}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/58">
          {label}
        </span>
      </div>
      {right}
    </div>
  );
}

function AssistantCard({
  children,
  className = "",
  glow = true,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.035))] shadow-[0_14px_34px_rgba(0,0,0,0.24)] backdrop-blur-2xl ${className}`}
    >
      {glow && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.12),transparent_34%)]" />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[26px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function BodyText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-[13.5px] leading-6 text-foreground/80 ${className}`}>
      {children}
    </p>
  );
}

function SectionBlock({
  icon,
  label,
  accent,
  children,
  className = "",
  right,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: string;
  children: React.ReactNode;
  className?: string;
  right?: React.ReactNode;
}) {
  return (
    <AssistantCard className={`rounded-tl-sm ${className}`}>
      <div className="px-4 py-4">
        <SectionHeader icon={icon} label={label} accent={accent} right={right} />
        {children}
      </div>
    </AssistantCard>
  );
}

const ResponseView = ({ response, question }: ResponseViewProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-3.5 pb-7"
    >
      {/* User question */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <div className="max-w-[79%] rounded-[22px] rounded-tr-sm border border-white/10 bg-[linear-gradient(180deg,rgba(255,215,102,0.18),rgba(255,215,102,0.07))] px-4 py-3 text-sm leading-relaxed text-foreground/92 shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          {question}
        </div>
      </motion.div>

      {/* Main answer / acolhimento */}
      <motion.div
        variants={itemVariants}
        transition={sectionTransition(0.08)}
        className="flex justify-start"
      >
        <div className="max-w-[93%]">
          <div className="mb-2.5 flex items-center gap-2 pl-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-300/15 bg-blue-400/10 text-blue-200 shadow-[0_0_20px_rgba(96,165,250,0.18)]">
              <Sparkles size={14} strokeWidth={1.85} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-100/62">
              Resposta principal
            </span>
          </div>

          <AssistantCard className="rounded-tl-sm border-blue-300/10 bg-[linear-gradient(180deg,rgba(18,62,122,0.34),rgba(7,24,46,0.78))]">
            <div className="px-5 py-4.5">
              <p className="text-[15.5px] font-medium leading-7 text-foreground/95">
                {response.acolhimento}
              </p>
            </div>
          </AssistantCard>
        </div>
      </motion.div>

      {/* Contexto */}
      <motion.div
        variants={itemVariants}
        transition={sectionTransition(0.16)}
        className="flex justify-start"
      >
        <div className="max-w-[91%]">
          <SectionBlock
            icon={<BookOpen size={13} strokeWidth={1.75} />}
            label="Contexto bíblico"
            accent="text-blue-200"
          >
            <BodyText>{response.contexto}</BodyText>
          </SectionBlock>
        </div>
      </motion.div>

      {/* Explicação */}
      <motion.div
        variants={itemVariants}
        transition={sectionTransition(0.24)}
        className="flex justify-start"
      >
        <div className="max-w-[91%]">
          <SectionBlock
            icon={<Lightbulb size={13} strokeWidth={1.75} />}
            label="Explicação"
            accent="text-gold-light"
          >
            <BodyText>{response.explicacao}</BodyText>
          </SectionBlock>
        </div>
      </motion.div>

      {/* Aplicação */}
      <motion.div
        variants={itemVariants}
        transition={sectionTransition(0.32)}
        className="flex justify-start"
      >
        <div className="max-w-[91%]">
          <SectionBlock
            icon={<Heart size={13} strokeWidth={1.75} />}
            label="Na prática"
            accent="text-pink-200"
          >
            <BodyText>{response.aplicacao}</BodyText>
          </SectionBlock>
        </div>
      </motion.div>

      {/* Versículos */}
      <motion.div
        variants={itemVariants}
        transition={sectionTransition(0.4)}
        className="flex justify-start"
      >
        <div className="max-w-[93%]">
          <SectionBlock
            icon={<BookMarked size={13} strokeWidth={1.75} />}
            label="Versículos"
            accent="text-blue-200"
            className="border-blue-300/10 bg-[linear-gradient(180deg,rgba(11,46,91,0.58),rgba(4,11,22,0.84))]"
            right={<ListenButton text={response.versiculos.join(". ")} size="sm" />}
          >
            <div className="space-y-3">
              {response.versiculos.map((v, i) => (
                <div
                  key={i}
                  className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-blue-300/12 bg-blue-400/10 text-blue-200">
                      <Quote size={12} strokeWidth={1.8} />
                    </div>

                    <p className="border-l-2 border-blue-300/25 pl-3 text-[13px] italic leading-6 text-foreground/84">
                      {v}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>
        </div>
      </motion.div>

      {/* Oração */}
      <motion.div
        variants={itemVariants}
        transition={sectionTransition(0.48)}
        className="flex justify-start"
      >
        <div className="max-w-[93%]">
          <SectionBlock
            icon={<HandHelping size={13} strokeWidth={1.75} />}
            label="Oração"
            accent="text-gold-light"
            className="border-gold/10 bg-[linear-gradient(180deg,rgba(255,215,102,0.08),rgba(255,255,255,0.03))]"
            right={<ListenButton text={response.oracao} size="sm" />}
          >
            <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3.5">
              <p className="text-[13.5px] italic leading-6 text-foreground/74">
                {response.oracao}
              </p>
            </div>
          </SectionBlock>
        </div>
      </motion.div>

      {/* Follow-up */}
      <motion.div
        variants={itemVariants}
        transition={sectionTransition(0.56)}
        className="flex justify-start"
      >
        <div className="max-w-[91%]">
          <AssistantCard className="rounded-tl-sm border-blue-300/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]">
            <div className="px-4 py-3.5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-blue-300/15 bg-blue-400/10 text-blue-calm">
                  <MessageCircle size={13} strokeWidth={1.75} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-100/54">
                    Próximo passo
                  </p>
                  <p className="text-[13.5px] leading-6 text-foreground/82">
                    {response.followUp}
                  </p>
                </div>
              </div>
            </div>
          </AssistantCard>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResponseView;