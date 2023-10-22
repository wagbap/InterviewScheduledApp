using AutoMapper;
using DataAccessLayer.Model;
using DataAccessLayer.Repository;
using DataAccessLayer.Interface;
using Microsoft.AspNetCore.Mvc;

namespace eConsultas_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlunoController : ControllerBase
    {
        private readonly IAlunoRepository _alunoRepository;
        private readonly IMapper _mapper;

        public AlunoController(IAlunoRepository alunoRepository, IMapper mapper)
        {
            _alunoRepository = alunoRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var alunos = _alunoRepository.GetAll();
            return Ok(alunos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var aluno = _alunoRepository.GetById(id);
            if (aluno == null)
            {
                return NotFound();
            }
            return Ok(aluno);
        }

        [HttpPost]
        public IActionResult CreateEntrevista(Aluno model)
        {
            _alunoRepository.Add(model); // Supondo que seu método seja Add e não Create
            return Ok(new { message = "Aluno created" });
        }


        [HttpPut("{id}")]
        public IActionResult Update(int id, Aluno model)
        {
            var existingAluno = _alunoRepository.GetById(id);
            if (existingAluno == null)
            {
                return NotFound(new { message = "Aluno not found" });
            }

            existingAluno.Nome = model.Nome;
            existingAluno.Status = model.Status;
            existingAluno.Resultado = model.Resultado;

            _alunoRepository.Update(existingAluno);
            return Ok(new { message = "Aluno updated" });
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _alunoRepository.Delete(id);
            return Ok(new { message = "Aluno deleted" });
        }
    }
}
