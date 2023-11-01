using DataAccessLayer.Data;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using System.Collections.Generic;
using System.Linq;

namespace DataAccessLayer.Repository
{
    public class EntrevistaRepository : IEntrevistaRepository
    {
        private readonly ClinicaDbContext _context;

        public EntrevistaRepository(ClinicaDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Entrevista> GetAll()
        {
            return _context.Entrevistas.ToList();
        }

        public Entrevista GetById(int id)
        {
            return _context.Entrevistas.Find(id);
        }

        public bool AlunoExists(int alunoId)
        {
            return _context.Alunos.Any(a => a.Id == alunoId);
        }     
        public Entrevista Add(Entrevista entrevista, int alunoId)
        {
            entrevista.AlunoId = alunoId; // Associando o Entrevista ao AlunoId fornecido
            _context.Entrevistas.Add(entrevista);
            _context.SaveChanges();
            return entrevista;
        }
        public Entrevista Update(Entrevista entrevista, int alunoId)
        {
            var existingEntrevista = _context.Entrevistas.Find(entrevista.Id);
            if (existingEntrevista == null)
                throw new Exception("Entrevista not found");

            if (existingEntrevista.AlunoId != alunoId)
                throw new Exception("Mismatched AlunoId");

            // Aqui, você pode adicionar qualquer lógica de mapeamento necessário
            // Por exemplo:
            existingEntrevista.Empresa = entrevista.Empresa;
            existingEntrevista.DataPrimeiroContacto = entrevista.DataPrimeiroContacto;
            existingEntrevista.DataEntrevista = entrevista.DataEntrevista;
            existingEntrevista.VagaDisponivel = entrevista.VagaDisponivel;
            existingEntrevista.NumerodeEntrevistaFeitas = entrevista.NumerodeEntrevistaFeitas;

            _context.SaveChanges();

            return existingEntrevista;
        }


        public void Delete(int id)
        {
            var entrevista = GetById(id);
            if (entrevista != null)
            {
                _context.Entrevistas.Remove(entrevista);
                _context.SaveChanges();
            }
        }
    }
}
