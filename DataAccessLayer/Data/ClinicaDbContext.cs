using DataAccessLayer.Data.Enum;
using DataAccessLayer.Filters;
using DataAccessLayer.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Data
{
    public class ClinicaDbContext : DbContext
    {
        public ClinicaDbContext()
        {

        }
        public ClinicaDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


        //    modelBuilder.Entity<UserModel>().HasData(
        //    new UserModel
        //    {
        //        UserId = 0,
        //        Email = "superadmin@example.com",
        //        Password = "SuperSecurePassword".GerarHash(),
        //        UserType = UserTypeEnum.SuperAdmim,  
        //        Status = 1, 
        //        CreationDate = DateTime.UtcNow,
        //        DateATT = DateTime.UtcNow
        //    }
        //);

   


        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Obtenha a string de conexão do arquivo de configuração específico do DAL 
                var connectionString = "Data Source=LAPTOP-D8T7SBRN;Initial Catalog=Entrevista-Estagio;Trusted_Connection=True;TrustServerCertificate=True;"; //cn martelado
                //var connectionString = DalConfiguration.ConnectionString; // cn dinâmico
                optionsBuilder.UseSqlServer(connectionString);
            }
        }


        // Meus dbSets
        public DbSet<UserModel> Users { get; set; }
        public DbSet<Aluno> Alunos { get; set; }
        public DbSet<Entrevista> Entrevistas { get; set; }

    }
}
