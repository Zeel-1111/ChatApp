using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using ChatApplication.Entities;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"✅ Connected UserId: {Context.UserIdentifier}");
            await base.OnConnectedAsync();
        }

        public async Task SendPrivateMessage(string receiverId, string message)
        {
            try
            {
                var senderId = Context.UserIdentifier;

                if (string.IsNullOrEmpty(senderId))
                    throw new Exception("Sender not authenticated");

                if (string.IsNullOrEmpty(receiverId))
                    throw new Exception("ReceiverId is empty");

                if (!int.TryParse(senderId, out int sender))
                    throw new Exception("Invalid senderId format");

                if (!int.TryParse(receiverId, out int receiver))
                    throw new Exception("Invalid receiverId format");

                var msg = new Message
                {
                    SenderId = sender,
                    ReceiverId = receiver,
                    Content = message,
                    CreatedAt = DateTime.Now
                };

                _context.Messages.Add(msg);
                await _context.SaveChangesAsync();

                // Send to the specific user (SignalR handles mapping to all their connections)
                await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ [SendPrivateMessage] Error: {ex.Message}");
                throw; // propagate to client
            }
        }
    }
}