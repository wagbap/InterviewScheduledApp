using DataAccessLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DataAccessLayer.Repository.EntrevistaRepository;


namespace DataAccessLayer.Interface
{
    public interface IEntrevistaRepository
    {
        IEnumerable<Entrevista> GetAll();
        Entrevista GetById(int id);
        Entrevista Add(Entrevista entrevista, int alunoId);
        Entrevista Update(Entrevista entrevista, int alunoId);
        void Delete(int id);
        bool AlunoExists(int alunoId);
    }
}

