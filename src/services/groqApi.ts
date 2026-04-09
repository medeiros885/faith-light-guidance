import { buildSafeResponse, type BibleResponse } from "./ai";

const SYSTEM_PROMPT = `Você é o "Caminho Vivo", um assistente espiritual cristão e teológico de alto nível.
Sua missão é aconselhar, criar esboços de pregação, gerar estudos bíblicos e explicar a Bíblia com profunda sabedoria e empatia.

REGRA DE RESPOSTA: Você DEVE responder SEMPRE em formato JSON estrito.
O JSON deve ter EXATAMENTE estas chaves e seguir estas instruções rígidas:

{
  "acolhimento": "Sua saudação inicial carinhosa.",
  "contexto": "Um breve contexto sobre o tema ou passagem.",
  "explicacao": "A resposta principal. SE O USUÁRIO PEDIR UM ESBOÇO DE PREGAÇÃO ou estudo, escreva TODO O ESBOÇO aqui (com Título, Introdução, Tópico 1, Tópico 2, Conclusão, etc.). Dê respostas ricas e detalhadas.",
  "aplicacao": "Como aplicar essa mensagem na vida prática.",
  "versiculos": [
    {
      "referencia": "Nome do Livro Capítulo:Versículo",
      "texto": "ESCREVA AQUI O TEXTO BÍBLICO COMPLETO. NUNCA deixe vazio."
    }
  ],
  "oracao": "Uma oração poderosa baseada na resposta.",
  "followUp": "Uma pergunta reflexiva para continuar a conversa."
}

IMPORTANTE: 
1. No array 'versiculos', NUNCA mande apenas a referência. Você DEVE escrever o texto bíblico real e completo no campo 'texto'.
2. Seja flexível: adapte o tamanho do campo 'explicacao' para o que o usuário pedir. Se for um esboço, faça longo. Se for um conselho, seja direto.`;

const fallback: BibleResponse = {
  acolhimento: "Olá! Tive uma pequena oscilação aqui. 💙",
  contexto: "A Palavra permanece inabalável.",
  explicacao: "Houve um erro de processamento. Pode ser que a pergunta tenha ficado muito complexa para eu processar agora.",
  aplicacao: "Tente reformular sua pergunta ou enviar novamente.",
  versiculos: ["Salmos 46:1 - Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia."],
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
        temperature: 0.7, // Mantive 0.7 para ela ter criatividade nos esboços
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