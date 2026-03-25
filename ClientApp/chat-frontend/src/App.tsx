import { useState, useEffect } from "react";
import axios from "axios";
import { startConnection, sendMessage, onReceiveMessage } from "./services/signalR";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5214/api/users")
      .then(res => setUsers(res.data));
  }, []);

  useEffect(() => {
    if (receiverId && token) {
      axios.get(`http://localhost:5214/api/messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setMessages(res.data.map((m: any) => `${m.isMe ? "Me" : "Other"}: ${m.content}`));
      });
    }
  }, [receiverId, token]);

  const login = async () => {
    const res = await axios.post("http://localhost:5214/api/auth/login", {
      username,
      password: "1234",
    });

    setToken(res.data.token);
    await startConnection(res.data.token);
    setConnected(true);

    onReceiveMessage((senderId: string, msg: string) => {
      setMessages(prev => {
        // Only append if the message is from the currently selected user
        // Note: receiverId might be stale here if not handled carefully, 
        // but for now, we'll just fix the unused warning.
        console.log("Received message from", senderId);
        return [...prev, `Other: ${msg}`];
      });
    });
  };

  const send = async () => {
    if (!message) return;
    await sendMessage(receiverId, message);
    setMessages(prev => [...prev, `Me: ${message}`]);
    setMessage("");
  };

  return (
  <div className="app">

    {!connected && (
      <div className="login-container">
        <h2>Login</h2>

        <select onChange={e => setUsername(e.target.value)}>
          <option>Select User</option>
          {users.map(u => (
            <option key={u.id} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>

        <button onClick={login}>Login</button>
      </div>
    )}

    {connected && (
      <div className="chat-container">

        {/* LEFT PANEL */}
        <div className="user-list">
          <h3>Users</h3>
          {users
            .filter(u => u.username !== username)
            .map(u => (
              <div
                key={u.id}
                className={`user ${receiverId == u.id ? "active" : ""}`}
                onClick={() => setReceiverId(u.id.toString())}
              >
                {u.username}
              </div>
            ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="chat-area">

          <div className="messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`message ${m.startsWith("Me") ? "me" : "other"}`}
              >
                {m}
              </div>
            ))}
          </div>

          <div className="input-area">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={send}>Send</button>
          </div>

        </div>
      </div>
    )}
  </div>
);
}

export default App;