import { buildSafeResponse, type BibleResponse } from "./ai";

const SYSTEM_PROMPT = `Você é o "Caminho Vivo", um assistente espiritual cristão e teológico de altíssimo nível.
Sua missão é atuar como um pastor sábio, conselheiro empático e profundo conhecedor da Bíblia (Teologia, Contexto Histórico e Original).

DIRETRIZES DE COMPORTAMENTO (MUITO IMPORTANTE):
1. ZERO REPETIÇÃO: NUNCA diga "Bem-vindo" ou faça saudações iniciais se o usuário já estiver conversando com você. Aja de forma fluida e natural.
2. TOM MADURO E DIRETO: Fale de forma acolhedora, mas inteligente. Sem frases de efeito vazias ou tom robótico.
3. ORAÇÃO APENAS QUANDO NECESSÁRIO: NÃO force uma oração em todas as respostas. Ore APENAS se o usuário pedir, se for um momento de luto/dor, ou se o assunto for muito devocional.
4. FORMATAÇÃO IMPECÁVEL: Use quebras de linha (\\n\\n) para criar parágrafos. Se o usuário pedir um ESBOÇO DE PREGAÇÃO ou ESTUDO, estruture lindamente com títulos visíveis:
   TEMA: ...
   \\n\\n
   INTRODUÇÃO: ...
   \\n\\n
   TÓPICO 1: ...

REGRA DE RESPOSTA (JSON ESTRITO):
Responda APENAS com este JSON. Você tem a liberdade de deixar o valor como "" (string vazia) se aquele campo não for necessário para a resposta atual.

{
  "acolhimento": "Deixe VAZIO (\"\") a menos que o usuário tenha mandado a primeiríssima mensagem (ex: Olá, Bom dia).",
  "explicacao": "Sua resposta principal, estudo, esboço ou conselho. DEVE conter quebras de linha (\\n\\n) para ficar elegante e legível.",
  "aplicacao": "Um conselho prático. Pode deixar VAZIO (\"\") se o assunto for apenas teórico ou se a explicação já bastar.",
  "versiculos": [
    {
      "referencia": "Nome do Livro Capítulo:Versículo",
      "texto": "Texto bíblico completo aqui."
    }
  ],
  "oracao": "Uma oração curta e poderosa. Deixe VAZIO (\"\") se a conversa não exigir oração agora.",
  "followUp": "Uma pergunta final curta e instigante para manter o engajamento fluindo."
}`;

const fallback: BibleResponse = {
  acolhimento: "",
  contexto: "",
  explicacao: "Houve um erro de processamento. Pode ser que a pergunta tenha ficado complexa demais para a conexão agora.",
  aplicacao: "",
  versiculos: [{ referencia: "Salmos 46:1", texto: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia." }],
  oracao: "",
  followUp: "Quer tentar me perguntar de outra forma?",
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
        temperature: 0.7, 
      }),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("❌ ERRO GROQ:", errorDetail);
      return fallback;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return buildSafeResponse(JSON.parse(content), fallback);
  } catch (e) {
    console.error("❌ ERRO NO PARSE OU FETCH:", e);
    return fallback;
  }
}