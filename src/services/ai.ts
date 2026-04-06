export interface BibleResponse {
  acolhimento: string;
  contexto: string;
  explicacao: string;
  aplicacao: string;
  versiculos: string[];
  oracao: string;
  followUp: string;
}

export function cleanText(text: string): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

export function limitText(text: string, max: number): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "..." : text;
}

export function buildSafeResponse(parsed: any, fallback: BibleResponse): BibleResponse {
  return {
    acolhimento: limitText(cleanText(parsed?.acolhimento || ""), 260) || fallback.acolhimento,
    contexto: limitText(cleanText(parsed?.contexto || ""), 600) || fallback.contexto,
    explicacao: limitText(cleanText(parsed?.explicacao || ""), 900) || fallback.explicacao,
    aplicacao: limitText(cleanText(parsed?.aplicacao || ""), 500) || fallback.aplicacao,
    versiculos: Array.isArray(parsed?.versiculos) ? parsed.versiculos : fallback.versiculos,
    oracao: limitText(cleanText(parsed?.oracao || ""), 320) || fallback.oracao,
    followUp: limitText(cleanText(parsed?.followUp || ""), 180) || fallback.followUp,
  };
}
