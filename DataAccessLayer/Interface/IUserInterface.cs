using DataAccessLayer.Data.Enum;
using DataAccessLayer.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Interface
{
    public interface IUserInterface
    {

        T AddUser<T>(T user) where T : UserModel;
        bool DeleteUser<T>(int id) where T : UserModel;
        List<T> GetAllUsers<T>() where T : UserModel;
        T GetUserById<T>(int id) where T : UserModel;
        T GetUserByEmail<T>(string email) where T : UserModel;
        T UpdateUser<T>(T user) where T : UserModel;


    }


}