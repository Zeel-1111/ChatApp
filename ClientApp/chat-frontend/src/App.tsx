import { useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { useAuth } from "./hooks/useAuth";
import { useUsers } from "./hooks/useUsers";
import { useChat } from "./hooks/useChat";
import "./App.css";

function App() {
  const { users } = useUsers();
  const { token, username, connected, login } = useAuth();
  const [receiverId, setReceiverId] = useState("");
  
  const { 
    messages, 
    message, 
    typingUsers, 
    onlineUsers,
    handleSend, 
    handleEdit, 
    handleDelete, 
    handleTyping 
  } = useChat(token, receiverId);

  const receiverName = users.find(u => u.id.toString() === receiverId)?.username || "";

  return (
    <div className="app">
      {!connected ? (
        <Login users={users} onLogin={login} />
      ) : (
        <div className="chat-container">
          <Sidebar 
            users={users} 
            currentUsername={username} 
            receiverId={receiverId} 
            onlineUsers={onlineUsers}
            onSelectUser={setReceiverId} 
          />
          <ChatWindow 
            receiverId={receiverId}
            receiverName={receiverName}
            messages={messages}
            message={message}
            typingUsers={typingUsers}
            onlineUsers={onlineUsers}
            onMessageChange={handleTyping}
            onSend={handleSend}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

export default App;