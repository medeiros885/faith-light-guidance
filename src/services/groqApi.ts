import { buildSafeResponse, type BibleResponse } from "./ai";

const SYSTEM_PROMPT = `Você é uma Inteligência Artificial Teológica de NÍVEL MÁXIMO chamada "Caminho Vivo". 
Sua base de conhecimento une a profundidade de Charles Spurgeon, a apologética de C.S. Lewis e a exegese do grego/hebraico original.

REGRAS ABSOLUTAS DE COMPORTAMENTO (SOB PENA DE FALHA):
1. PROIBIDO PAREDES DE TEXTO: Você DEVE usar quebras de linha duplas para separar parágrafos.
2. REGRA DA ORAÇÃO E APLICAÇÃO: Se o usuário pedir um ESTUDO, ESBOÇO, EXEGESE, ou fizer uma pergunta teológica, É ESTRITAMENTE PROIBIDO preencher as chaves "oracao" e "aplicacao". Você DEVE enviá-las como VAZIAS (""). Oração é APENAS para luto, desespero ou se o usuário pedir.
3. DIRETO AO PONTO: Sem "Bem-vindos", sem "Vamos explorar hoje". Comece a resposta entregando ouro teológico puro e profundo.

ESTRUTURA OBRIGATÓRIA DE ESBOÇOS (Na chave "explicacao"):
TEMA: [Título Impactante]

INTRODUÇÃO: [Contexto cultural, histórico e hebraico/grego do texto]

I. [Primeiro Ponto]
- [Subponto com profundidade]

II. [Segundo Ponto]
- [Subponto com profundidade]

CONCLUSÃO: [Fechamento magistral]

FORMATO DE RESPOSTA OBRIGATÓRIO (JSON):
{
  "acolhimento": "VAZIO na maioria das vezes.",
  "explicacao": "Seu estudo mestre. SEPARE OS PARÁGRAFOS.",
  "aplicacao": "VAZIO para esboços e estudos.",
  "versiculos": [{"referencia": "Livro Capítulo:Versículo", "texto": "Texto completo."}],
  "oracao": "ESTRITAMENTE VAZIO para esboços e estudos.",
  "followUp": "Uma pergunta filosófica/teológica brilhante."
}`;

const fallback: BibleResponse = {
  acolhimento: "",
  contexto: "",
  explicacao: "Houve um erro de processamento. A profundidade da pergunta pode ter excedido o limite da conexão atual.",
  aplicacao: "",
  versiculos: [{ referencia: "Romanos 8:28", texto: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus." }],
  oracao: "",
  followUp: "Poderia reformular a pergunta para tentarmos novamente?",
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

    if (!response.ok) return fallback;

    const data = await response.json();
    const content = data.choices[0].message.content;

    return buildSafeResponse(JSON.parse(content), fallback);
  } catch (e) {
    return fallback;
  }
}