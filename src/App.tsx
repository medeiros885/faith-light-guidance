import { StrictMode, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Interface para estender o Window com o evento do PWA
declare global {
  interface WindowEventMap {
    beforeinstallprompt: any;
  }
}

function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  // Lógica para capturar o evento de instalação no Android (PWA)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Impede o mini-infobar padrão do Chrome de aparecer
      e.preventDefault();
      // Salva o evento globalmente para usarmos no botão da Home depois
      (window as any).deferredPrompt = e;
      console.log("✅ PWA: Prompt de instalação capturado e pronto.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={120}>
        {children}

        <Toaster />

        <Sonner
          position="bottom-center" // No mobile, embaixo é mais fácil de alcançar
          richColors
          closeButton
          duration={3500}
          visibleToasts={2}
          toastOptions={{
            classNames: {
              toast:
                "border border-white/10 bg-background/95 text-white shadow-2xl backdrop-blur-xl rounded-[20px]",
              title: "text-sm font-bold text-gold",
              description: "text-xs text-white/70 font-medium",
              actionButton: "bg-gold text-black hover:scale-105 transition-transform font-bold",
              closeButton: "bg-white/10 text-white/50 hover:text-white",
            },
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <StrictMode>
      <AppProviders>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </StrictMode>
  );
};

export default App;