using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Model
{
    public class Aluno
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Status { get; set; } // Consider renaming to avoid confusion with UserModel's Status
        public string Resultado { get; set; }
        public int NumeroEntrevisPorPessoa { get; set; }

    }
}
