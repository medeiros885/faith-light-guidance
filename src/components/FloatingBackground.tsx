import { motion } from "framer-motion";

const FloatingBackground = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Base deep luxury background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(220 52% 7%) 0%, hsl(227 50% 9%) 22%, hsl(235 44% 11%) 46%, hsl(245 38% 10%) 68%, hsl(228 48% 8%) 100%)",
        }}
      />

      {/* Soft top cinematic blue bloom */}
      <div
        className="absolute -top-44 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(214 92% 64% / 0.08) 0%, hsl(226 88% 58% / 0.045) 34%, transparent 72%)",
        }}
      />

      {/* Secondary royal-blue depth bloom */}
      <div
        className="absolute top-[22%] right-[-14%] h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(223 88% 56% / 0.06) 0%, transparent 72%)",
        }}
      />

      {/* Lower ambient violet/indigo haze */}
      <div
        className="absolute bottom-[-10%] left-[-8%] h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(248 68% 62% / 0.045) 0%, transparent 74%)",
        }}
      />

      {/* Subtle gold warmth near bottom center */}
      <div
        className="absolute -bottom-24 left-1/2 h-[360px] w-[540px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(43 78% 66% / 0.028) 0%, hsl(43 78% 66% / 0.012) 38%, transparent 76%)",
        }}
      />

      {/* Top-left premium haze */}
      <div
        className="absolute left-[-12%] top-[8%] h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(205 95% 70% / 0.035) 0%, transparent 72%)",
        }}
      />

      {/* Fine glass-like vertical sheen */}
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, transparent 34%, rgba(255,255,255,0.045) 50%, transparent 66%, transparent 100%)",
        }}
      />

      {/* Gentle floating premium blobs */}
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 12, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[6%] top-[16%] h-44 w-44 rounded-full blur-3xl"
        style={{
          background: "hsl(214 92% 64% / 0.038)",
        }}
      />

      <motion.div
        animate={{ y: [0, 18, 0], x: [0, -10, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[2%] top-[42%] h-60 w-60 rounded-full blur-3xl"
        style={{
          background: "hsl(228 88% 58% / 0.03)",
        }}
      />

      <motion.div
        animate={{ y: [0, 14, 0], x: [0, 8, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] left-[16%] h-44 w-44 rounded-full blur-3xl"
        style={{
          background: "hsl(246 70% 64% / 0.03)",
        }}
      />

      <motion.div
        animate={{ y: [0, -10, 0], x: [0, 6, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[56%] top-[64%] h-32 w-32 rounded-full blur-3xl"
        style={{
          background: "hsl(43 78% 66% / 0.016)",
        }}
      />

      {/* Tiny distant light accents */}
      <motion.div
        animate={{ opacity: [0.18, 0.34, 0.18] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[18%] top-[22%] h-1.5 w-1.5 rounded-full bg-blue-200/30 blur-[1px]"
      />
      <motion.div
        animate={{ opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[20%] top-[30%] h-1 w-1 rounded-full bg-white/25 blur-[1px]"
      />
      <motion.div
        animate={{ opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[68%] top-[58%] h-1 w-1 rounded-full bg-blue-100/25 blur-[1px]"
      />
    </div>
  );
};

export default FloatingBackground;