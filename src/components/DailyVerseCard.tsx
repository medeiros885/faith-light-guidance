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
  { ref: "Provérbios 3:5-6", text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas." },
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="relative w-full overflow-hidden rounded-2xl border border-border/30 bg-navy-deep p-6"
      style={{
        boxShadow: "0 0 40px hsl(214 55% 58% / 0.08), 0 4px 24px hsl(209 55% 5% / 0.4)",
      }}
    >
      {/* Subtle glow effect */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[hsl(var(--blue-calm)/0.06)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-[hsl(var(--gold)/0.04)] blur-2xl" />

      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        <div className="flex items-center gap-2 text-gold-light">
          <BookOpen size={14} strokeWidth={1.8} />
          <span className="text-[10px] font-semibold uppercase tracking-widest">
            Versículo do dia
          </span>
        </div>

        <p className="font-display text-base leading-relaxed text-foreground/85 italic">
          "{verse.text}"
        </p>

        <span className="text-xs font-medium text-gold/70">{verse.ref}</span>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onReflect(`Refletir sobre ${verse.ref}: "${verse.text}"`)}
          className="mt-1 flex items-center gap-2 rounded-full bg-[hsl(var(--blue-soft)/0.12)] px-5 py-2.5 text-xs font-medium text-blue-calm transition-all duration-300 hover:bg-[hsl(var(--blue-soft)/0.18)]"
        >
          <Sparkles size={13} />
          Refletir mais
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DailyVerseCard;
