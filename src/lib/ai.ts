export async function generateAIResponse(message: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Não consegui responder agora.";
  } catch (error) {
    return "Erro ao conectar com a IA.";
  }
}
