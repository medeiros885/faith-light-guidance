import { buildSafeResponse, type BibleResponse } from "./ai";

const SYSTEM_PROMPT = `Você é o "Caminho Vivo", um assistente espiritual cristão.
Sua missão é dar continuidade à conversa de forma profunda e bíblica.

REGRA DE RESPOSTA: Você DEVE responder SEMPRE em formato JSON.
O JSON deve ter exatamente estas chaves: acolhimento, contexto, explicacao, aplicacao, versiculos (array), oracao, followUp.

DICA: Se o usuário pedir para "explicar melhor", mergulhe mais fundo no texto bíblico citado anteriormente.`;

const fallback: BibleResponse = {
  acolhimento: "Olá! Tive uma pequena oscilação aqui. 💙",
  contexto: "A Palavra permanece inabalável.",
  explicacao: "Houve um erro de processamento. Pode ser que a pergunta anterior tenha ficado muito complexa para eu processar em JSON agora.",
  aplicacao: "Tente reformular sua pergunta ou enviar novamente.",
  versiculos: ["Salmos 46:1"],
  oracao: "Senhor, nos dê clareza. Amém.",
  followUp: "Quer tentar de novo?",
};

export async function generateAIResponse(history: { role: string, content: string }[]): Promise<BibleResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return fallback;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${apiKey}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history
        ],
        response_format: { type: "json_object" },
        temperature: 0.7, // Um pouco mais de criatividade para explicações
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("❌ ERRO GROQ:", errorDetail);
      return fallback;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Tenta parsear o JSON, se falhar, o catch assume
    return buildSafeResponse(JSON.parse(content), fallback);
  } catch (e) {
    console.error("❌ ERRO NO PARSE OU FETCH:", e);
    return fallback;
  }
}
