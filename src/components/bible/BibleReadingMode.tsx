import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Type } from "lucide-react";
import type { BibleBook, BibleChapter } from "@/data/bible/types";

interface BibleReadingModeProps {
  book: BibleBook;
  chapter: BibleChapter;
  onClose: () => void;
}

const BibleReadingMode = ({ book, chapter, onClose }: BibleReadingModeProps) => {
  const [fontSize, setFontSize] = useState(17);
  const [showControls, setShowControls] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-background/90 backdrop-blur-xl border-b border-border/15"
          >
            <span className="font-display text-sm font-semibold text-gold/80">
              {book.name} {chapter.number}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-secondary/40 px-2.5 py-1">
                <button
                  onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                  className="p-1 text-muted-foreground/50 hover:text-foreground/70 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <Type size={14} className="text-muted-foreground/40" />
                <button
                  onClick={() => setFontSize((s) => Math.min(28, s + 1))}
                  className="p-1 text-muted-foreground/50 hover:text-foreground/70 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground/50 hover:text-foreground/70 hover:bg-secondary/30 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading content */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth"
        onClick={() => setShowControls((s) => !s)}
      >
        <div className="mx-auto max-w-[560px] px-8 py-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center font-display text-xl font-semibold text-gold/70 mb-8"
          >
            {book.name} {chapter.number}
          </motion.h2>

          <div className="space-y-1">
            {chapter.verses.map((verse, i) => (
              <motion.p
                key={verse.number}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.015, duration: 0.3 }}
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.9" }}
                className="text-foreground/80 leading-relaxed"
              >
                <span
                  className="text-gold/40 font-semibold mr-1.5 align-super"
                  style={{ fontSize: `${Math.max(10, fontSize - 5)}px` }}
                >
                  {verse.number}
                </span>
                {verse.text}{" "}
              </motion.p>
            ))}
          </div>

          <div className="h-20" />
        </div>
      </div>
    </motion.div>
  );
};

export default BibleReadingMode;
