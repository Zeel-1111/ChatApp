using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ChatApplication.Entities;
using Microsoft.AspNetCore.Authorization;
using ChatApp.Services;

namespace ChatApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/messages")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetChatHistory(int userId)
        {
            var currentUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserIdStr) || !int.TryParse(currentUserIdStr, out int currentUserId))
            {
                return Unauthorized();
            }

            var messages = await _messageService.GetChatHistory(currentUserId, userId);
            return Ok(messages);
        }
    }
}
