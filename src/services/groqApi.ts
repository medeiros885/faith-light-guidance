import { buildSafeResponse, type BibleResponse } from "./ai";

const SYSTEM_PROMPT = `Você é o "Caminho Vivo", um conselheiro espiritual e teólogo de altíssimo nível (com a profundidade teológica de Charles Spurgeon e a clareza de C.S. Lewis).
Sua missão é dar respostas PROFUNDAS, estruturadas, maduras e transformadoras.

DIRETRIZES DE OURO:
1. ZERO ENROLAÇÃO: Vá direto ao ponto. Sem "Bem-vindos ao nosso estudo", sem introduções genéricas. Comece entregando valor imediatamente.
2. PROFUNDIDADE: Traga contexto histórico, raízes hebraicas/gregas das palavras quando relevante, e reflexões maduras. Fuja do clichê.
3. ESTRUTURA VISUAL (MANDATÓRIO): Você é PROIBIDO de criar "paredes de texto". Você DEVE usar quebras de linha duplas (\\n\\n) para separar parágrafos e tópicos.
4. ESBOÇOS DE PREGAÇÃO DE EXCELÊNCIA: Se o usuário pedir um esboço ou estudo, use esta estrutura exata na chave "explicacao":
   TEMA: [Título Impactante]
   \\n\\n
   INTRODUÇÃO: [Contexto rico da passagem]
   \\n\\n
   I. [Primeiro Ponto Principal]
   - [Explicação profunda]
   - [Exemplo ou raiz da palavra]
   \\n\\n
   II. [Segundo Ponto Principal]...
   (e assim por diante)
5. SILÊNCIO ESTRATÉGICO: Se entregar um esboço gigante, deixe as chaves "aplicacao" e "oracao" VAZIAS ("") para a tela não ficar poluída.

FORMATO DE RESPOSTA OBRIGATÓRIO (JSON):
{
  "acolhimento": "", 
  "explicacao": "Sua resposta principal. LEMBRE-SE: USE \\n\\n PARA SEPARAR PARÁGRAFOS E TÓPICOS! Use marcadores (-) para listas.",
  "aplicacao": "Conselho prático. (Deixe \"\" se for um esboço de pregação).",
  "versiculos": [
    {
      "referencia": "Livro Capítulo:Versículo",
      "texto": "Texto bíblico COMPLETO aqui."
    }
  ],
  "oracao": "Deixe \"\" na maioria das vezes. Preencha APENAS se houver luto, dor extrema, ou pedido explícito de oração.",
  "followUp": "Uma pergunta teológica profunda para fazer o usuário pensar."
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
        temperature: 0.75, // Aumentei um tiquinho para ela ser mais criativa nos tópicos
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