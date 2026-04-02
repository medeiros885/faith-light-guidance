import type { BibleResponse } from "@/data/mockResponses";

const FALLBACK: BibleResponse = {
  acolhimento: "Estou aqui com você.",
  contexto: "Tive dificuldade para montar a resposta agora.",
  explicacao: "Pode ter acontecido um erro temporário na conexão com a IA.",
  aplicacao: "Tente enviar sua pergunta novamente em alguns segundos.",
  versiculos: ["Salmos 46:1 — Deus é o nosso refúgio e fortaleza."],
  oracao: "Senhor, traz paz e clareza neste momento. Amém.",
  followUp: "Quer tentar perguntar de novo?",
};

export async function generateAIResponse(
  message: string,
  userEmotion?: string | null
): Promise<BibleResponse> {
  const emotionContext = userEmotion
    ? `O usuário está se sentindo: ${userEmotion}. Leve isso em conta ao acolher e responder.`
    : "";

  const prompt = `Você é um assistente bíblico cristão acolhedor, falando em Português do Brasil.
${emotionContext}

Responda à seguinte mensagem do usuário com base nas Escrituras:
"${message}"

Responda APENAS com um objeto JSON válido, sem texto antes ou depois, usando exatamente esta estrutura:
{
  "acolhimento": "Uma frase curta e calorosa de acolhimento ao usuário (1-2 frases)",
  "contexto": "Contexto bíblico ou histórico relevante para a pergunta (2-4 frases)",
  "explicacao": "Explicação clara e aprofundada sobre o tema com base na Bíblia (3-5 frases)",
  "aplicacao": "Como aplicar esse ensinamento na vida prática hoje (2-3 frases)",
  "versiculos": ["Referência 1 — texto do versículo", "Referência 2 — texto do versículo"],
  "oracao": "Uma oração curta e pessoal relacionada ao tema (2-3 frases)",
  "followUp": "Uma pergunta ou sugestão para continuar a conversa (1 frase)"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status, response.statusText);
      return FALLBACK;
    }

    const data = await response.json();
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in Gemini response:", rawText);
      return FALLBACK;
    }

    const parsed = JSON.parse(jsonMatch[0]) as Partial<BibleResponse>;

    const result: BibleResponse = {
      acolhimento: parsed.acolhimento || FALLBACK.acolhimento,
      contexto: parsed.contexto || FALLBACK.contexto,
      explicacao: parsed.explicacao || FALLBACK.explicacao,
      aplicacao: parsed.aplicacao || FALLBACK.aplicacao,
      versiculos:
        Array.isArray(parsed.versiculos) && parsed.versiculos.length > 0
          ? parsed.versiculos
          : FALLBACK.versiculos,
      oracao: parsed.oracao || FALLBACK.oracao,
      followUp: parsed.followUp || FALLBACK.followUp,
    };

    return result;
  } catch (error) {
    console.error("Erro ao conectar com a IA:", error);
    return FALLBACK;
  }
}
