using Microsoft.AspNetCore.Mvc;
using ChatApplication.Entities;
using ChatApp.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ChatApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int currentUserId))
            {
                return Unauthorized();
            }

            var users = await _userService.GetAllUsersExceptCurrent(currentUserId);
            return Ok(users);
        }
    }
}