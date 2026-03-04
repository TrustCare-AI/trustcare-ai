import { useState } from "react";

const InputBox = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your symptoms..."
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button style={styles.button} onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #333",
  },
  input: {
    flex: 1,
    background: "#1e1e1e",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    outline: "none",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 16px",
    background: "#10a37f",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};

export default InputBox;
