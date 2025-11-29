export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY não configurada" });
    }

    const { messages } = req.body;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      return res
        .status(openaiRes.status)
        .json({ error: "Erro na OpenAI", detail: errorText });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
