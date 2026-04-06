import { motion } from "framer-motion";
import { Sparkles, BookOpen, Heart, ArrowRight } from "lucide-react";

interface FollowUpButtonsProps {
  onAction: (text: string) => void;
}

const followUps = [
  {
    text: "Quero entender mais",
    icon: <Sparkles size={12} />,
    glow: "from-blue-400/20 to-cyan-300/5",
  },
  {
    text: "Me dá outro versículo",
    icon: <BookOpen size={12} />,
    glow: "from-indigo-400/20 to-blue-300/5",
  },
  {
    text: "Pode orar por mim?",
    icon: <Heart size={12} />,
    glow: "from-pink-400/20 to-rose-300/5",
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
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const FollowUpButtons = ({ onAction }: FollowUpButtonsProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-4 space-y-2.5 pl-1"
    >
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/40">
          Próximos caminhos
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {followUps.map((itemData) => (
          <motion.button
            key={itemData.text}
            variants={item}
            whileTap={{ scale: 0.94 }}
            whileHover={{ y: -1, scale: 1.02 }}
            onClick={() => onAction(itemData.text)}
            className="group relative overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-2.5 text-[11px] font-medium text-foreground/74 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
          >
            <div
              className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r ${itemData.glow}`}
            />

            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_38%)]" />

            <span className="relative flex items-center gap-1.5">
              <span className="text-blue-calm/72 transition group-hover:text-blue-calm">
                {itemData.icon}
              </span>

              <span>{itemData.text}</span>

              <ArrowRight
                size={11}
                className="ml-0.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default FollowUpButtons;