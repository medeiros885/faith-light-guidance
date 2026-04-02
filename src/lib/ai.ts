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

function buildPrompt(message: string, userEmotion?: string | null): string {
  const emotionLine = userEmotion
    ? `O usuário está se sentindo: ${userEmotion}. Adapte o acolhimento a esse estado emocional.\n\n`
    : "";

  return `${emotionLine}
Você é um assistente cristão do app Caminho Vivo.

Responda SEMPRE em português do Brasil.
Você DEVE retornar APENAS JSON válido.
Não use markdown.
Não escreva explicações fora do JSON.
Não use crases.
Não adicione texto antes ou depois.

Retorne EXATAMENTE esta estrutura:
{
  "acolhimento": "mensagem acolhedora",
  "contexto": "contexto bíblico claro",
  "explicacao": "explicação simples",
  "aplicacao": "como aplicar na vida",
  "versiculos": ["1 ou 2 versículos bíblicos"],
  "oracao": "oração curta",
  "followUp": "pergunta para continuar a conversa"
}

Regras:
- Se a pergunta for factual, responda corretamente.
- Se for emocional, comece com empatia.
- Se for teológica, explique com coerência bíblica.
- Não seja genérico.
- Não repita respostas.
- Nunca invente referência bíblica.

Pergunta do usuário:
${message}
`.trim();
}

function plainTextToBibleResponse(text: string, message: string): BibleResponse {
  const cleaned = text.trim();

  return {
    acolhimento: "Obrigado por compartilhar isso comigo.",
    contexto: cleaned.slice(0, 220) || FALLBACK.contexto,
    explicacao: cleaned.slice(0, 420) || FALLBACK.explicacao,
    aplicacao: "Reserve um momento para refletir sobre isso em oração e volte se quiser aprofundar.",
    versiculos: FALLBACK.versiculos,
    oracao: FALLBACK.oracao,
    followUp: `Quer aprofundar mais sobre "${message}"?`,
  };
}

function extractAndParseJSON(raw: string): Partial<BibleResponse> | null {
  if (!raw) return null;

  // 1) JSON direto
  try {
    return JSON.parse(raw) as Partial<BibleResponse>;
  } catch {
    // segue
  }

  // 2) JSON dentro de markdown fence
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as Partial<BibleResponse>;
    } catch {
      // segue
    }
  }

  // 3) Primeiro objeto {...} encontrado
  const braceMatch = raw.match(/\{[\s\S]*\}/);
  if (braceMatch?.[0]) {
    try {
      return JSON.parse(braceMatch[0]) as Partial<BibleResponse>;
    } catch {
      // segue
    }
  }

  return null;
}

function buildResult(parsed: Partial<BibleResponse>): BibleResponse {
  const versiculos =
    Array.isArray(parsed.versiculos) && parsed.versiculos.length > 0
      ? parsed.versiculos.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      : FALLBACK.versiculos;

  return {
    acolhimento:
      typeof parsed.acolhimento === "string" && parsed.acolhimento.trim()
        ? parsed.acolhimento.trim()
        : FALLBACK.acolhimento,
    contexto:
      typeof parsed.contexto === "string" && parsed.contexto.trim()
        ? parsed.contexto.trim()
        : FALLBACK.contexto,
    explicacao:
      typeof parsed.explicacao === "string" && parsed.explicacao.trim()
        ? parsed.explicacao.trim()
        : FALLBACK.explicacao,
    aplicacao:
      typeof parsed.aplicacao === "string" && parsed.aplicacao.trim()
        ? parsed.aplicacao.trim()
        : FALLBACK.aplicacao,
    versiculos,
    oracao:
      typeof parsed.oracao === "string" && parsed.oracao.trim()
        ? parsed.oracao.trim()
        : FALLBACK.oracao,
    followUp:
      typeof parsed.followUp === "string" && parsed.followUp.trim()
        ? parsed.followUp.trim()
        : FALLBACK.followUp,
  };
}

async function callGemini(prompt: string, apiKey: string, attempt: number): Promise<string | null> {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  console.log(`[AI] Attempt ${attempt}: sending request to Gemini...`);

  const response = await fetch(endpoint, {
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
        temperature: 0.6,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            acolhimento: { type: "STRING" },
            contexto: { type: "STRING" },
            explicacao: { type: "STRING" },
            aplicacao: { type: "STRING" },
            versiculos: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            oracao: { type: "STRING" },
            followUp: { type: "STRING" },
          },
          required: [
            "acolhimento",
            "contexto",
            "explicacao",
            "aplicacao",
            "versiculos",
            "oracao",
            "followUp",
          ],
        },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(
      `[AI] Attempt ${attempt}: Gemini API error ${response.status} ${response.statusText}:`,
      errText
    );
    return null;
  }

  const data = await response.json();
  console.log(`[AI] Attempt ${attempt}: full response:`, data);

  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "";

  console.log(`[AI] Attempt ${attempt}: raw text:`, rawText);

  return rawText || null;
}

export async function generateAIResponse(
  message: string,
  userEmotion?: string | null
): Promise<BibleResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  console.log("[AI] key exists?", Boolean(apiKey));
  console.log("[AI] message:", message);
  console.log("[AI] userEmotion:", userEmotion);
  console.log("[AI] key prefix:", apiKey ? apiKey.slice(0, 6) : "none");

  if (!apiKey) {
    console.error("[AI] VITE_GEMINI_API_KEY is not set.");
    return FALLBACK;
  }

  const prompt = buildPrompt(message, userEmotion);

  try {
    // tentativa 1
    const rawText1 = await callGemini(prompt, apiKey, 1);

    if (rawText1) {
      const parsed1 = extractAndParseJSON(rawText1);
      if (parsed1) {
        console.log("[AI] Attempt 1: parsed successfully.");
        return buildResult(parsed1);
      }

      console.warn("[AI] Attempt 1: response was not valid JSON. Retrying...");
    }

    // tentativa 2
    const rawText2 = await callGemini(prompt, apiKey, 2);

    if (rawText2) {
      const parsed2 = extractAndParseJSON(rawText2);
      if (parsed2) {
        console.log("[AI] Attempt 2: parsed successfully.");
        return buildResult(parsed2);
      }

      console.warn("[AI] Attempt 2: still not valid JSON. Converting plain text.");
      return plainTextToBibleResponse(rawText2, message);
    }

    console.error("[AI] Both attempts failed. Using fallback.");
    return FALLBACK;
  } catch (error) {
    console.error("[AI] Unexpected error:", error);
    return FALLBACK;
  }
}