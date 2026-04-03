import React from "react";

interface ChatHeaderProps {
  receiverName: string;
  isOnline: boolean;
  isTyping: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ receiverName, isOnline, isTyping }) => {
  const getStatusText = () => {
    if (isTyping) return "typing...";
    return isOnline ? "Online" : "Offline";
  };

  return (
    <div className="chat-header">
      <div className="user-info">
        <div className="avatar">{receiverName?.[0]?.toUpperCase()}</div>
        <div className="user-details">
          <span className="username">{receiverName || "Select a user"}</span>
          <span className={`status ${isTyping ? "typing" : isOnline ? "online" : "offline"}`}>
            {getStatusText()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
