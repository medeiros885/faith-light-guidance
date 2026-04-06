import { motion } from "framer-motion";

const FloatingBackground = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(222_55%_6%)_0%,hsl(228_52%_8%)_16%,hsl(234_46%_10%)_38%,hsl(242_40%_9%)_66%,hsl(226_50%_7%)_100%)]" />

      {/* Global cinematic light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.05),transparent_42%)]" />

      {/* Main central aura */}
      <motion.div
        animate={{
          opacity: [0.26, 0.4, 0.26],
          scale: [1, 1.08, 1],
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-[-180px] h-[760px] w-[760px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(96,165,250,0.16) 0%, rgba(59,130,246,0.10) 26%, rgba(37,99,235,0.045) 46%, transparent 74%)",
        }}
      />

      {/* Upper subtle halo */}
      <motion.div
        animate={{
          opacity: [0.08, 0.16, 0.08],
          scale: [1, 1.04, 1],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 top-[-40px] h-[340px] w-[520px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 72%)",
        }}
      />

      {/* Right bloom */}
      <motion.div
        animate={{
          opacity: [0.1, 0.22, 0.1],
          x: [0, -16, 0],
          y: [0, 12, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-12%] top-[22%] h-[480px] w-[480px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.05) 40%, transparent 74%)",
        }}
      />

      {/* Left ice glow */}
      <motion.div
        animate={{
          opacity: [0.08, 0.16, 0.08],
          x: [0, 12, 0],
          y: [0, -14, 0],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-10%] top-[16%] h-[400px] w-[400px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(125,211,252,0.08) 0%, transparent 72%)",
        }}
      />

      {/* Bottom gold signature */}
      <motion.div
        animate={{
          opacity: [0.08, 0.18, 0.08],
          scale: [1, 1.06, 1],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-16%] left-1/2 h-[460px] w-[680px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,215,102,0.10) 0%, rgba(255,215,102,0.035) 34%, transparent 76%)",
        }}
      />

      {/* Luxury violet haze */}
      <motion.div
        animate={{
          opacity: [0.06, 0.14, 0.06],
          x: [0, 12, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-8%] left-[-6%] h-[340px] w-[340px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 74%)",
        }}
      />

      {/* Secondary bottom-right depth */}
      <motion.div
        animate={{
          opacity: [0.05, 0.12, 0.05],
          x: [0, -10, 0],
          y: [0, 8, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[6%] right-[-4%] h-[280px] w-[280px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 72%)",
        }}
      />

      {/* Premium sheen */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(105deg,transparent_0%,transparent_36%,rgba(255,255,255,0.06)_50%,transparent_64%,transparent_100%)]" />

      {/* Ambient floating blobs */}
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[16%] h-40 w-40 rounded-full blur-3xl"
        style={{ background: "rgba(96,165,250,0.05)" }}
      />

      <motion.div
        animate={{ y: [0, 16, 0], x: [0, -14, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[6%] top-[54%] h-52 w-52 rounded-full blur-3xl"
        style={{ background: "rgba(59,130,246,0.045)" }}
      />

      <motion.div
        animate={{ y: [0, 12, 0], x: [0, 8, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[14%] left-[18%] h-36 w-36 rounded-full blur-3xl"
        style={{ background: "rgba(255,215,102,0.035)" }}
      />

      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 6, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[56%] top-[66%] h-28 w-28 rounded-full blur-3xl"
        style={{ background: "rgba(255,255,255,0.025)" }}
      />

      {/* Fine cinematic particles */}
      <motion.div
        animate={{ opacity: [0.14, 0.3, 0.14], y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[18%] top-[22%] h-1.5 w-1.5 rounded-full bg-blue-100/30 blur-[1px]"
      />
      <motion.div
        animate={{ opacity: [0.12, 0.22, 0.12], y: [0, -10, 0] }}
        transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[20%] top-[30%] h-1 w-1 rounded-full bg-white/25 blur-[1px]"
      />
      <motion.div
        animate={{ opacity: [0.08, 0.18, 0.08], y: [0, -7, 0] }}
        transition={{ duration: 8.1, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[66%] top-[58%] h-1 w-1 rounded-full bg-blue-200/25 blur-[1px]"
      />
      <motion.div
        animate={{ opacity: [0.08, 0.22, 0.08], y: [0, -8, 0] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[38%] top-[72%] h-1.5 w-1.5 rounded-full bg-yellow-200/20 blur-[1px]"
      />
      <motion.div
        animate={{ opacity: [0.06, 0.18, 0.06], y: [0, -6, 0] }}
        transition={{ duration: 9.3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[34%] top-[18%] h-1 w-1 rounded-full bg-white/20 blur-[1px]"
      />

      {/* Bottom depth shadow */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.18)_100%)]" />
    </div>
  );
};

export default FloatingBackground;