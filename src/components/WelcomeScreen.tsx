import { motion } from "framer-motion";
import { Sun, Moon, Sunrise, Sparkles, Heart, CloudRain, Zap, Smile, Star } from "lucide-react";
import { useState, useEffect } from "react";

interface WelcomeScreenProps {
  onSelectSuggestion: (text: string) => void;
}

const VERSICULOS_DIA = [
  { ref: "Filipenses 4:13", texto: "Tudo posso naquele que me fortalece." },
  { ref: "Salmos 23:1", texto: "O Senhor é o meu pastor; nada me faltará." },
  { ref: "Josué 1:9", texto: "Não to mandei eu? Esforça-te, e tem bom ânimo." },
  { ref: "Mateus 11:28", texto: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." },
  { ref: "João 14:27", texto: "Deixo-vos a paz, a minha paz vos dou." },
  { ref: "Isaías 41:10", texto: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus." },
];

export default function WelcomeScreen({ onSelectSuggestion }: WelcomeScreenProps) {
  const [saudacao, setSaudacao] = useState("");
  const [versiculo, setVersiculo] = useState(VERSICULOS_DIA[0]);

  useEffect(() => {
    // Lógica para pegar a hora exata de Brasília (America/Sao_Paulo)
    const agora = new Date();
    const horaBrasilia = parseInt(new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: 'numeric',
      hour12: false
    }).format(agora));

    if (horaBrasilia >= 5 && horaBrasilia < 12) setSaudacao("Bom dia");
    else if (horaBrasilia >= 12 && horaBrasilia < 18) setSaudacao("Boa tarde");
    else setSaudacao("Boa noite");

    const sorteado = VERSICULOS_DIA[Math.floor(Math.random() * VERSICULOS_DIA.length)];
    setVersiculo(sorteado);
  }, []);

  const sentimentos = [
    { label: "Triste", icon: <CloudRain size={20} />, prompt: "Estou me sentindo triste hoje, o que a Bíblia diz para me consolar?" },
    { label: "Ansioso", icon: <Zap size={20} />, prompt: "Estou muito ansioso com o futuro, preciso de uma palavra de paz." },
    { label: "Cansado", icon: <Sunrise size={20} />, prompt: "Sinto que minhas forças acabaram, me dê um versículo de renovo." },
    { label: "Grato", icon: <Smile size={20} />, prompt: "Hoje meu coração está cheio de gratidão, vamos orar agradecendo?" },
  ];

  return (
    <div className="flex flex-col gap-10 pt-4 pb-20">
      {/* SAUDAÇÃO DINÂMICA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex justify-center mb-4">
          {saudacao === "Bom dia" ? (
            <Sun className="text-[#C4A456] animate-pulse" size={28} />
          ) : (
            <Moon className="text-[#C4A456] animate-pulse" size={28} />
          )}
        </div>
        <h2 className="text-4xl font-serif italic text-white leading-tight">
          {saudacao}, <span className="text-[#C4A456] not-italic font-black uppercase tracking-tighter text-3xl block mt-2 drop-shadow-[0_0_15px_rgba(196,164,86,0.2)]">amado</span>
        </h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold">A graça e a paz sejam contigo</p>
      </motion.div>

      {/* CARD DA PROMESSA DO DIA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#121212] border border-[#C4A456]/20 rounded-[40px] p-8 relative overflow-hidden shadow-2xl mx-2"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Star size={80} className="text-[#C4A456]" />
        </div>

        <p className="text-[#C4A456] text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
          <Heart size={12} fill="currentColor" /> Promessa do Dia
        </p>

        <blockquote className="text-xl font-medium leading-relaxed mb-6 italic text-white/90">
          "{versiculo.texto}"
        </blockquote>

        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-white/30 tracking-widest">{versiculo.ref}</span>
          <button 
            onClick={() => onSelectSuggestion(`Refletir sobre a promessa do dia: ${versiculo.ref} - "${versiculo.texto}"`)}
            className="flex items-center gap-2 bg-[#C4A456] text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
          >
            Refletir <Sparkles size={12} />
          </button>
        </div>
      </motion.div>

      {/* ESTADO DO CORAÇÃO */}
      <div className="space-y-6 px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center italic">Como está seu coração hoje?</h3>
        <div className="grid grid-cols-2 gap-4">
          {sentimentos.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion(s.prompt)}
              className="flex flex-col items-center gap-4 bg-[#121212]/50 border border-white/5 p-6 rounded-[32px] hover:border-[#C4A456]/40 transition-all active:scale-95 group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#C4A456] group-hover:bg-[#C4A456]/10 transition-all shadow-inner">
                {s.icon}
              </div>
              <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
