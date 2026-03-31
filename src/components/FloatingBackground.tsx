import { motion } from "framer-motion";

const FloatingBackground = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    {/* Layered radial gradients */}
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(209_55%_11%)] via-[hsl(210_42%_14%)] to-[hsl(209_48%_10%)]" />

    {/* Soft radial light top */}
    <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(213_55%_60%/0.04)_0%,transparent_70%)]" />

    {/* Floating blurred shapes */}
    <motion.div
      animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[20%] left-[10%] h-40 w-40 rounded-full bg-[hsl(213_70%_59%/0.025)] blur-3xl"
    />
    <motion.div
      animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[50%] right-[5%] h-52 w-52 rounded-full bg-[hsl(43_55%_52%/0.02)] blur-3xl"
    />
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[15%] left-[20%] h-36 w-36 rounded-full bg-[hsl(213_55%_60%/0.02)] blur-3xl"
    />

    {/* Bottom warm glow */}
    <div className="absolute bottom-0 left-0 right-0 h-48 bg-[radial-gradient(ellipse_at_bottom,hsl(43_55%_52%/0.015)_0%,transparent_70%)]" />
  </div>
);

export default FloatingBackground;
