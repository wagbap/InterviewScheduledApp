using DataAccessLayer.Data;
using DataAccessLayer.Data.Enum;
using DataAccessLayer.Filters;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Numerics;
using System.Security.Claims;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace DataAccessLayer.Repository
{
    public class UserRepository : IUserInterface
    {
        private readonly ClinicaDbContext _context;
        private readonly string _secretKey;
        private readonly SymmetricSecurityKey _signingKey;
        private readonly IGenTokenFilter _genTokenFilter;
        private readonly IDecToken _decToken;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(ILogger<UserRepository> logger, ClinicaDbContext context, IGenTokenFilter genTokenFilter, IDecToken decToken)
        {
            _context = context;
            _genTokenFilter = genTokenFilter;
            _secretKey = _genTokenFilter.GenerateRandomSecretKey(32);
            _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secretKey));
            _decToken = decToken;
            _logger = logger;
        }


        public T AddUser<T>(T user) where T : UserModel
        {
            // Check if a user with the same email already exists
            if (_context.Users.Any(u => u.Email == user.Email))
            {
                throw new ArgumentException("Email already exists.");
            }

            user.CreationDate = DateTime.Now;
            user.Status = 1;
            user.SetPasswordHash();
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        // Delete user
        public bool DeleteUser<T>(int id) where T : UserModel
        {
            var user = _context.Users.OfType<T>().FirstOrDefault(x => x.UserId == id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        // Get all users
        public List<T> GetAllUsers<T>() where T : UserModel
        {
            return _context.Users.OfType<T>().ToList();
        }

        // Get user by ID
        public T GetUserById<T>(int id) where T : UserModel
        {
            return _context.Users.OfType<T>().FirstOrDefault(x => x.UserId == id);
        }

        // Get user by email
        public T GetUserByEmail<T>(string email) where T : UserModel
        {
            return _context.Users.OfType<T>().FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }

        // Update user
        public T UpdateUser<T>(T user) where T : UserModel
        {
            var existingUser = GetUserById<T>(user.UserId);

            if (existingUser == null)
            {
                throw new ArgumentException($"User with ID {user.UserId} not found.");
            }

            // Using reflection to copy matching property values (be aware this might not be the most efficient way)
            foreach (var property in typeof(T).GetProperties())
            {
                if (property.Name != "UserId" && property.CanWrite && property.Name != "Password")
                {
                    property.SetValue(existingUser, property.GetValue(user));
                }
            }

            existingUser.DateATT = DateTime.Now;

            _context.SaveChanges();

            return existingUser;
        }
    }
}
