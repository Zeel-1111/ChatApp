using Microsoft.AspNetCore.Mvc;
using ChatApplication.Entities;
using ChatApp.Services;

namespace ChatApp.Controllers
{
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
            var users = await _userService.GetAllUsersExceptCurrent(0);
            return Ok(users);
        }
    }
}