import { motion } from "framer-motion";

interface FollowUpButtonsProps {
  onAction: (text: string) => void;
}

const followUps = [
  "Quero entender mais",
  "Me dá outro versículo",
  "Pode orar por mim?",
];

const FollowUpButtons = ({ onAction }: FollowUpButtonsProps) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.1, duration: 0.35 }}
    className="flex flex-wrap gap-2 pl-2"
  >
    {followUps.map((text) => (
      <motion.button
        key={text}
        whileTap={{ scale: 0.95 }}
        onClick={() => onAction(text)}
        className="rounded-full border border-border/25 bg-secondary/30 px-3.5 py-1.5 text-[11px] font-medium text-foreground/60 transition-all duration-200 hover:bg-secondary/50 hover:text-foreground/80"
      >
        {text}
      </motion.button>
    ))}
  </motion.div>
);

export default FollowUpButtons;
