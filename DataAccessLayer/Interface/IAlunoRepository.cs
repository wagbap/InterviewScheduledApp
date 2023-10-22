using DataAccessLayer.Model;
using System.Collections.Generic;

namespace DataAccessLayer.Interface
{
    public interface IAlunoRepository
    {
        IEnumerable<Aluno> GetAll();
        Aluno GetById(int id);  
        Aluno Add(Aluno aluno);
        void Update(Aluno aluno);
        void Delete(int id);
    }
}
