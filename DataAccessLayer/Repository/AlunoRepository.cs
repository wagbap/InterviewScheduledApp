using AutoMapper;
using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Repository
{
    public class AlunoRepository : IAlunoRepository
    {
        private readonly ClinicaDbContext _context;
        private readonly IMapper _mapper;

        public AlunoRepository(ClinicaDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public IEnumerable<Aluno> GetAll()
        {
            return _context.Alunos.ToList();
        }

        public Aluno GetById(int id)
        {
            return _context.Alunos.Find(id);
        }

        public Aluno Add(Aluno aluno)
        {
            _context.Alunos.Add(aluno);
            _context.SaveChanges();
            return aluno;
        }

        public void Update(int id, Aluno updatedAluno)
        {
            var aluno = GetAluno(id);
            // Aqui você pode atualizar os campos do aluno com os do updatedAluno usando o _mapper ou manualmente, por exemplo:
            // aluno.Nome = updatedAluno.Nome;
            _context.Alunos.Update(aluno);
            _context.SaveChanges();
        }

        public void Update(Aluno aluno)
        {
            _context.Alunos.Update(aluno);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var aluno = GetAluno(id);
            _context.Alunos.Remove(aluno);
            _context.SaveChanges();
        }

        private Aluno GetAluno(int id)
        {
            var aluno = _context.Alunos.FirstOrDefault(u => u.Id == id);
            if (aluno == null) throw new KeyNotFoundException("Aluno not found");
            return aluno;
        }
    }
}
