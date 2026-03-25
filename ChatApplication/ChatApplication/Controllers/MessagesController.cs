using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ChatApplication.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ChatApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/messages")]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetChatHistory(int userId)
        {
            var currentUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdStr) || !int.TryParse(currentUserIdStr, out int currentUserId))
            {
                return Unauthorized();
            }

            var messages = await _context.Messages
                .Where(m => (m.SenderId == currentUserId && m.ReceiverId == userId) ||
                            (m.SenderId == userId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    senderId = m.SenderId,
                    content = m.Content,
                    createdAt = m.CreatedAt,
                    isMe = m.SenderId == currentUserId
                })
                .ToListAsync();

            return Ok(messages);
        }
    }
}
