using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ChatApplication.Entities;
using Microsoft.AspNetCore.Authorization;
using ChatApp.Services;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMessageService _messageService;
        private static readonly HashSet<string> _onlineUsers = new HashSet<string>();

        public ChatHub(IMessageService messageService)
        {
            _messageService = messageService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                lock (_onlineUsers)
                {
                    _onlineUsers.Add(userId);
                }
                await Clients.All.SendAsync("UserStatusChanged", userId, true);
                await Clients.Caller.SendAsync("InitialOnlineUsers", _onlineUsers.ToArray());
            }

            Console.WriteLine($"✅ Connected UserId: {userId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                lock (_onlineUsers)
                {
                    _onlineUsers.Remove(userId);
                }
                await Clients.All.SendAsync("UserStatusChanged", userId, false);
            }

            Console.WriteLine($"❌ Disconnected UserId: {userId}");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task<int> SendPrivateMessage(string receiverId, string message)
        {
            var senderIdStr = Context.UserIdentifier;
            if (string.IsNullOrEmpty(senderIdStr) || !int.TryParse(senderIdStr, out int senderId) || !int.TryParse(receiverId, out int receiverIdInt))
                throw new HubException("Invalid sender or receiver");

            var messageId = await _messageService.SaveMessage(senderId, receiverIdInt, message);
            await Clients.User(receiverId).SendAsync("ReceiveMessage", senderIdStr, message, messageId);
            return messageId;
        }

        public async Task EditMessage(int messageId, string newContent)
        {
            var senderIdStr = Context.UserIdentifier;
            if (string.IsNullOrEmpty(senderIdStr) || !int.TryParse(senderIdStr, out int senderId)) return;

            var msg = await _messageService.EditMessage(messageId, senderId, newContent);
            if (msg != null)
            {
                await Clients.User(msg.ReceiverId.ToString()).SendAsync("MessageEdited", messageId, newContent);
            }
        }

        public async Task DeleteMessage(int messageId)
        {
            var senderIdStr = Context.UserIdentifier;
            if (string.IsNullOrEmpty(senderIdStr) || !int.TryParse(senderIdStr, out int senderId)) return;

            var msg = await _messageService.DeleteMessage(messageId, senderId);
            if (msg != null)
            {
                await Clients.User(msg.ReceiverId.ToString()).SendAsync("MessageDeleted", messageId);
            }
        }

        public async Task TypingStateChanged(string receiverId, bool isTyping)
        {
            var senderId = Context.UserIdentifier;
            Console.WriteLine($"Sender: {Context.UserIdentifier}, Receiver: {receiverId}, Typing: {isTyping}");
            await Clients.User(receiverId).SendAsync("UserTyping", senderId, isTyping);
        }
    }
}