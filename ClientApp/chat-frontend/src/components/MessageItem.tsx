import React, { useState } from "react";

interface Message {
  id: number;
  senderId: number;
  content: string;
  isMe: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}

interface MessageItemProps {
  message: Message;
  onEdit: (messageId: number, content: string) => void;
  onDelete: (messageId: number) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  const handleSave = () => {
    onEdit(message.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(message.content);
    setIsEditing(false);
  };

  return (
    <div className={`message ${message.isMe ? "me" : "other"} ${message.isDeleted ? "deleted" : ""}`}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
          />
          <div className="edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="message-content">
            {message.isDeleted ? "This message was deleted" : message.content}
            {message.isEdited && !message.isDeleted && <span className="edited-tag">(edited)</span>}
          </div>

          {message.isMe && !message.isDeleted && (
            <div className="message-actions">
              <button className="action-btn edit" onClick={() => setIsEditing(true)}>✏️</button>
              <button className="action-btn delete" onClick={() => onDelete(message.id)}>🗑️</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageItem;
