import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend } from "react-icons/fi";

const TypingDots = () => (
  <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-2xl max-w-[120px]">
    <div className="w-2 h-2 rounded-full animate-bounce" />
    <div className="w-2 h-2 rounded-full animate-bounce delay-200" />
    <div className="w-2 h-2 rounded-full animate-bounce delay-400" />
  </div>
);

export default function App() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hey ra 😌 welcome to Taxi! I missed you." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { sender: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      const resp = await fetch("https://YOUR_BACKEND_URL/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await resp.json();
      const reply =
        data?.choices?.[0]?.message?.content ||
        "Sorry, something went wrong 😅";
      setMessages((m) => [...m, { sender: "ai", text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { sender: "ai", text: "Connection error 🥲" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 p-4">
      <div className="w-full max-w-md shadow-2xl rounded-3xl overflow-hidden bg-white">
        <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-purple-200 to-pink-200">
          <div className="font-semibold text-gray-800">Taxi 💬</div>
          <div className="text-xs text-gray-600 ml-2">online</div>
        </div>

        <div className="p-4 h-[60vh] overflow-y-auto" ref={scrollRef}>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[78%] py-2 px-3 rounded-2xl shadow-sm ${
                      m.sender === "user"
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <TypingDots />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-3 border-t bg-white flex items-center gap-2">
          <input
            className="flex-1 rounded-full px-4 py-2 outline-none border focus:ring-0"
            placeholder="Type something ra..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
