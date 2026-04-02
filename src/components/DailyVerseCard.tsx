import { motion } from "framer-motion";
import { BookOpen, Sparkles, Quote } from "lucide-react";

interface DailyVerseCardProps {
  onReflect: (verse: string) => void;
}

const dailyVerses = [
  { ref: "Salmos 23:1", text: "O Senhor é o meu pastor; nada me faltará." },
  {
    ref: "Jeremias 29:11",
    text: "Porque eu bem sei os planos que tenho para vocês, diz o Senhor, planos de paz e não de mal, para dar-lhes um futuro e uma esperança.",
  },
  {
    ref: "Isaías 41:10",
    text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.",
  },
  { ref: "Filipenses 4:13", text: "Tudo posso naquele que me fortalece." },
  {
    ref: "Provérbios 3:5-6",
    text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.",
  },
  {
    ref: "Romanos 8:28",
    text: "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus.",
  },
  {
    ref: "Mateus 11:28",
    text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
  },
];

function getVerseOfDay() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyVerses[dayOfYear % dailyVerses.length];
}

const DailyVerseCard = ({ onReflect }: DailyVerseCardProps) => {
  const verse = getVerseOfDay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.45, ease: "easeOut" }}
      className="verse-card relative w-full overflow-hidden rounded-[30px] p-6"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[hsl(var(--blue-calm)/0.06)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-[hsl(var(--gold)/0.04)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_32%)]" />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/8 px-3 py-1.5 text-gold-light">
          <BookOpen size={13} strokeWidth={1.7} />
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
            Versículo do dia
          </span>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200">
          <Quote size={16} strokeWidth={1.8} />
        </div>

        <p className="px-2 font-display text-[17px] leading-[1.8] text-foreground/86 italic">
          “{verse.text}”
        </p>

        <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-gold/62">
          {verse.ref}
        </span>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onReflect(`Refletir sobre ${verse.ref}: "${verse.text}"`)}
          className="mt-1 flex items-center gap-2 rounded-full border border-blue-300/10 bg-[linear-gradient(145deg,rgba(96,165,250,0.12),rgba(96,165,250,0.06))] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-calm transition-all duration-200 hover:border-blue-300/16 hover:bg-[linear-gradient(145deg,rgba(96,165,250,0.16),rgba(96,165,250,0.08))]"
        >
          <Sparkles size={12} />
          Refletir mais
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DailyVerseCard;