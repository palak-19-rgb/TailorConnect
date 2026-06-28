import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sessionId = "user_" + (localStorage.getItem("email") || "guest");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
     const res = await fetch(`${import.meta.env.VITE_API_URL}/chatbot/tailor-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong, please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="
              w-80 h-[420px]
              bg-gradient-to-br from-[#fdf8ec] via-[#f6ecd3] to-[#ead39a]
              rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]
              border border-[#e3c98b]
              flex flex-col
              overflow-hidden
              mb-4
            "
          >
            {/* HEADER */}
            <div className="
              bg-gradient-to-r from-[#3b2f1c] via-[#5c4b2c] to-[#b8963f]
              px-4 py-3
              flex justify-between items-center
            ">
              <div>
                <p className="text-[#f5e6b3] font-serif font-semibold text-sm tracking-wide">
                  ✂️ Stitch
                </p>
                <p className="text-[#e3c98b]/70 text-xs tracking-widest uppercase">
                  AI Tailor Assistant
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#f5e6b3]/70 hover:text-[#f5e6b3] text-lg transition"
              >
                ✕
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {messages.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[#8c7440] text-xs mt-10 italic"
                >
                  Ask me about tailors, measurements, or styling ✨
                </motion.p>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <span
                    className={`
                      inline-block px-3 py-2 rounded-2xl text-xs max-w-[80%] leading-relaxed
                      ${m.role === "user"
                        ? "bg-gradient-to-r from-[#b8963f] to-[#d4b25f] text-white shadow-md"
                        : "bg-white/60 backdrop-blur-md border border-[#e3c98b] text-[#5c4b2c]"
                      }
                    `}
                  >
                    {m.text}
                  </span>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <span className="inline-block px-3 py-2 rounded-2xl text-xs bg-white/60 border border-[#e3c98b] text-[#8c7440] italic">
                    Stitch is thinking...
                  </span>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="px-3 py-2 border-t border-[#e3c98b] flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask Stitch..."
                className="
                  flex-1 bg-white/50 backdrop-blur-md
                  border border-[#e3c98b] rounded-xl
                  px-3 py-2 text-xs text-[#5c4b2c]
                  placeholder-[#b8963f]/60
                  focus:outline-none focus:border-[#b8963f]
                "
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="
                  bg-gradient-to-r from-[#b8963f] to-[#d4b25f]
                  text-white text-xs px-3 py-2 rounded-xl
                  hover:opacity-90 disabled:opacity-50
                  transition shadow-md
                "
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOGGLE BUTTON */}
   {/* TOGGLE BUTTON */}
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setOpen(!open)}
  className="
    flex items-center gap-2
    px-4 py-3 rounded-full
    bg-gradient-to-br from-[#b8963f] to-[#5c4b2c]
    text-white text-xs font-semibold tracking-wide
    shadow-[0_10px_30px_rgba(0,0,0,0.3)]
    ml-auto
  "
>
  {open ? "✕ Close" : "✂️ Ask AI"}
</motion.button>
    </div>
  );
}

export default Chatbot;