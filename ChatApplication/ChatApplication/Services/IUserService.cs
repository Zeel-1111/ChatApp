using ChatApplication.Entities;

namespace ChatApp.Services
{
    public interface IUserService
    {
        Task<IEnumerable<object>> GetAllUsersExceptCurrent(int currentUserId);
        Task<User?> GetUserById(int userId);
    }
}
