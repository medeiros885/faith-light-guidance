import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Função para registrar o Service Worker (PWA)
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker instalando...");
      } else if (registration.waiting) {
        console.log("Service worker instalado!");
      } else if (registration.active) {
        console.log("Service worker ativo!");
      }
    } catch (error) {
      console.error(`Falha no registro do Service Worker: ${error}`);
    }
  }
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element não encontrado");
}

// Inicializa o React
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Chama o registro do Service Worker
registerServiceWorker();
