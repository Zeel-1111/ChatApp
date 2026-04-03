import { useState, useEffect } from "react";
import axios from "axios";
import { 
  sendMessage, 
  onReceiveMessage, 
  sendTypingStatus, 
  onUserTyping, 
  editMessage, 
  deleteMessage, 
  onMessageEdited, 
  onMessageDeleted,
  onUserStatusChanged,
  onInitialOnlineUsers
} from "../services/signalR";

export interface Message {
  id: number;
  senderId: number;
  content: string;
  isMe: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export const useChat = (token: string, receiverId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<{[key: string]: boolean}>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  // Fetch history
  useEffect(() => {
    if (receiverId && token) {
      axios.get(`http://localhost:5214/api/messages/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setMessages(res.data));
    }
  }, [receiverId, token]);

  // Setup SignalR listeners
  useEffect(() => {
    if (!token) return;

    onReceiveMessage((senderId: string, msg: string, messageId: number) => {
      setMessages(prev => [...prev, { id: messageId, senderId: parseInt(senderId), content: msg, isMe: false }]);
      setTypingUsers(prev => ({ ...prev, [senderId]: false }));
    });

    onMessageEdited((messageId: number, content: string) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content, isEdited: true } : m));
    });

    onMessageDeleted((messageId: number) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isDeleted: true } : m));
    });

    onUserTyping((senderId: string, isTyping: boolean) => {
      setTypingUsers(prev => ({ ...prev, [senderId]: isTyping }));
    });

    onUserStatusChanged((userId: string, isOnline: boolean) => {
      setOnlineUsers(prev => {
        if (isOnline) return prev.includes(userId) ? prev : [...prev, userId];
        return prev.filter(id => id !== userId);
      });
    });

    onInitialOnlineUsers((userIds: string[]) => {
      setOnlineUsers(userIds);
    });
  }, [token]);

  const handleSend = async () => {
    if (!message) return;
    if (typingTimeout) clearTimeout(typingTimeout);
    sendTypingStatus(receiverId, false);

    const messageId = await sendMessage(receiverId, message);
    setMessages(prev => [...prev, { id: messageId, content: message, isMe: true, senderId: 0 }]); // 0 for me
    setMessage("");
  };

  const handleEdit = async (messageId: number, content: string) => {
    await editMessage(messageId, content);
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content, isEdited: true } : m));
  };

  const handleDelete = async (messageId: number) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    await deleteMessage(messageId);
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isDeleted: true } : m));
  };

  const handleTyping = (val: string) => {
    const wasEmpty = !message;
    const isNowEmpty = !val;
    setMessage(val);

    if (!receiverId) return;
    if (wasEmpty && !isNowEmpty) sendTypingStatus(receiverId, true);
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => sendTypingStatus(receiverId, false), 3000);
    setTypingTimeout(timeout);
  };

  return {
    messages,
    message,
    typingUsers,
    handleSend,
    handleEdit,
    handleDelete,
    handleTyping,
    setMessage,
    onlineUsers
  };
};
