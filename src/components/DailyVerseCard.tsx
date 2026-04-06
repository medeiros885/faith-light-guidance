import { motion } from "framer-motion";
import { BookOpen, Sparkles, Quote, ArrowRight, Star } from "lucide-react";
import { useMemo } from "react";

interface DailyVerseCardProps {
  onReflect: (verse: string) => void;
}

const dailyVerses = [
  { ref: "Salmos 23:1", text: "O Senhor é o meu pastor; nada me faltará." },
  { ref: "Jeremias 29:11", text: "Porque eu bem sei os planos que tenho para vocês, diz o Senhor..." },
  { ref: "Isaías 41:10", text: "Não temas, porque eu sou contigo; não te assombres..." },
  { ref: "Filipenses 4:13", text: "Tudo posso naquele que me fortalece." },
  { ref: "Provérbios 3:5-6", text: "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento." },
  { ref: "Romanos 8:28", text: "Todas as coisas cooperam para o bem daqueles que amam a Deus." },
  { ref: "Mateus 11:28", text: "Vinde a mim todos os que estais cansados e sobrecarregados..." },
];

const DailyVerseCard = ({ onReflect }: DailyVerseCardProps) => {
  const verse = useMemo(() => {
    const dayOfYear = Math.floor(new Date().getTime() / 86400000);
    return dailyVerses[dayOfYear % dailyVerses.length];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl"
    >
      {/* EFEITOS DE FUNDO (Glow & Mesh) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(217,167,74,0.1),transparent_50%)]" />
      </div>

      {/* AURA ANIMADA CENTRAL */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-blue-500/20 blur-[60px]"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">

        {/* BADGE SUPERIOR */}
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10">
          <Star size={10} className="text-gold fill-gold" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-light/80">
            Inspiração Diária
          </span>
        </div>

        {/* CITAÇÃO */}
        <div className="space-y-4">
          <Quote size={24} className="mx-auto text-blue-400/40" />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-xl md:text-2xl leading-relaxed text-white/90 italic px-2"
          >
            “{verse.text}”
          </motion.p>

          <div className="inline-block px-4 py-1 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs font-bold text-gold/60 tracking-widest uppercase">
              {verse.ref}
            </p>
          </div>
        </div>

        {/* BOTÃO DE AÇÃO */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onReflect(`Gostaria de meditar e entender melhor o versículo de hoje: ${verse.ref} - "${verse.text}"`)}
          className="group relative w-full flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gold p-4 text-sm font-bold text-black shadow-xl shadow-gold/20 transition-all"
        >
          {/* Efeito de brilho passando pelo botão */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 skew-x-12"
          />

          <Sparkles size={18} className="animate-pulse" />
          <span>Meditar com o Conselheiro</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <p className="text-[10px] text-white/20 font-medium uppercase tracking-tighter">
          Toque para receber uma direção profética
        </p>
      </div>
    </motion.div>
  );
};

export default DailyVerseCard;
