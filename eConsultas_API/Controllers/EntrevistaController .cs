using AutoMapper;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using DataAccessLayer.Repository;
using Microsoft.AspNetCore.Mvc;

namespace eConsultas_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntrevistaController : ControllerBase
    {
        private readonly IEntrevistaRepository _entrevistaRepository;
        private readonly IMapper _mapper;

        public EntrevistaController(IEntrevistaRepository entrevistaRepository, IMapper mapper)
        {
            _entrevistaRepository = entrevistaRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_entrevistaRepository.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var entrevista = _entrevistaRepository.GetById(id);
            if (entrevista == null)
            {
                return NotFound();
            }
            return Ok(entrevista);
        }

        [HttpPost]
        public IActionResult Create(int alunoId, [FromBody] EntrevistaDTO model)
        {
            if (!_entrevistaRepository.AlunoExists(alunoId))
            {
                return BadRequest("Aluno does not exist.");
            }

            var entrevista = _mapper.Map<Entrevista>(model);
            _entrevistaRepository.Add(entrevista, alunoId);

            return Ok(new { message = "Entrevista created" });
        }


        [HttpPut]
        public IActionResult Update(int alunoId, int id, [FromBody] EntrevistaDTO model)
        {
            if (!_entrevistaRepository.AlunoExists(alunoId))
            {
                return BadRequest("Aluno does not exist.");
            }

            if (id != model.Id)
            {
                return BadRequest("Mismatched EntrevistaId");
            }

            var entrevista = _mapper.Map<Entrevista>(model);
            _entrevistaRepository.Update(entrevista, alunoId);

            return Ok(new { message = "Entrevista updated" });
        }


        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _entrevistaRepository.Delete(id);
            return Ok(new { message = "Entrevista deleted" });
        }
    }
}
