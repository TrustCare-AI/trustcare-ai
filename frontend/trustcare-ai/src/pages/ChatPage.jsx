import { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import InputBox from "../components/InputBox";

const ChatPage = () => {
  // 🔹 Chat Messages State
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("trustcare_chat");
    return saved
      ? JSON.parse(saved)
      : [
          {
            text: "👋 Hi! I’m TrustCare AI.\nTell me what symptoms you’re experiencing.",
            sender: "bot",
          },
        ];
  });

  // 🔹 Conversation Stage State
  const [stage, setStage] = useState("symptom");

  // 🔹 Save chat whenever messages update
  useEffect(() => {
    localStorage.setItem("trustcare_chat", JSON.stringify(messages));
  }, [messages]);

  // 🔹 Send Message Function
  const sendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text, sender: "user" }]);

    // Simulate bot delay
    setTimeout(() => {
      const { reply, nextStage } = generateBotReply(text, stage);

      setMessages((prev) => [...prev, { text: reply, sender: "bot" }]);

      if (nextStage) setStage(nextStage);
    }, 700);
  };

  // 🔹 Reset Chat (for demo)
  const handleNewChat = () => {
    localStorage.removeItem("trustcare_chat");
    setMessages([
      {
        text: "👋 Hi! I’m TrustCare AI.\nTell me what symptoms you’re experiencing.",
        sender: "bot",
      },
    ]);
    setStage("symptom");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        TrustCare AI 🩺
        <button onClick={handleNewChat} style={styles.newChatBtn}>
          New Chat
        </button>
      </div>

      <ChatWindow messages={messages} />
      <InputBox onSend={sendMessage} />
    </div>
  );
};

/* 🔹 Smart Frontend Logic (Temporary AI Simulation) */
const generateBotReply = (input, stage) => {
  const text = input.toLowerCase();

  switch (stage) {
    case "symptom":
      if (text.includes("headache")) {
        return {
          reply:
            "🧠 I understand you're having a headache.\n\n" +
            "On a scale of mild, moderate, or severe — how intense is the pain?",
          nextStage: "severity",
        };
      }

      if (text.includes("fever")) {
        return {
          reply:
            "🌡️ I see you have fever.\n\n" +
            "Is it low-grade or high fever? And since how many days?",
          nextStage: "duration",
        };
      }

      return {
        reply:
          "🤖 Got it.\n\nPlease tell me your main symptom (example: headache, fever, cough).",
        nextStage: "symptom",
      };

    case "severity":
      if (
        text.includes("severe") ||
        text.includes("banging") ||
        text.includes("high")
      ) {
        return {
          reply:
            "⚠️ Understood.\n\nHow long has this pain been present? (hours / days)",
          nextStage: "duration",
        };
      }

      if (text.includes("mild") || text.includes("moderate")) {
        return {
          reply:
            "📝 Thanks.\n\nHow long has this pain been present? (hours / days)",
          nextStage: "duration",
        };
      }

      return {
        reply: "Can you tell me if the pain is mild, moderate, or severe?",
        nextStage: "severity",
      };

    case "duration":
      return {
        reply:
          "🧾 Do you have any existing conditions like BP, diabetes, migraine, or sinus issues?",
        nextStage: "history",
      };

    case "history":
      return {
        reply:
          "✅ Thank you for sharing all details.\n\n" +
          "Based on your symptoms, I will now analyze and provide guidance.",
        nextStage: "analysis",
      };

    case "analysis":
      return {
        reply:
          "🩺 This could be related to **migraine, viral fever, or sinus infection**.\n\n" +
          "⚠️ Please consult a doctor if symptoms persist or worsen.\n\n" +
          "Would you like precautions or possible causes?",
        nextStage: null,
      };

    default:
      return {
        reply: "🤖 I’m here with you. Please continue.",
        nextStage: null,
      };
  }
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#0f0f0f",
    display: "flex",
    flexDirection: "column",
    color: "white",
  },
  header: {
    padding: "15px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "bold",
    borderBottom: "1px solid #333",
    position: "relative",
  },
  newChatBtn: {
    position: "absolute",
    right: "15px",
    top: "10px",
    padding: "6px 12px",
    backgroundColor: "#1db954",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default ChatPage;
