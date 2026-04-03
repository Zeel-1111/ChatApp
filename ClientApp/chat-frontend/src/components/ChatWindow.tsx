import React from "react";
import MessageItem from "./MessageItem";
import ChatHeader from "./ChatHeader";

interface Message {
  id: number;
  senderId: number;
  content: string;
  isMe: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  messages: Message[];
  message: string;
  typingUsers: { [key: string]: boolean };
  onlineUsers: string[];
  onMessageChange: (val: string) => void;
  onSend: () => void;
  onEdit: (messageId: number, content: string) => void;
  onDelete: (messageId: number) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  receiverId,
  receiverName,
  messages,
  message,
  typingUsers,
  onlineUsers,
  onMessageChange,
  onSend,
  onEdit,
  onDelete,
}) => {
  if (!receiverId) {
    return <div className="chat-area empty">Select a user to start chatting</div>;
  }

  const isTyping = typingUsers[receiverId] || false;
  const isOnline = onlineUsers.includes(receiverId);

  return (
    <div className="chat-area">
      <ChatHeader 
        receiverName={receiverName} 
        isOnline={isOnline} 
        isTyping={isTyping} 
      />

      <div className="messages">
        {messages.map((m, i) => (
          <MessageItem 
            key={m.id || i} 
            message={m} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
        {typingUsers[receiverId] && (
          <div className="message other typing-indicator">
            {receiverName} is typing...
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type message..."
        />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
