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

    // MONTAGEM DINÂMICA (Só mostra o que a IA decidir enviar)
    let formatted = "";
    if (res.acolhimento) formatted += `${res.acolhimento}\n\n`;
    if (res.explicacao) formatted += `${res.explicacao}\n\n`;
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