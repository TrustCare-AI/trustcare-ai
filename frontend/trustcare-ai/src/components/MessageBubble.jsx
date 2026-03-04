const MessageBubble = ({ text, sender }) => {
  const isUser = sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          background: isUser ? "#10a37f" : "#1e1e1e",
          color: "white",
          padding: "12px 16px",
          borderRadius: "12px",
          maxWidth: "70%",
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
