import type { BibleResponse } from "@/data/mockResponses";

type DebugFn = (msg: string) => void;

const FALLBACK: BibleResponse = {
  acolhimento: "Estou aqui com você.",
  contexto: "Tive dificuldade para montar a resposta agora.",
  explicacao: "Pode ter acontecido um erro temporário na conexão com a IA.",
  aplicacao: "Tente enviar sua pergunta novamente em alguns segundos.",
  versiculos: ["Salmos 46:1 — Deus é o nosso refúgio e fortaleza."],
  oracao: "Senhor, traz paz e clareza neste momento. Amém.",
  followUp: "Quer tentar perguntar de novo?",
};

function debugLog(onDebug: DebugFn | undefined, message: string) {
  console.log(message);
  onDebug?.(message);
}

function buildPrompt(message: string, userEmotion?: string | null): string {
  const emotionLine = userEmotion
    ? `O usuário está se sentindo: ${userEmotion}. Adapte o acolhimento.\n`
    : "";

  return `
${emotionLine}Você é um assistente cristão do app Caminho Vivo.

Responda em português do Brasil.
Retorne SOMENTE JSON válido.
Não use markdown.
Não escreva nada antes ou depois do JSON.
Não deixe nenhum campo vazio.

Use EXATAMENTE esta estrutura:
{
  "acolhimento": "string",
  "contexto": "string",
  "explicacao": "string",
  "aplicacao": "string",
  "versiculos": ["string", "string"],
  "oracao": "string",
  "followUp": "string"
}

Regras:
- Se a pergunta for factual, responda com precisão.
- Se for emocional, comece com empatia.
- Se for teológica, explique com clareza bíblica.
- Não invente referências bíblicas.
- Se só tiver 1 versículo, repita apenas 1 item no array.

Pergunta:
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

  try {
    return JSON.parse(raw) as Partial<BibleResponse>;
  } catch {
    // segue
  }

  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as Partial<BibleResponse>;
    } catch {
      // segue
    }
  }

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
      ? parsed.versiculos.filter(
          (v): v is string => typeof v === "string" && v.trim().length > 0
        )
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

function isExactFallback(response: BibleResponse): boolean {
  return (
    response.acolhimento === FALLBACK.acolhimento &&
    response.contexto === FALLBACK.contexto &&
    response.explicacao === FALLBACK.explicacao &&
    response.aplicacao === FALLBACK.aplicacao &&
    response.oracao === FALLBACK.oracao &&
    response.followUp === FALLBACK.followUp &&
    Array.isArray(response.versiculos) &&
    response.versiculos.join(" | ") === FALLBACK.versiculos.join(" | ")
  );
}

function extractRawText(data: any): string {
  const fromFirstPart = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const fromPartsArray = Array.isArray(data?.candidates?.[0]?.content?.parts)
    ? data.candidates[0].content.parts
        .map((p: { text?: string }) => p?.text ?? "")
        .join("")
        .trim()
    : "";

  const fromCandidateText = data?.candidates?.[0]?.text ?? "";

  return fromFirstPart || fromPartsArray || fromCandidateText || "";
}

async function callGemini(
  prompt: string,
  apiKey: string,
  attempt: number,
  onDebug?: (msg: string) => void
): Promise<string | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  if (onDebug) onDebug(`[AI] Attempt ${attempt}: sending request to Gemini...`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (onDebug) onDebug(`[AI] Attempt ${attempt}: HTTP ${response.status}`);

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error:", errText);
    if (onDebug) onDebug(`[AI] Attempt ${attempt}: API error`);
    return null;
  }

  const data = await response.json();

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (onDebug)
    onDebug(`[AI] Attempt ${attempt}: raw text ${rawText ? "received" : "empty"}`);

  return rawText || null;
}

export async function generateAIResponse(
  message: string,
  userEmotion?: string | null,
  onDebug?: DebugFn
): Promise<BibleResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  debugLog(onDebug, `[AI] key exists? ${Boolean(apiKey) ? "yes" : "no"}`);
  console.log("[AI] key prefix:", apiKey ? apiKey.slice(0, 6) : "none");
  console.log("[AI] message:", message);
  console.log("[AI] userEmotion:", userEmotion);

  if (!apiKey) {
    debugLog(onDebug, `[AI] Missing API key`);
    return FALLBACK;
  }

  const prompt = buildPrompt(message, userEmotion);

  try {
    const rawText1 = await callGemini(prompt, apiKey, 1, onDebug);

    if (rawText1) {
      const parsed1 = extractAndParseJSON(rawText1);
      if (parsed1) {
        debugLog(onDebug, `[AI] Attempt 1: JSON parsed`);
        const result1 = buildResult(parsed1);
        debugLog(onDebug, `[AI] Attempt 1: returning parsed response`);
        return result1;
      }

      debugLog(onDebug, `[AI] Attempt 1: invalid JSON, retrying`);
    }

    const rawText2 = await callGemini(prompt, apiKey, 2, onDebug);

    if (rawText2) {
      const parsed2 = extractAndParseJSON(rawText2);
      if (parsed2) {
        debugLog(onDebug, `[AI] Attempt 2: JSON parsed`);
        const result2 = buildResult(parsed2);
        debugLog(onDebug, `[AI] Attempt 2: returning parsed response`);
        return result2;
      }

      debugLog(onDebug, `[AI] Attempt 2: plain text converted`);
      return plainTextToBibleResponse(rawText2, message);
    }

    debugLog(onDebug, `[AI] Both attempts failed, using fallback`);
    return FALLBACK;
  } catch (error) {
    console.error("[AI] Unexpected error:", error);
    debugLog(onDebug, `[AI] Unexpected error, using fallback`);
    return FALLBACK;
  }
}