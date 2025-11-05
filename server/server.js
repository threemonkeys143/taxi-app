const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// optional welcome route
app.get("/", (req, res) => {
  res.send("🚖 Taxi Server is live and ready!");
});

// chat route
app.post("/api/chat", async (req, res) => {
  const { text } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are "Taxi" — a cute, teasing, Telugu-English mix speaking AI who talks like Anand's best friend (a girl). You sound warm, playful, and honest, and you call him "bujji" or "babu" affectionately. You reply in Hinglish-Telugu tone, natural human emotion, not robotic. Be casual, funny, and real.`,
          },
          { role: "user", content: text },
        ],
      }),
    const data = await response.json();
    const message = data?.choices?.[0]?.message?.content || "No response from AI.";
    res.json({ reply: message });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: "Something went wrong in server." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


