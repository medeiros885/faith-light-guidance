import type { BibleResponse } from "@/data/mockResponses";

// ─── Provider ────────────────────────────────────────────────────────────────
// Groq API (OpenAI-compatible)
// Set the secret key in Replit Secrets as: VITE_GROQ_API_KEY
// ─────────────────────────────────────────────────────────────────────────────

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// ─── Fallback ─────────────────────────────────────────────────────────────────

const FALLBACK: BibleResponse = {
  acolhimento: "Estou aqui com você.",
  contexto: "A Bíblia mostra que Deus se importa com cada detalhe da nossa vida e nos chama a confiar nele.",
  explicacao: "Mesmo quando a resposta não vem na hora, Deus continua presente, guiando com amor, verdade e direção.",
  aplicacao: "Ore com sinceridade, leia a Palavra com calma e dê um passo de cada vez confiando no Senhor.",
  versiculos: [
    "Salmos 46:1 — Deus é o nosso refúgio e fortaleza.",
    "Provérbios 3:5 — Confia no Senhor de todo o teu coração.",
  ],
  oracao: "Senhor, me dá paz, direção e sabedoria para viver a tua vontade. Amém.",
  followUp: "Quer que eu aprofunde mais esse assunto com você?",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type DebugFn = (msg: string) => void;

function log(msg: string, onDebug?: DebugFn) {
  console.log(msg);
  onDebug?.(msg);
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `Você é um assistente cristão pastoral do app "Caminho Vivo".

Responda SEMPRE em português do Brasil com linguagem:
- Calorosa e acolhedora
- Pastoral e teológica
- Natural, não robótica
- Baseada fielmente nas Escrituras

Você DEVE retornar APENAS um objeto JSON válido, sem texto extra, sem markdown, sem blocos de código.

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
- Nunca invente referências bíblicas
- Se a pergunta for emocional, comece com empatia
- Se for teológica, explique com profundidade bíblica
- Se for factual, responda com precisão
- Não repita frases prontas ou genéricas`;
}

function buildUserPrompt(message: string, userEmotion?: string | null): string {
  const emotionLine = userEmotion
    ? `\nO usuário está se sentindo: ${userEmotion}. Adapte o acolhimento a esse estado emocional.`
    : "";

  return `${emotionLine}\nPergunta ou mensagem do usuário: "${message}"`;
}

// ─── JSON parsing ─────────────────────────────────────────────────────────────

function extractAndParseJSON(raw: string): Partial<BibleResponse> | null {
  if (!raw?.trim()) return null;

  // 1. Direct parse
  try { return JSON.parse(raw) as Partial<BibleResponse>; } catch { /* continue */ }

  // 2. Inside markdown fences
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) {
    try { return JSON.parse(fence[1].trim()) as Partial<BibleResponse>; } catch { /* continue */ }
  }

  // 3. First { ... } block
  const brace = raw.match(/\{[\s\S]*\}/);
  if (brace?.[0]) {
    try { return JSON.parse(brace[0]) as Partial<BibleResponse>; } catch { /* continue */ }
  }

  return null;
}

function buildResult(parsed: Partial<BibleResponse>): BibleResponse {
  return {
    acolhimento: typeof parsed.acolhimento === "string" && parsed.acolhimento.trim()
      ? parsed.acolhimento.trim() : FALLBACK.acolhimento,
    contexto: typeof parsed.contexto === "string" && parsed.contexto.trim()
      ? parsed.contexto.trim() : FALLBACK.contexto,
    explicacao: typeof parsed.explicacao === "string" && parsed.explicacao.trim()
      ? parsed.explicacao.trim() : FALLBACK.explicacao,
    aplicacao: typeof parsed.aplicacao === "string" && parsed.aplicacao.trim()
      ? parsed.aplicacao.trim() : FALLBACK.aplicacao,
    versiculos: Array.isArray(parsed.versiculos) && parsed.versiculos.length > 0
      ? parsed.versiculos.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      : FALLBACK.versiculos,
    oracao: typeof parsed.oracao === "string" && parsed.oracao.trim()
      ? parsed.oracao.trim() : FALLBACK.oracao,
    followUp: typeof parsed.followUp === "string" && parsed.followUp.trim()
      ? parsed.followUp.trim() : FALLBACK.followUp,
  };
}

function plainTextToBibleResponse(text: string, message: string): BibleResponse {
  const cleaned = text.trim();
  return {
    acolhimento: "Obrigado por compartilhar isso comigo.",
    contexto: cleaned.slice(0, 250) || FALLBACK.contexto,
    explicacao: cleaned.slice(0, 500) || FALLBACK.explicacao,
    aplicacao: FALLBACK.aplicacao,
    versiculos: FALLBACK.versiculos,
    oracao: FALLBACK.oracao,
    followUp: `Quer aprofundar mais sobre "${message}"?`,
  };
}

// ─── Groq API call ────────────────────────────────────────────────────────────

async function callGroq(
  message: string,
  userEmotion: string | null | undefined,
  apiKey: string,
  attempt: number,
  onDebug?: DebugFn
): Promise<string | null> {
  log(`[AI] Attempt ${attempt}: sending request to Groq (${GROQ_MODEL})...`, onDebug);

  let response: Response;
  try {
    response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(message, userEmotion) },
        ],
      }),
    });
  } catch (fetchErr) {
    log(`[AI] Attempt ${attempt}: fetch failed — ${String(fetchErr)}`, onDebug);
    return null;
  }

  log(`[AI] Attempt ${attempt}: HTTP ${response.status}`, onDebug);

  if (!response.ok) {
    const errText = await response.text();
    log(`[AI] Attempt ${attempt}: error — ${errText.slice(0, 150)}`, onDebug);
    console.error("Groq API error:", errText);
    return null;
  }

  const data = await response.json();
  const rawText: string = data?.choices?.[0]?.message?.content ?? "";

  log(`[AI] Attempt ${attempt}: raw text ${rawText ? "received ✓" : "empty ✗"}`, onDebug);

  return rawText || null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateAIResponse(
  message: string,
  userEmotion?: string | null,
  onDebug?: DebugFn
): Promise<BibleResponse> {
  log("[AI] Provider: Groq", onDebug);

  // VITE_GROQ_API_KEY — set this in Replit Secrets
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  const keyExists = Boolean(apiKey);

  log(`[AI] API key exists: ${keyExists ? "yes ✓" : "no ✗"}`, onDebug);

  if (!apiKey) {
    log("[AI] VITE_GROQ_API_KEY is missing — returning fallback", onDebug);
    return FALLBACK;
  }

  try {
    // Attempt 1
    const rawText1 = await callGroq(message, userEmotion, apiKey, 1, onDebug);

    if (rawText1) {
      const parsed1 = extractAndParseJSON(rawText1);
      if (parsed1) {
        log("[AI] Attempt 1: JSON parsed ✓ — returning real response", onDebug);
        return buildResult(parsed1);
      }
      log("[AI] Attempt 1: JSON parse failed ✗ — retrying...", onDebug);
    } else {
      log("[AI] Attempt 1: no text returned — retrying...", onDebug);
    }

    // Attempt 2 (automatic retry)
    const rawText2 = await callGroq(message, userEmotion, apiKey, 2, onDebug);

    if (rawText2) {
      const parsed2 = extractAndParseJSON(rawText2);
      if (parsed2) {
        log("[AI] Attempt 2: JSON parsed ✓ — returning real response", onDebug);
        return buildResult(parsed2);
      }
      log("[AI] Attempt 2: converting plain text to response", onDebug);
      return plainTextToBibleResponse(rawText2, message);
    }

    log("[AI] Both attempts failed — using fallback ✗", onDebug);
    return FALLBACK;
  } catch (error) {
    log(`[AI] Unexpected error: ${String(error)} — using fallback`, onDebug);
    console.error("[AI] Unexpected error:", error);
    return FALLBACK;
  }
}
