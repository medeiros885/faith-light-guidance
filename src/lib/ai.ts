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

function plainTextToBibleResponse(text: string, message: string): BibleResponse {
  return {
    acolhimento: "Que bom que você trouxe essa questão!",
    contexto: text.slice(0, 300) || FALLBACK.contexto,
    explicacao: text.slice(300, 700) || FALLBACK.explicacao,
    aplicacao: FALLBACK.aplicacao,
    versiculos: FALLBACK.versiculos,
    oracao: FALLBACK.oracao,
    followUp: `Quer aprofundar mais sobre "${message}"?`,
  };
}

function extractAndParseJSON(raw: string): Partial<BibleResponse> | null {
  // 1. Try parsing directly first
  try {
    return JSON.parse(raw) as Partial<BibleResponse>;
  } catch {
    // not direct JSON
  }

  // 2. Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as Partial<BibleResponse>;
    } catch {
      // not valid JSON inside fence
    }
  }

  // 3. Extract first { ... } block
  const braceMatch = raw.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]) as Partial<BibleResponse>;
    } catch {
      // still not valid
    }
  }

  return null;
}

export async function generateAIResponse(
  message: string,
  userEmotion?: string | null
): Promise<BibleResponse> {
  const emotionContext = userEmotion
    ? `O usuário está se sentindo: ${userEmotion}. Adapte o acolhimento a esse estado emocional.`
    : "";

  const prompt = `Você é um assistente bíblico cristão acolhedor, respondendo em Português do Brasil.
${emotionContext}

Pergunta do usuário: "${message}"

INSTRUÇÕES OBRIGATÓRIAS:
- Retorne APENAS um objeto JSON válido.
- NÃO inclua markdown, blocos de código, ou texto fora do JSON.
- NÃO use aspas simples — use APENAS aspas duplas.
- Todos os valores devem ser strings (exceto "versiculos" que é array de strings).
- Use exatamente estes campos, sem adicionar ou remover nenhum:

{
  "acolhimento": "frase calorosa de acolhimento ao usuário (1-2 frases)",
  "contexto": "contexto bíblico ou histórico relevante (2-4 frases)",
  "explicacao": "explicação aprofundada com base nas Escrituras (3-5 frases)",
  "aplicacao": "como aplicar esse ensinamento na vida prática hoje (2-3 frases)",
  "versiculos": ["Referência — texto do versículo", "Referência — texto do versículo"],
  "oracao": "oração curta e pessoal relacionada ao tema (2-3 frases)",
  "followUp": "pergunta ou sugestão para continuar a conversa (1 frase)"
}`;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[AI] VITE_GEMINI_API_KEY is not set.");
    return FALLBACK;
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        response_mime_type: "application/json",
      },
    };

    console.log("[AI] Sending request to Gemini 1.5 Flash...");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[AI] Gemini API error:", response.status, response.statusText, errText);
      return FALLBACK;
    }

    const data = await response.json();
    console.log("[AI] Raw Gemini response:", JSON.stringify(data));

    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    console.log("[AI] Raw text from Gemini:", rawText);

    if (!rawText.trim()) {
      console.error("[AI] Empty response from Gemini.");
      return FALLBACK;
    }

    const parsed = extractAndParseJSON(rawText);

    if (!parsed) {
      console.warn("[AI] Could not parse JSON. Converting plain text to BibleResponse.");
      return plainTextToBibleResponse(rawText, message);
    }

    console.log("[AI] Parsed response:", parsed);

    const result: BibleResponse = {
      acolhimento: typeof parsed.acolhimento === "string" && parsed.acolhimento
        ? parsed.acolhimento
        : FALLBACK.acolhimento,
      contexto: typeof parsed.contexto === "string" && parsed.contexto
        ? parsed.contexto
        : FALLBACK.contexto,
      explicacao: typeof parsed.explicacao === "string" && parsed.explicacao
        ? parsed.explicacao
        : FALLBACK.explicacao,
      aplicacao: typeof parsed.aplicacao === "string" && parsed.aplicacao
        ? parsed.aplicacao
        : FALLBACK.aplicacao,
      versiculos:
        Array.isArray(parsed.versiculos) && parsed.versiculos.length > 0
          ? parsed.versiculos.filter((v) => typeof v === "string")
          : FALLBACK.versiculos,
      oracao: typeof parsed.oracao === "string" && parsed.oracao
        ? parsed.oracao
        : FALLBACK.oracao,
      followUp: typeof parsed.followUp === "string" && parsed.followUp
        ? parsed.followUp
        : FALLBACK.followUp,
    };

    return result;
  } catch (error) {
    console.error("[AI] Unexpected error:", error);
    return FALLBACK;
  }
}
