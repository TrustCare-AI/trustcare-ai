import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages }) => {
  return (
    <div style={styles.chat}>
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          text={msg.text}
          sender={msg.sender}
        />
      ))}
    </div>
  );
};

const styles = {
  chat: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
};

export default ChatWindow;
