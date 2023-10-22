﻿using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System;
using System.IO;

namespace DataAccessLayer.Filters
{
    /*Interface*/
    public interface IGenTokenFilter
    {
        string GenerateRandomSecretKey(int length);
        string GenerateToken(UserModel user);
    }

    /* implementation  */
    public class GenTokenFilter : IGenTokenFilter
    {
        private IConfiguration _configuration;

        public GenTokenFilter(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /*Generate Secret key*/
        public string GenerateRandomSecretKey(int length)
        {
            const string validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            StringBuilder sb = new StringBuilder();
            Random random = new Random();

            for (int i = 0; i < length; i++)
            {
                int index = random.Next(validChars.Length);
                sb.Append(validChars[index]);
            }
            return sb.ToString();
        }

        /*Generate Token*/
        public string GenerateToken(UserModel user)
        {
            if (user != null)
            {
                // Utiliza a chave do appsettings.json
                string signingKey = _configuration["Jwt:Key"];

                var claims = new[]
                {
            new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Email),
            new Claim("UserId", user.UserId.ToString()),
            new Claim("FullName", user.FullName),
            new Claim("UserType", user.UserType.ToString())
        };

                var signIn = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)), SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    _configuration["Jwt:Issuer"],
                    _configuration["Jwt:Audience"],
                    claims,
                     expires: DateTime.UtcNow.AddMinutes(50),
                    signingCredentials: signIn);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            else
            {
                return null;
            }
        }


        /* Update secret key on appseting */
        public bool UpdateJwtKey(string appSettingsPath, string newKey)
        {
            try
            {
                // Carrega o arquivo appsettings.json
                string json = File.ReadAllText(appSettingsPath);

                // Converte o JSON em um objeto JObject
                JObject appSettings = JObject.Parse(json);

                // Atualiza o valor da chave Jwt:Key
                appSettings["Jwt"]["Key"] = newKey;

                string updatedJson = appSettings.ToString(Formatting.Indented);
                File.WriteAllText(appSettingsPath, updatedJson);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}
