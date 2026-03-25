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
  if (!connection) return;
  await connection.invoke("SendPrivateMessage", receiverId, message);
};

export const onReceiveMessage = (callback: any) => {
  connection?.on("ReceiveMessage", callback);
};