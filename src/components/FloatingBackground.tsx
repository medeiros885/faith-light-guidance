import { motion } from "framer-motion";

const FloatingBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    {/* Deep cosmic gradient layers */}
    <div className="absolute inset-0" style={{
      background: "linear-gradient(180deg, hsl(230 45% 8%) 0%, hsl(255 35% 10%) 35%, hsl(260 30% 13%) 65%, hsl(245 40% 9%) 100%)"
    }} />

    {/* Radial purple glow top */}
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full"
      style={{ background: "radial-gradient(circle, hsl(263 55% 55% / 0.05) 0%, transparent 70%)" }} />

    {/* Radial gold warmth bottom */}
    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-[400px] w-[500px] rounded-full"
      style={{ background: "radial-gradient(ellipse at bottom, hsl(43 55% 52% / 0.02) 0%, transparent 70%)" }} />

    {/* Floating organic shapes */}
    <motion.div
      animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[18%] left-[8%] h-44 w-44 rounded-full blur-3xl"
      style={{ background: "hsl(263 70% 58% / 0.03)" }}
    />
    <motion.div
      animate={{ y: [0, 14, 0], x: [0, -8, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[48%] right-[4%] h-56 w-56 rounded-full blur-3xl"
      style={{ background: "hsl(280 50% 50% / 0.025)" }}
    />
    <motion.div
      animate={{ y: [0, 12, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[12%] left-[18%] h-40 w-40 rounded-full blur-3xl"
      style={{ background: "hsl(263 55% 60% / 0.025)" }}
    />
    <motion.div
      animate={{ y: [0, -8, 0], x: [0, 6, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[65%] left-[55%] h-32 w-32 rounded-full blur-3xl"
      style={{ background: "hsl(43 55% 52% / 0.015)" }}
    />
  </div>
);

export default FloatingBackground;
