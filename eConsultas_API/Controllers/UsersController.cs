using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.Model;
using Microsoft.Extensions.Logging; // Adicionado para ILogger
using DataAccessLayer.Interface;
using DataAccessLayer.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using DataAccessLayer.Data.Enum;
using static System.Net.Mime.MediaTypeNames;
using System.Numerics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using Newtonsoft.Json.Linq;
using System.Net;
using DataAccessLayer.Repository;

namespace eConsultas_API.Controllers
{

    [ApiController]
    [Route("[controller]/[Action]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IUserInterface _userRepository;
        private readonly IDecToken _decToken;
  

        public UsersController(ILogger<UsersController> logger, IUserInterface userRepository, IDecToken decToken)
        {
            _logger = logger;
            _userRepository = userRepository;
            _decToken = decToken;
        }

        /* User Section */

        [HttpGet]
        [PrivilegeUser("SuperAdmin")]
        [UserAcess]
        public IActionResult GetUserById(int userId)
        {
            return Ok(_userRepository.GetUserById<UserModel>(userId));
        }

        [HttpGet]
        public IActionResult GetAllUsers([FromHeader(Name = "Authorization")] string authorizationHeader)
        {
            return Ok(_userRepository.GetAllUsers<UserModel>());
        }

        [HttpPost]
        [PrivilegeUser("SuperAdmin")]
        [UserAcess]
        public IActionResult AddUser([FromBody] UserModel user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    user.UserType = UserTypeEnum.SuperAdmim; // Assuming UserTypeEnum has a User type
                    _userRepository.AddUser(user);
                    return Ok(new { message = "User created" });
                }
                else
                {
                    return BadRequest("Bad request");
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

  

        [HttpGet]
        [PrivilegeUser("SuperAdmin")]
        public IActionResult GetUserByEmail(string email)
        {
            return Ok(_userRepository.GetUserByEmail<UserModel>(email));
        }

        [HttpPost]
        [PrivilegeUser("User")]
        public IActionResult UpdateUser([FromBody] UserModel user)
        {
            var existingUser = _userRepository.GetUserById<UserModel>(user.UserId);
            if (existingUser == null)
            {
                return NotFound();
            }

            return Ok(_userRepository.UpdateUser(user));
        }


        [HttpDelete]
        [PrivilegeUser("SuperAdmin")]
        public IActionResult DeleteUser(int userId)
        {
            if (!_userRepository.DeleteUser<UserModel>(userId))
            {
                return NotFound();
            }

            return Ok();
        }



    }


}
