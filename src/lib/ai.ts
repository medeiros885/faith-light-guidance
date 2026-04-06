import type { BibleResponse } from "@/data/mockResponses";

// ─── VALIDATION ───────────────────────────────────────────────────────────────

export function isValidBibleResponse(obj: any): obj is BibleResponse {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.acolhimento === "string" &&
    typeof obj.contexto === "string" &&
    typeof obj.explicacao === "string" &&
    typeof obj.aplicacao === "string" &&
    Array.isArray(obj.versiculos) &&
    typeof obj.oracao === "string" &&
    typeof obj.followUp === "string"
  );
}

// ─── TEXT HELPERS ─────────────────────────────────────────────────────────────

export function cleanText(text: string): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

export function limitText(text: string, max: number): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "..." : text;
}

// ─── VERSES ───────────────────────────────────────────────────────────────────

export function normalizeVerses(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  const filtered = input.filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0
  );

  return filtered.slice(0, 2).map((v) => limitText(v, 220));
}

// ─── SAFE BUILD ───────────────────────────────────────────────────────────────

export function buildSafeResponse(
  parsed: Partial<BibleResponse>,
  fallback: BibleResponse
): BibleResponse {
  return {
    acolhimento:
      typeof parsed.acolhimento === "string" && parsed.acolhimento.trim()
        ? limitText(cleanText(parsed.acolhimento), 260)
        : fallback.acolhimento,

    contexto:
      typeof parsed.contexto === "string" && parsed.contexto.trim()
        ? limitText(cleanText(parsed.contexto), 600)
        : fallback.contexto,

    explicacao:
      typeof parsed.explicacao === "string" && parsed.explicacao.trim()
        ? limitText(cleanText(parsed.explicacao), 900)
        : fallback.explicacao,

    aplicacao:
      typeof parsed.aplicacao === "string" && parsed.aplicacao.trim()
        ? limitText(cleanText(parsed.aplicacao), 500)
        : fallback.aplicacao,

    versiculos:
      normalizeVerses(parsed.versiculos).length > 0
        ? normalizeVerses(parsed.versiculos)
        : fallback.versiculos,

    oracao:
      typeof parsed.oracao === "string" && parsed.oracao.trim()
        ? limitText(cleanText(parsed.oracao), 320)
        : fallback.oracao,

    followUp:
      typeof parsed.followUp === "string" && parsed.followUp.trim()
        ? limitText(cleanText(parsed.followUp), 180)
        : fallback.followUp,
  };
}