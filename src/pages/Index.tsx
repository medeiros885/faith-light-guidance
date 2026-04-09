import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, MessageSquare, Send, ChevronLeft, Sparkles, Search, Settings2, Check, X, Type, Heart, Trash2, Share2 } from "lucide-react"; 
import { generateAIResponse } from "../services/groqApi"; 
import WelcomeScreen from "../components/WelcomeScreen";
import TypingIndicator from "../components/TypingIndicator";

interface BibliaJSON { abbrev: string; chapters: string[][]; name: string; }
interface Favorite { id: string; book: string; chapter: number; verse: number; text: string; version: string; }

const VERSOES = [
  { id: "acf", nome: "Almeida Corrigida Fiel" },
  { id: "nvi", nome: "Nova Versão Internacional" },
  { id: "aa", nome: "Almeida Atualizada" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<"chat" | "biblia" | "home">("home");
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [isSerif, setIsSerif] = useState(false);
  const [version, setVersion] = useState("acf"); 
  const [fullBiblia, setFullBiblia] = useState<BibliaJSON[]>([]);
  const [bibliaView, setBibliaView] = useState<"livros" | "capitulos" | "versiculos" | "favoritos">("livros");
  const [selectedBook, setSelectedBook] = useState<BibliaJSON | null>(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingBiblia, setLoadingBiblia] = useState(false);
  const [showVersionMenu, setShowVersionMenu] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedFavs = localStorage.getItem("caminho_vivo_favs");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const loadBiblia = async () => {
      setLoadingBiblia(true);
      try {
        const res = await fetch(`https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/${version}.json`);
        const data = await res.json();
        setFullBiblia(data);
      } catch (e) { console.error(e); } finally { setLoadingBiblia(false); }
    };
    loadBiblia();
  }, [version]);

  useEffect(() => {
    localStorage.setItem("caminho_vivo_favs", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading, isChatActive]);

  const handleShare = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Caminho Vivo',
          text: `"${text}" - ${title} (Via App Caminho Vivo) 📖✨`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Erro ao compartilhar");
      }
    } else {
      alert("Seu navegador não suporta compartilhamento direto. Copie o texto manualmente.");
    }
  };

  const toggleFavorite = (book: string, chapter: number, verse: number, text: string) => {
    const id = `${book}-${chapter}-${verse}-${version}`;
    const exists = favorites.find(f => f.id === id);
    if (exists) setFavorites(favorites.filter(f => f.id !== id));
    else setFavorites([...favorites, { id, book, chapter, verse, text, version }]);
  };

  const handleSendMessage = async (text: string) => {
    const msg = text || inputText;
    if (!msg.trim() || isLoading) return;
    setIsChatActive(true);
    setActiveTab("chat");
    const newUserMsg = { id: Date.now(), text: msg, sender: "user", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const history = updatedMessages.slice(-5).map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));
      const res = await generateAIResponse(history);

      let versiculosFormatados = "";
      if (res.versiculos && res.versiculos.length > 0) {
        versiculosFormatados = res.versiculos.map((v: any) => {
          if (typeof v === 'string') return v; 
          let ref = v.referencia || v.reference || v.livro || "";
          const txt = v.texto || v.text ? ` "${v.texto || v.text}"` : "";
          return ref ? `• ${ref}${txt}` : "";
        }).filter(v => v !== "").join("\n");
      }

      // HACK MÁXIMO: Forçando a quebra de linha real no texto da explicação
      let explicacaoLimpa = res.explicacao ? res.explicacao.replace(/\\n/g, '\n') : "";

      let formatted = "";
      if (res.acolhimento) formatted += `${res.acolhimento}\n\n`;
      if (explicacaoLimpa) formatted += `${explicacaoLimpa}\n\n`;
      if (res.aplicacao) formatted += `💡 APLICAÇÃO:\n${res.aplicacao}\n\n`;
      if (versiculosFormatados) formatted += `📖 VERSÍCULOS:\n${versiculosFormatados}\n\n`;
      if (res.oracao) formatted += `🙏 ORAÇÃO:\n${res.oracao}\n\n`;
      if (res.followUp) formatted += `---\n${res.followUp}`;

      setMessages(prev => [...prev, { id: Date.now() + 1, text: formatted.trim(), sender: "ai", time: "agora" }]);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const filteredLivros = fullBiblia.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {!isChatActive ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full flex flex-col">

            <header className="px-6 pt-12 pb-4 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-[60] border-b border-white/5">
               <div className="flex-1">
                 <h1 className="text-2xl font-black italic tracking-tighter uppercase">CAMINHO <span className="text-[#C4A456]">VIVO</span></h1>
                 <button onClick={() => setShowVersionMenu(!showVersionMenu)} className="flex items-center gap-1.5 text-[9px] text-[#C4A456] uppercase tracking-[0.2em] font-black mt-1 bg-[#C4A456]/10 px-2 py-1 rounded-md">
                   {VERSOES.find(v => v.id === version)?.nome} <Settings2 size={10} />
                 </button>
               </div>

               {activeTab === "biblia" && bibliaView !== "livros" ? (
                 <button onClick={() => setBibliaView(bibliaView === "favoritos" ? "livros" : bibliaView === "versiculos" ? "capitulos" : "livros")} className="p-2.5 bg-white/5 rounded-full text-[#C4A456]">
                   <ChevronLeft size={22} />
                 </button>
               ) : (
                 <div className="flex gap-2">
                   <button onClick={() => setFontSize(prev => Math.min(prev + 2, 24))} className="p-2 bg-white/5 rounded-full text-white/40"><Type size={16} /></button>
                   <button onClick={() => setIsSerif(!isSerif)} className={`p-2 rounded-full border transition-colors ${isSerif ? "border-[#C4A456] text-[#C4A456]" : "border-white/5 text-white/40"}`}>
                      <span className="font-serif font-bold text-xs">Aa</span>
                   </button>
                 </div>
               )}
            </header>

            <AnimatePresence>
              {showVersionMenu && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-24 left-6 right-6 bg-[#161616] border border-white/10 rounded-3xl p-2 z-[70] shadow-2xl">
                  {VERSOES.map((v) => (
                    <button key={v.id} onClick={() => { setVersion(v.id); setShowVersionMenu(false); }} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-bold transition-all ${version === v.id ? "bg-[#C4A456] text-black" : "text-white/40 hover:bg-white/5"}`}>
                      {v.nome} {version === v.id && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <main className="flex-1 overflow-y-auto px-4 pb-60 no-scrollbar">
              {(activeTab === "home" || activeTab === "chat") ? (
                <WelcomeScreen onSelectSuggestion={handleSendMessage} />
              ) : (
                <div className="pt-4">
                  {bibliaView === "livros" && (
                    <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 text-[#C4A456] mb-6 font-bold uppercase text-[10px] tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit active:scale-95 transition-all">
                      <ChevronLeft size={16} /> Voltar para a Home
                    </button>
                  )}

                  {loadingBiblia ? (
                    <div className="flex flex-col items-center justify-center py-24 text-white/10 animate-pulse font-black uppercase tracking-[0.3em] text-[10px]">Lendo os pergaminhos...</div>
                  ) : (
                    <>
                      {bibliaView === "livros" && (
                        <button onClick={() => setBibliaView("favoritos")} className="w-full bg-gradient-to-r from-[#C4A456] to-[#dfc380] p-6 rounded-[32px] mb-6 flex items-center justify-between text-black shadow-xl">
                          <div className="flex items-center gap-4">
                            <div className="bg-black/10 p-3 rounded-2xl"><Heart size={24} fill="currentColor" /></div>
                            <div className="text-left">
                              <h3 className="font-black uppercase tracking-tighter text-lg leading-none">Meu Altar</h3>
                              <p className="text-[10px] font-bold opacity-60 uppercase mt-1 tracking-widest">{favorites.length} guardados</p>
                            </div>
                          </div>
                          <ChevronLeft size={20} className="rotate-180 opacity-40" />
                        </button>
                      )}

                      {bibliaView === "favoritos" && (
                        <div className="space-y-6 pb-20">
                          <h2 className="text-xl font-black text-[#C4A456] mb-8 text-center italic uppercase">Palavras Guardadas</h2>
                          {favorites.map(f => (
                            <div key={f.id} className="bg-[#121212] p-7 rounded-[40px] border border-white/5 shadow-2xl">
                              <p className="text-sm leading-relaxed mb-4 italic">"{f.text}"</p>
                              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#C4A456]">{f.book} {f.chapter}:{f.verse}</span>
                                <div className="flex gap-2">
                                  <button onClick={() => handleShare(`${f.book} ${f.chapter}:${f.verse}`, f.text)} className="p-2 text-white/20"><Share2 size={16} /></button>
                                  <button onClick={() => setFavorites(favorites.filter(fav => fav.id !== f.id))} className="p-2 text-white/20"><Trash2 size={16} /></button>
                                  <button onClick={() => handleSendMessage(`Refletir sobre o meu favorito: ${f.book} ${f.chapter}:${f.verse}`)} className="p-2 text-[#C4A456]"><Sparkles size={16} /></button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {bibliaView === "livros" && (
                        <>
                          <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 flex items-center gap-3 mb-6 mx-2">
                            <Search size={18} className="text-white/20" />
                            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Pesquisar livro..." className="bg-transparent outline-none text-sm w-full text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-3 pb-10">
                            {filteredLivros.map((l) => (
                              <button key={l.abbrev} onClick={() => { setSelectedBook(l); setBibliaView("capitulos"); }} className="bg-[#121212] border border-white/5 p-6 rounded-[32px] text-left active:scale-95 shadow-lg">
                                <h3 className="font-bold text-sm">{l.name}</h3>
                                <p className="text-[9px] text-white/20 uppercase font-black">{l.chapters.length} Caps</p>
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      {bibliaView === "capitulos" && selectedBook && (
                        <div className="grid grid-cols-5 gap-3 p-2">
                          {selectedBook.chapters.map((_, i) => (
                            <button key={i} onClick={() => { setSelectedChapterIndex(i); setBibliaView("versiculos"); }} className="aspect-square bg-[#121212] border border-white/10 rounded-2xl flex items-center justify-center font-black active:bg-[#C4A456] active:text-black shadow-md">
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}

                      {bibliaView === "versiculos" && selectedBook && selectedChapterIndex !== null && (
                        <div className="space-y-6 pb-20">
                          <h2 className="text-xl font-black text-[#C4A456] mb-10 text-center italic">{selectedBook.name} {selectedChapterIndex + 1}</h2>
                          {selectedBook.chapters[selectedChapterIndex].map((texto, idx) => {
                            const isFav = favorites.some(f => f.id === `${selectedBook.name}-${selectedChapterIndex + 1}-${idx + 1}-${version}`);
                            return (
                              <div key={idx} className="bg-[#121212]/60 p-7 rounded-[40px] border border-white/5 shadow-2xl relative">
                                <div className="absolute top-6 right-6 flex gap-1">
                                  <button onClick={() => handleShare(`${selectedBook.name} ${selectedChapterIndex + 1}:${idx + 1}`, texto)} className="p-2 text-white/10"><Share2 size={18} /></button>
                                  <button onClick={() => toggleFavorite(selectedBook.name, selectedChapterIndex + 1, idx + 1, texto)} className="p-2">
                                    <Heart size={18} className={isFav ? "text-[#C4A456]" : "text-white/10"} fill={isFav ? "currentColor" : "none"} />
                                  </button>
                                </div>
                                <p style={{ fontSize: `${fontSize}px` }} className={`leading-relaxed text-white/90 pr-12 ${isSerif ? "font-serif" : "font-sans"}`}>
                                  <span className="text-[#C4A456] font-black mr-3 text-xs italic">{idx + 1}</span>
                                  {texto}
                                </p>
                                <button onClick={() => handleSendMessage(`Refletir sobre ${selectedBook.name} ${selectedChapterIndex + 1}:${idx + 1}: "${texto}"`)} className="mt-8 flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#C4A456] bg-[#C4A456]/10 px-6 py-3.5 rounded-full border border-[#C4A456]/20 shadow-sm">
                                  <Sparkles size={14} /> Refletir com IA
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
              <div className="max-w-md mx-auto flex bg-[#121212]/95 border border-white/10 backdrop-blur-3xl rounded-[32px] p-1.5 shadow-2xl pointer-events-auto">
                <button onClick={() => { setActiveTab("biblia"); setBibliaView("livros"); setIsChatActive(false); }} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[28px] ${activeTab === "biblia" ? "bg-white/5 text-[#C4A456]" : "text-white/20"}`}>
                  <BookOpen size={22} /> <span className="text-[11px] font-black uppercase tracking-[0.2em]">Bíblia</span>
                </button>
                <button onClick={() => { setActiveTab("chat"); setIsChatActive(true); }} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[28px] ${activeTab === "chat" ? "bg-[#C4A456] text-black font-bold" : "text-white/20"}`}>
                  <MessageSquare size={22} /> <span className="text-[11px] font-black uppercase tracking-[0.2em]">Chat</span>
                </button>
              </div>
            </nav>
          </motion.div>
        ) : (
          <motion.div key="chat" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 flex flex-col bg-[#0b0b0b] z-[100]">

            <header className="px-4 pt-12 pb-4 border-b border-white/5 flex items-center bg-black/80 backdrop-blur-xl">
              <button onClick={() => { setIsChatActive(false); setActiveTab("home"); }} className="p-2 text-[#C4A456]"><ChevronLeft size={28} /></button>
              <h2 className="ml-2 font-bold text-sm uppercase italic">Caminho Vivo <span className="text-[#C4A456] ml-1 animate-pulse">●</span></h2>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 no-scrollbar text-white">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-5 py-4 rounded-[26px] whitespace-pre-wrap text-sm ${msg.sender === "user" ? "bg-[#C4A456] text-black font-medium" : "bg-[#1a1a1a] border border-white/5 shadow-xl"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && <div className="flex justify-start pl-4"><TypingIndicator /></div>}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-black border-t border-white/5">
              <div className="max-w-2xl mx-auto flex items-center gap-3 bg-[#161616] border border-white/10 rounded-full px-5 py-3 shadow-2xl">
                <input 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage("")} 
                  placeholder="Diga uma palavra de fé..." 
                  className="flex-1 bg-transparent outline-none text-sm text-white" 
                />
                <button 
                  onClick={() => handleSendMessage("")} 
                  disabled={isLoading || !inputText.trim()} 
                  className="p-2.5 rounded-full bg-[#C4A456] text-black active:scale-95 transition-transform"
                >
                  <Send size={18} fill="currentColor" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}