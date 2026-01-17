import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
const [editedText, setEditedText] = useState("");
const [showReactionPickerIndex, setShowReactionPickerIndex] = useState(null);




  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const username = useRef("User" + Math.floor(Math.random() * 1000));
  const userColors = useRef({});
  const inputRef = useRef(null);


  const gradientPalette = [
    "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
    "linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)",
    "linear-gradient(135deg, #F6D365 0%, #FDA085 100%)",
    "linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)",
    "linear-gradient(135deg, #FCCF31 0%, #F55555 100%)",
    "linear-gradient(135deg, #43C6AC 0%, #191654 100%)",
  ];
  const emojis = ["😀", "😂", "😍", "😎", "😭", "🔥", "👍", "❤️", "🎉", "😮", "🤔"];


  const getUserGradient = (user) => {
    if (!userColors.current[user]) {
      const gradient =
        gradientPalette[Math.floor(Math.random() * gradientPalette.length)];
      userColors.current[user] = gradient;
    }
    return userColors.current[user];
  };

  const contacts = Array.from(
    new Set(messages.map((msg) => msg.user).filter((u) => u !== username.current))
  );

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([]);
      localStorage.removeItem("chatMessages");
    }
  };

  const deleteMessage = (index) => {
  setMessages((prev) => prev.filter((_, i) => i !== index));
};
const startEditing = (index, text, user) => {
  if (user !== username.current) return; // only edit own messages
  setEditingIndex(index);
  setEditedText(text);
};

const saveEditedMessage = (index) => {
  setMessages((prev) =>
    prev.map((msg, i) =>
      i === index ? { ...msg, text: editedText } : msg
    )
  );
  setEditingIndex(null);
  setEditedText("");
};

const cancelEditing = () => {
  setEditingIndex(null);
  setEditedText("");
};



  useEffect(() => {
    ws.current = new WebSocket("wss://ws.ifelse.io");

    ws.current.onopen = () => console.log("✅ WebSocket connected");

    ws.current.onmessage = (event) => {
      let data = event.data;
      if (typeof data !== "string" || !data.startsWith("{")) return;

      try {
        const message = JSON.parse(data);
        setMessages((prev) => {
          if (
            prev.length &&
            prev[prev.length - 1].text === message.text &&
            prev[prev.length - 1].user === message.user
          ) {
            return prev;
          }
          return [...prev, message];
        });
      } catch (err) {
        console.error("❌ JSON parse failed:", err);
      }
    };

    ws.current.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.current.onclose = () => console.log("⚠️ WebSocket disconnected");

    return () => ws.current.close();
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      alert("WebSocket not connected");
      return;
    }

    const message = {
      user: username.current,
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, message]);
    ws.current.send(JSON.stringify(message));
    setInput("");
    setIsTyping(false);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`w-screen h-screen flex items-center justify-center p-8 transition-colors duration-500 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-6xl h-[90vh] flex rounded-lg shadow-xl overflow-hidden transition-colors duration-500 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`w-64 flex flex-col p-6 space-y-6 transition-colors duration-500 shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200 ${
            darkMode
              ? "bg-gradient-to-b from-gray-800 to-gray-700 text-white"
              : "bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white"
          }`}
        >
          <h2
            className={`text-xl font-bold pt-2 pb-2 border-b ${
              darkMode ? "border-white/20" : "border-white/40"
            }`}
          >
            Contacts
          </h2>

          <div className="flex flex-col gap-3">
            {contacts.map((contact) => (
              <div
                key={contact}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center gap-2 p-3 rounded-2xl cursor-pointer font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  darkMode
                    ? selectedContact === contact
                      ? "bg-white text-black shadow-xl"
                      : "hover:bg-gray-600"
                    : selectedContact === contact
                    ? "bg-black text-yellow-400 shadow-xl"
                    : "hover:bg-indigo-500"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: darkMode
                      ? "linear-gradient(135deg, #6EE7B7, #3B82F6)"
                      : getUserGradient(contact),
                    color: "#fff",
                  }}
                >
                  {getInitials(contact)}
                </div>
                {contact}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <div
            className={`flex justify-between items-center p-4 text-center font-semibold text-lg sticky top-0 z-10 transition-colors duration-500 ${
              darkMode
                ? "bg-gray-700 text-white"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
            }`}
          >
            <span>💬 WebSocket Chat</span>

            <div className="flex gap-3">
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  darkMode
                    ? "bg-white text-black border border-gray-400 hover:bg-gray-200"
                    : "bg-black text-white-400 border border-yellow-500 hover:bg-gray-800"
                }`}
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Clear Chat Button */}
              <button
                onClick={clearChat}
                className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  darkMode
                    ? "bg-purple-500 text-white border border-red-600 hover:bg-red-600"
                    : "bg-purple-600 text-white border border-red-700 hover:bg-red-700"
                }`}
              >
                Clear Chat
              </button>
            </div>
            
          </div>

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-200 transition-colors duration-500 ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            {messages.map((msg, index) => {
              const isCurrentUser = msg.user === username.current;
              const isSelectedContact = selectedContact === msg.user;

              const currentUserGradient = darkMode
                ? "linear-gradient(135deg, #6EE7B7, #3B82F6)"
                : "linear-gradient(135deg, #93C5FD, #60A5FA)";

              const otherUserGradient = isCurrentUser
                ? currentUserGradient
                : darkMode
                ? "linear-gradient(135deg, #F472B6, #9333EA)"
                : getUserGradient(msg.user);

              return (
                <div
                  key={index}
                  onDoubleClick={() => startEditing(index, msg.text, msg.user)}

                  className={`flex items-start max-w-[60%] p-4 rounded-2xl shadow-lg group transition-all duration-300 transform ${
                    isCurrentUser ? "ml-auto flex-row-reverse" : "ml-0"
                  } ${
                    isSelectedContact
                      ? darkMode
                        ? "ring-2 ring-white shadow-xl"
                        : "ring-2 ring-yellow-400 shadow-xl"
                      : ""
                  }`}
                  style={{
                    background: otherUserGradient,
                    color: darkMode && !isCurrentUser ? "#FFF" : "#000",
                  }}
                >
                  {!isCurrentUser && (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 transition-colors duration-500 ${
                        darkMode
                          ? "bg-gradient-to-br from-pink-500 to-purple-700 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {getInitials(msg.user)}
                    </div>
                  )}

                  <div className="relative">
                    <p className="font-semibold">{msg.user}</p>
                    {editingIndex === index ? (
  <input
    value={editedText}
    autoFocus
    onChange={(e) => setEditedText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") saveEditedMessage(index);
      if (e.key === "Escape") cancelEditing();
    }}
    className="w-full rounded px-2 py-1 text-black"
  />
) : (
  <p className="mb-2 flex flex-wrap items-center gap-1">
    <span>{msg.text}</span>
    {msg.edited && (
      <span
        className={`text-xs italic ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        (edited)
      </span>
    )}
  </p>
)}



                    <div className="relative bottom-1 right-10 flex items-center gap-2 opacity-0 group-hover:opacity-80 transition-opacity  margin -20">
                     <span className="text-xs text-gray-600">
  {msg.time}
  {msg.edited && (
    <span className="ml-1 italic opacity-80">(edited)</span>
  )}
</span>

  <button
    onClick={() => deleteMessage(index)}
    className={`text-xs transition-colors ${
      darkMode
        ? "text-gray-300 hover:text-red-400"
        : "text-gray-600 hover:text-red-600"
    }`}
    title="Delete message"
  >
    🗑
  </button>
</div>

                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing indicator */}
          {isTyping && (
            <div
              className={`p-2 text-xs italic transition-colors duration-500 ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Typing...
            </div>
          )}

          {/* Input bar */}
          <div
            className={`flex border-t p-4 items-center gap-3 sticky bottom-0 transition-colors duration-500 ${
              darkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <button
              className={`px-4 py-2 rounded transition-colors duration-500 ${
                darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              😀
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className={`flex-1 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-500 ${
                darkMode
                  ? "bg-gray-600 text-white focus:ring-indigo-400"
                  : "bg-gray-100 text-black focus:ring-indigo-400"
              }`}
            />
            <button
              onClick={sendMessage}
              className={`px-6 py-2 rounded-2xl transition-colors duration-500 ${
                darkMode
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
