import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

const socket = io("http://localhost:2007");

export default function Chat() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<string | null>(null);
const bottomRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const myEmail = localStorage.getItem("email");

  // ✅ hook 1
  useEffect(() => {
    const user =
      location.state?.otherUser ||
      localStorage.getItem("chatUser");

    if (user) {
      const clean = user.trim().toLowerCase();
      setOtherUser(clean);
      localStorage.setItem("chatUser", clean);
    }
  }, [location.state]);

  // ✅ hook 2
  useEffect(() => {
    if (!myEmail || !otherUser) return;

    const room = [myEmail, otherUser]
      .map(e => e?.trim().toLowerCase())
      .sort()
      .join("_");

    socket.emit("joinRoom", room);

   socket.on("receiveMessage", (data: any) => {
  if (data.sender === myEmail) return;

  setMessages(prev => [
    ...prev,
    { ...data, status: "seen" }
  ]);
});

return () => {
  socket.off("receiveMessage");
};
  }, [otherUser]);

  // ✅ hook 3 (fetch)
  useEffect(() => {
    if (!myEmail || !otherUser) return;

    const room = [myEmail, otherUser]
      .map(e => e?.trim().toLowerCase())
      .sort()
      .join("_");

    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:2007/messages/${room}`);
      const data = await res.json();

      if (Array.isArray(data)) setMessages(data);
      else setMessages([]);
    };

    fetchMessages();
  }, [otherUser]);


useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);



  
  if (!myEmail || !otherUser) {
    return <h2>Loading...</h2>;
  }

  const room = [myEmail, otherUser]
    .map(e => e?.trim().toLowerCase())
    .sort()
    .join("_");





console.log("ROOM:", room);
console.log("MY:", myEmail);
console.log("OTHER:", otherUser);
 

 const sendMessage = () => {
  if (!msg) return;

  const messageData = {
    text: msg,
    sender: myEmail?.trim().toLowerCase(),
  };

  socket.emit("sendMessage", {
    room,
    message: messageData,
  });

  // ✅ THIS LINE ADD (important)
  setMessages((prev) => [...prev, messageData]);

  setMsg("");
};


if (!myEmail) {
  return <h2>No user logged in</h2>;
}

if (!otherUser) {
  return <h2>No user selected</h2>;
}
return (
 <div className="h-screen flex flex-col bg-[#fdf8ec] font-serif">

    {/* HEADER */}
    <div className="px-6 py-4 bg-white shadow flex justify-between items-center">
      <h2 className="text-xl text-[#b8963f] font-semibold">
        Chat 💬
      </h2>
      <span className="text-sm text-[#8c7440]">{otherUser}</span>
    </div>

    {/* CHAT AREA */}
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-[#fdf8ec]">

      {messages.map((m, i) => {
        const me = myEmail?.trim().toLowerCase();
        const isMe = m.sender?.trim().toLowerCase() === me;





        return (
          <div
            key={i}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
          <div
  className={`px-5 py-3 rounded-2xl max-w-[85%] text-[15px] shadow
  ${isMe
    ? "bg-gradient-to-r from-[#d4b25f] to-[#b8963f] text-white"
    : "bg-[#fff3d6] text-[#5f4a1a] border border-[#e6d3a3]"
  }`}
>
  {m.text}

  {isMe && (
    <div className="text-[10px] mt-1 text-right text-white/80">
      {m.status === "seen" ? "✔✔" : "✔"}
    </div>
  )}
</div>
          </div>
        );
      })}
<div ref={bottomRef}></div>
    </div>

    {/* INPUT BAR */}
    <div className="p-3 bg-[#fdf8ec] flex gap-2 border-t border-[#e6d3a3] sticky bottom-0">
<input
  value={msg}
  onChange={(e) => setMsg(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
  placeholder="Type message..."
  className="flex-1 px-4 py-2 rounded-full 
  bg-[#f5e6b8] text-[#5f4a1a] 
  border border-[#d4b25f]
  placeholder:text-[#a68a4a]
  focus:outline-none focus:ring-2 focus:ring-[#b8963f]"
/>
      <button
        onClick={sendMessage}
        className="px-6 rounded-full bg-gradient-to-r from-[#d4b25f] to-[#b8963f]
        text-white shadow hover:scale-105 transition"
      >
        Send
      </button>
    </div>

  </div>
);}