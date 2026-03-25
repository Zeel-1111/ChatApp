using Microsoft.AspNetCore.Mvc;
using ChatApplication.Entities;

namespace ChatApp.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_context.Users
                .Select(u => new { u.Id, u.Username })
                .ToList());
        }
    }
}