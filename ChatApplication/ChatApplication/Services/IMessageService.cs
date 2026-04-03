using ChatApplication.Entities;

namespace ChatApp.Services
{
    public interface IMessageService
    {
        Task<int> SaveMessage(int senderId, int receiverId, string content);
        Task<Message?> EditMessage(int messageId, int senderId, string newContent);
        Task<Message?> DeleteMessage(int messageId, int senderId);
        Task<IEnumerable<object>> GetChatHistory(int currentUserId, int otherUserId);
    }
}
