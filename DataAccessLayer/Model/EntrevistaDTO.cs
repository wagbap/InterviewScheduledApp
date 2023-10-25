using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Model
{
    public class EntrevistaDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo Empresa é obrigatório.")]
        [StringLength(100, ErrorMessage = "O campo Empresa não deve exceder 100 caracteres.")]
        public string Empresa { get; set; }

        [Required(ErrorMessage = "O campo DataPrimeiroContacto é obrigatório.")]
        public DateTime DataPrimeiroContacto { get; set; }

        [Required(ErrorMessage = "O campo DataEntrevista é obrigatório.")]
        public DateTime DataEntrevista { get; set; }

        [Required(ErrorMessage = "O campo NumerodeEntrevistaFeitas é obrigatório.")]
        public int NumerodeEntrevistaFeitas { get; set; }

        [Required(ErrorMessage = "O campo VagaDisponivel é obrigatório.")]
        public int VagaDisponivel { get; set; }
        public int? AlunoId { get; set; }
    }
}
