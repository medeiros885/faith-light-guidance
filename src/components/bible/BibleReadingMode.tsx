import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Type,
  BookOpenText,
  Sparkles,
  Eye,
} from "lucide-react";
import type { BibleBook, BibleChapter } from "@/data/bible/types";

interface BibleReadingModeProps {
  book: BibleBook;
  chapter: BibleChapter;
  onClose: () => void;
}

const BibleReadingMode = ({
  book,
  chapter,
  onClose,
}: BibleReadingModeProps) => {
  const [fontSize, setFontSize] = useState(18);
  const [showControls, setShowControls] = useState(true);

  const decreaseFont = () => setFontSize((s) => Math.max(14, s - 1));
  const increaseFont = () => setFontSize((s) => Math.min(30, s + 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[linear-gradient(180deg,rgba(3,8,18,0.995),rgba(6,18,34,0.995),rgba(4,10,20,1))]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(circle,rgba(96,165,250,0.085)_0%,transparent_72%)]" />
        <div className="absolute bottom-[-8%] left-[10%] h-[360px] w-[360px] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(255,215,102,0.03)_0%,transparent_74%)]" />
        <div className="absolute top-[30%] right-[-8%] h-[320px] w-[320px] rounded-full blur-3xl bg-[radial-gradient(circle,rgba(120,119,198,0.045)_0%,transparent_74%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(105deg,transparent_0%,transparent_34%,rgba(255,255,255,0.04)_50%,transparent_66%,transparent_100%)]" />
      </div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.22 }}
            className="sticky top-0 z-20 border-b border-border/12 bg-background/66 backdrop-blur-2xl"
          >
            <div className="mx-auto flex max-w-[760px] items-center justify-between gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/10 bg-blue-400/10 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.10)]">
                    <BookOpenText size={15} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-gold/82">
                      {book.name} {chapter.number}
                    </p>
                    <p className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground/42">
                      modo leitura imersivo
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl">
                  <button
                    onClick={decreaseFont}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/52 transition-all duration-200 hover:bg-white/[0.04] hover:text-foreground/75"
                    aria-label="Diminuir fonte"
                  >
                    <Minus size={14} />
                  </button>

                  <div className="flex items-center gap-1 rounded-full px-2 py-1">
                    <Type size={13} className="text-blue-calm/75" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/52">
                      {fontSize}px
                    </span>
                  </div>

                  <button
                    onClick={increaseFont}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/52 transition-all duration-200 hover:bg-white/[0.04] hover:text-foreground/75"
                    aria-label="Aumentar fonte"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-muted-foreground/55 transition-all duration-200 hover:border-white/12 hover:bg-white/[0.06] hover:text-foreground/78"
                  aria-label="Fechar modo leitura"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative z-[1] flex-1 overflow-y-auto scroll-smooth"
        onClick={() => setShowControls((s) => !s)}
      >
        <div className="mx-auto max-w-[760px] px-6 py-10 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/10 bg-blue-400/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/62">
              <Sparkles size={11} strokeWidth={1.8} />
              leitura contemplativa
            </div>

            <h2 className="font-display text-[30px] font-semibold text-foreground/94">
              {book.name}
            </h2>

            <p className="mt-2 text-[12px] uppercase tracking-[0.24em] text-gold/58">
              capítulo {chapter.number}
            </p>
          </motion.div>

          <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] px-5 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:px-7 sm:py-7">
            <div className="space-y-2">
              {chapter.verses.map((verse, i) => (
                <motion.div
                  key={verse.number}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.012, 0.45), duration: 0.28 }}
                  className="rounded-[18px] px-1 py-1"
                >
                  <p
                    style={{ fontSize: `${fontSize}px`, lineHeight: 2 }}
                    className="text-foreground/84"
                  >
                    <span
                      className="mr-2 align-super font-semibold text-gold/48"
                      style={{ fontSize: `${Math.max(10, fontSize - 6)}px` }}
                    >
                      {verse.number}
                    </span>
                    {verse.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="h-24" />
        </div>
      </div>

      <AnimatePresence>
        {!showControls && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/40 backdrop-blur-xl">
              <Eye size={11} />
              toque na tela para mostrar controles
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BibleReadingMode;