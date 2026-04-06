import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SendHorizonal, Mic } from "lucide-react";

export default function ChatInput({ onSend, disabled }: { onSend: (m: string) => void, disabled?: boolean }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
      <div className="max-w-2xl mx-auto relative">
        <div className="relative flex items-end gap-2 p-2 rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-2xl focus-within:border-gold/30 transition-all">
          <button className="p-3 text-white/20"><Mic size={20} /></button>
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Como posso te guiar hoje?..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white py-3 resize-none"
          />
          <button onClick={handleSubmit} className={`p-3 rounded-xl ${message.trim() ? 'bg-gold text-black' : 'bg-white/5 text-white/10'}`}>
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
