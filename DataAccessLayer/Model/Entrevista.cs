using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Model
{
    public class Entrevista
    {

        public int Id { get; set; }
        public string Empresa { get; set; }
        public string DataPrimeiroContacto { get; set; }
        public string DataEntrevista { get; set; }
        public int VagaDisponivel { get; set; }
        public int AlunoId { get; set; }  // Chave estrangeira
        public Aluno Aluno { get; set; } // Propriedade de navegação
    }
}
