import { motion } from "framer-motion";
import { Sparkles, BookOpen, Heart } from "lucide-react";

interface FollowUpButtonsProps {
  onAction: (text: string) => void;
}

const followUps = [
  {
    text: "Quero entender mais",
    icon: <Sparkles size={12} />,
  },
  {
    text: "Me dá outro versículo",
    icon: <BookOpen size={12} />,
  },
  {
    text: "Pode orar por mim?",
    icon: <Heart size={12} />,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 6, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const FollowUpButtons = ({ onAction }: FollowUpButtonsProps) => (
  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className="mt-3 space-y-2 pl-1"
  >
    {/* label estilo IA */}
    <div className="flex items-center gap-2 px-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
        Sugestões
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {followUps.map((itemData, i) => (
        <motion.button
          key={itemData.text}
          variants={item}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => onAction(itemData.text)}
          className="group relative overflow-hidden rounded-full border border-white/10 
                     bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] 
                     px-4 py-2 text-[11px] font-medium text-foreground/70 
                     backdrop-blur-xl transition-all duration-300
                     hover:text-foreground hover:border-white/20
                     shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
        >
          {/* glow suave */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 
                          bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.08),transparent_40%)]" />

          <span className="relative flex items-center gap-1.5">
            <span className="text-blue-calm/70 group-hover:text-blue-calm transition">
              {itemData.icon}
            </span>
            {itemData.text}
          </span>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

export default FollowUpButtons;