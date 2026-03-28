import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

interface DailyVerseCardProps {
  onReflect: (verse: string) => void;
}

const dailyVerses = [
  { ref: "Salmos 23:1", text: "O Senhor é o meu pastor; nada me faltará." },
  { ref: "Jeremias 29:11", text: "Porque eu bem sei os planos que tenho para vocês, diz o Senhor, planos de paz e não de mal, para dar-lhes um futuro e uma esperança." },
  { ref: "Isaías 41:10", text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus." },
  { ref: "Filipenses 4:13", text: "Tudo posso naquele que me fortalece." },
  { ref: "Provérbios 3:5-6", text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento." },
  { ref: "Romanos 8:28", text: "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus." },
  { ref: "Mateus 11:28", text: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei." },
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
      transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
      className="relative w-full overflow-hidden rounded-2xl verse-card p-6"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[hsl(var(--blue-calm)/0.05)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-[hsl(var(--gold)/0.03)] blur-2xl" />

      <div className="relative z-10 flex flex-col items-center text-center gap-3.5">
        <div className="flex items-center gap-2 text-gold-light">
          <BookOpen size={13} strokeWidth={1.6} />
          <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">Versículo do dia</span>
        </div>

        <p className="font-display text-[15px] leading-[1.7] text-foreground/80 italic px-2">
          "{verse.text}"
        </p>

        <span className="text-[11px] font-medium text-gold/55">{verse.ref}</span>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onReflect(`Refletir sobre ${verse.ref}: "${verse.text}"`)}
          className="mt-0.5 flex items-center gap-1.5 rounded-full bg-[hsl(var(--blue-soft)/0.1)] px-4 py-2 text-[11px] font-medium text-blue-calm transition-all duration-300 hover:bg-[hsl(var(--blue-soft)/0.15)]"
        >
          <Sparkles size={12} />
          Refletir mais
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DailyVerseCard;
