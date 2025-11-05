const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { text } = req.body;
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Taxi, a friendly Telugu-speaking assistant." },
          { role: "user", content: text },
        ],
      }),
    });

    const data = await r.json();
    const message = data?.choices?.[0]?.message?.content || "No response from AI.";
    res.json({ reply: message });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong in server." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

