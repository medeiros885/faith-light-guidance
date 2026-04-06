import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass, Sparkles, Home } from "lucide-react";
import FloatingBackground from "@/components/FloatingBackground";
import bibleLogo from "@/assets/bible-logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <FloatingBackground />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.03))] px-6 py-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,215,102,0.07),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[34px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />

          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/10 bg-gold/8 shadow-[0_0_26px_rgba(255,215,102,0.06)]">
                <img
                  src={bibleLogo}
                  alt="Caminho Vivo"
                  className="h-8 w-8 opacity-95"
                />
              </div>
            </div>

            <div className="mb-3 flex items-center justify-center gap-2">
              <Sparkles size={13} className="text-blue-200/80" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-100/50">
                Caminho Vivo
              </span>
            </div>

            <h1 className="font-display text-[56px] font-semibold leading-none text-foreground/95">
              404
            </h1>

            <p className="mt-4 text-[19px] font-medium text-foreground/88">
              Esse caminho não foi encontrado
            </p>

            <p className="mx-auto mt-2 max-w-[290px] text-[13px] leading-6 text-muted-foreground/56">
              Parece que essa página não existe, foi movida ou o endereço foi digitado
              de forma incorreta.
            </p>

            <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/12 bg-blue-400/10 text-blue-200">
                  <Compass size={16} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/46">
                    Rota acessada
                  </p>
                  <p className="mt-1 break-all text-[13px] leading-6 text-foreground/78">
                    {location.pathname}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-300/10 bg-[linear-gradient(145deg,rgba(96,165,250,0.14),rgba(96,165,250,0.06))] px-5 py-3 text-sm font-medium text-blue-calm transition-all duration-250 hover:border-blue-300/18 hover:bg-[linear-gradient(145deg,rgba(96,165,250,0.18),rgba(96,165,250,0.08))]"
              >
                <Home size={16} />
                Ir para o início
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground/74 transition-all duration-250 hover:border-white/16 hover:bg-white/[0.05] hover:text-foreground"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;