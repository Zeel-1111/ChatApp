using ChatApplication.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<object>> GetAllUsersExceptCurrent(int currentUserId)
        {
            return await _context.Users
                .Where(u => u.Id != currentUserId)
                .Select(u => new { u.Id, u.Username })
                .ToListAsync();
        }

        public async Task<User?> GetUserById(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }
    }
}
