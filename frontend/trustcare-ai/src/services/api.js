export async function sendMessageToBot(message) {
  const response = await fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Server error");
  }

  const data = await response.json();
  return data.reply;
}
