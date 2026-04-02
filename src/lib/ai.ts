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

  return `${emotionLine}You are a Christian assistant.
You must respond ONLY in valid JSON.

Do not include any text outside JSON.
Do not include markdown.
Do not explain anything outside the JSON.

Return EXACTLY this structure:

{
  "acolhimento": "mensagem acolhedora",
  "contexto": "contexto bíblico claro",
  "explicacao": "explicação simples",
  "aplicacao": "como aplicar na vida",
  "versiculos": ["1 versículo bíblico"],
  "oracao": "oração curta",
  "followUp": "pergunta para continuar a conversa"
}

All content must be in Portuguese (Brasil).

If you do not follow this format, the response will be rejected.

User message: "${message}"`;
}

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
  try {
    return JSON.parse(raw) as Partial<BibleResponse>;
  } catch { /* not direct JSON */ }

  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as Partial<BibleResponse>;
    } catch { /* not valid JSON inside fence */ }
  }

  const braceMatch = raw.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]) as Partial<BibleResponse>;
    } catch { /* still not valid */ }
  }

  return null;
}

function buildResult(parsed: Partial<BibleResponse>): BibleResponse {
  return {
    acolhimento: typeof parsed.acolhimento === "string" && parsed.acolhimento
      ? parsed.acolhimento : FALLBACK.acolhimento,
    contexto: typeof parsed.contexto === "string" && parsed.contexto
      ? parsed.contexto : FALLBACK.contexto,
    explicacao: typeof parsed.explicacao === "string" && parsed.explicacao
      ? parsed.explicacao : FALLBACK.explicacao,
    aplicacao: typeof parsed.aplicacao === "string" && parsed.aplicacao
      ? parsed.aplicacao : FALLBACK.aplicacao,
    versiculos: Array.isArray(parsed.versiculos) && parsed.versiculos.length > 0
      ? parsed.versiculos.filter((v) => typeof v === "string")
      : FALLBACK.versiculos,
    oracao: typeof parsed.oracao === "string" && parsed.oracao
      ? parsed.oracao : FALLBACK.oracao,
    followUp: typeof parsed.followUp === "string" && parsed.followUp
      ? parsed.followUp : FALLBACK.followUp,
  };
}

async function callGemini(prompt: string, apiKey: string, attempt: number): Promise<string | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  console.log(`[AI] Attempt ${attempt}: sending request to Gemini 1.5 Flash...`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        response_mime_type: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[AI] Attempt ${attempt}: Gemini API error ${response.status} ${response.statusText}:`, errText);
    return null;
  }

  const data = await response.json();
  console.log(`[AI] Attempt ${attempt}: full response:`, JSON.stringify(data));

  const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  console.log(`[AI] Attempt ${attempt}: raw text:`, rawText);

  return rawText || null;
}

export async function generateAIResponse(
  message: string,
  userEmotion?: string | null
): Promise<BibleResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[AI] VITE_GEMINI_API_KEY is not set.");
    return FALLBACK;
  }

  const prompt = buildPrompt(message, userEmotion);

  try {
    // Attempt 1
    const rawText1 = await callGemini(prompt, apiKey, 1);

    if (rawText1) {
      const parsed1 = extractAndParseJSON(rawText1);
      if (parsed1) {
        console.log("[AI] Attempt 1: parsed successfully.");
        return buildResult(parsed1);
      }
      console.warn("[AI] Attempt 1: response was not valid JSON. Retrying...");
    }

    // Attempt 2 (automatic retry)
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
