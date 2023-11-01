using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.Model;
using Microsoft.Extensions.Logging; // Adicionado para ILogger
using DataAccessLayer.Interface;
using DataAccessLayer.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.EntityFrameworkCore;
using DataAccessLayer.Data;
using System.Net;

namespace eConsultas_API.Controllers
{
    [ApiController]
    [Route("[controller]/[Action]")]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IDecToken _decToken;
        private readonly ILoginInterface _loginRepository;
        private readonly ClinicaDbContext _context;

        public LoginController(ILogger<UsersController> logger, IDecToken decToken, ILoginInterface loginRepository, ClinicaDbContext context)
        {
            _logger = logger;
            _decToken = decToken;
            _loginRepository = loginRepository;
            _context = context;
        }


        /* Login Section */
        [HttpPost]
        public IActionResult Login([FromBody] LoginModel login)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var isLog = _loginRepository.logIn(login);
                    if (isLog != null)
                    {
                        return Ok(isLog);
                    }
                    else
                    {
                        return NotFound("Invalid user or password");
                    }
                }
                else
                    return NotFound("Invalid user or password");
            }
            catch (Exception)
            {
                throw;
            }
        }


        [UserAcess]
        [HttpPost]
        public IActionResult GetUserLogged([FromHeader(Name = "Authorization")] string authorizationHeader)
        {
            if (!string.IsNullOrEmpty(authorizationHeader))
            {
                // Extrai o token do cabeçalho
                string token = authorizationHeader.Substring("Bearer ".Length).Trim();
                if (!string.IsNullOrEmpty(token))
                {
                    return Ok(_decToken.GetLoggedUser(token));
                }
            }
            return BadRequest("Invalid token");
        }        
    }

}
