using DataAccessLayer.Data;
using DataAccessLayer.Filters;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Repository
{
    public class LoginRepository : ILoginInterface
    {
        private readonly ClinicaDbContext _context;
        private readonly IGenTokenFilter _genTokenFilter;
        private readonly IConfiguration _configuration;

        public LoginRepository(ClinicaDbContext context, IGenTokenFilter genTokenFilter, IConfiguration configuration)
        {
            _context = context;
            _genTokenFilter = genTokenFilter;
            _configuration = configuration;
        }

        /*Login*/
        public string logIn(LoginModel login)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(x => x.Email.ToLower() == login.Email.ToLower());

                if (user != null && user.PasswordIsValid(login.Password) && user.Status == 1)
                {
                    return _genTokenFilter.GenerateToken(user);
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }  
    }
}
