import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const startConnection = async (token: string) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5214/chatHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  await connection.start();
};

export const sendMessage = async (receiverId: string, message: string) => {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) return;
  return await connection.invoke("SendPrivateMessage", receiverId, message);
};

export const editMessage = async (messageId: number, content: string) => {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) return;
  await connection.invoke("EditMessage", messageId, content);
};

export const deleteMessage = async (messageId: number) => {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) return;
  await connection.invoke("DeleteMessage", messageId);
};

export const onReceiveMessage = (callback: (senderId: string, message: string, messageId: number) => void) => {
  connection?.on("ReceiveMessage", callback);
};

export const onMessageEdited = (callback: (messageId: number, content: string) => void) => {
  connection?.on("MessageEdited", callback);
};

export const onMessageDeleted = (callback: (messageId: number) => void) => {
  connection?.on("MessageDeleted", callback);
};

export const sendTypingStatus = async (receiverId: string, isTyping: boolean) => {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) return;
  await connection.invoke("TypingStateChanged", receiverId, isTyping);
};

export const onUserTyping = (callback: (senderId: string, isTyping: boolean) => void) => {
  connection?.on("UserTyping", callback);
};

export const onUserStatusChanged = (callback: (userId: string, isOnline: boolean) => void) => {
  connection?.on("UserStatusChanged", callback);
};

export const onInitialOnlineUsers = (callback: (userIds: string[]) => void) => {
  connection?.on("InitialOnlineUsers", callback);
};