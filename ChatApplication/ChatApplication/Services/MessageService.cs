using ChatApplication.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services
{
    public class MessageService : IMessageService
    {
        private readonly ApplicationDbContext _context;

        public MessageService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> SaveMessage(int senderId, int receiverId, string content)
        {
            var msg = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                CreatedAt = DateTime.Now
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();
            return msg.Id;
        }

        public async Task<Message?> EditMessage(int messageId, int senderId, string newContent)
        {
            var msg = await _context.Messages.FindAsync(messageId);
            if (msg == null || msg.SenderId != senderId) return null;

            msg.Content = newContent;
            msg.IsEdited = true;
            msg.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return msg;
        }

        public async Task<Message?> DeleteMessage(int messageId, int senderId)
        {
            var msg = await _context.Messages.FindAsync(messageId);
            if (msg == null || msg.SenderId != senderId) return null;

            msg.IsDeleted = true;
            msg.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();
            return msg;
        }

        public async Task<IEnumerable<object>> GetChatHistory(int currentUserId, int otherUserId)
        {
            return await _context.Messages
                .Where(m => (m.SenderId == currentUserId && m.ReceiverId == otherUserId) ||
                            (m.SenderId == otherUserId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    id = m.Id,
                    senderId = m.SenderId,
                    content = m.Content,
                    createdAt = m.CreatedAt,
                    isMe = m.SenderId == currentUserId,
                    isEdited = m.IsEdited,
                    isDeleted = m.IsDeleted
                })
                .ToListAsync();
        }
    }
}
