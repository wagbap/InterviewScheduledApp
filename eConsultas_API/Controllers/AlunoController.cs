using AutoMapper;
using DataAccessLayer.Model;
using DataAccessLayer.Repository;
using DataAccessLayer.Interface;
using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.Filters;

namespace eConsultas_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlunoController : ControllerBase
    {
        private readonly IAlunoRepository _alunoRepository;
        private readonly IMapper _mapper;
        private readonly IDecToken _decToken;

        public AlunoController(IAlunoRepository alunoRepository, IMapper mapper, IDecToken decToken)
        {
            _alunoRepository = alunoRepository;
            _mapper = mapper;
            _decToken = decToken;
        }

        [HttpGet]

        public IActionResult GetAll()
        {
            var alunos = _alunoRepository.GetAll();
            return Ok(alunos);
        }

        [HttpGet("{id}")]
  
        public IActionResult GetById(int id, [FromHeader(Name = "Authorization")] string authorizationHeader)
        {

            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
                return BadRequest("Invalid token");

            var token = authorizationHeader.Substring("Bearer ".Length).Trim();

            // Validar o modelo.
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Obter o usuário logado a partir do token.
            var loggedUser = _decToken.GetLoggedUser(token);
            if (loggedUser == null)
                return NotFound("Invalid user or password");

            var aluno = _alunoRepository.GetById(id);
            if (aluno == null)
            {
                return NotFound();
            }
            return Ok(aluno);
        }


        [HttpPost]
        [UserAcess]
        [PrivilegeUser("SuperAdmim")]
        public IActionResult CreateAluno(Aluno model, [FromHeader(Name = "Authorization")] string authorizationHeader)
        {
            // Verificar o cabeçalho de autorização.
            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
                return BadRequest("Invalid token");

            var token = authorizationHeader.Substring("Bearer ".Length).Trim();

            // Validar o modelo.
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Obter o usuário logado a partir do token.
            var loggedUser = _decToken.GetLoggedUser(token);
            if (loggedUser == null)
                return NotFound("Invalid user or password");

            try
            {
                _alunoRepository.Add(model);

                return Ok(new { message = "Aluno created" });
            }
            catch (Exception ex)
            {
                // Você pode querer logar a exceção aqui também.
                return BadRequest(new { message = $"An error occurred: {ex.Message}" });
            }
        }




        [HttpPut("{id}")]

    
        public IActionResult Update(int id, Aluno model, [FromHeader(Name = "Authorization")] string authorizationHeader)
        {

            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
                return BadRequest("Invalid token");

            var token = authorizationHeader.Substring("Bearer ".Length).Trim();

            // Validar o modelo.
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Obter o usuário logado a partir do token.
            var loggedUser = _decToken.GetLoggedUser(token);
            if (loggedUser == null)
                return NotFound("Invalid user or password");

            var existingAluno = _alunoRepository.GetById(id);
            if (existingAluno == null)
            {
                return NotFound(new { message = "Aluno not found" });
            }

            existingAluno.Nome = model.Nome;
            existingAluno.Status = model.Status;
            existingAluno.Resultado = model.Resultado;
            existingAluno.NumeroEntrevisPorPessoa = model.NumeroEntrevisPorPessoa;

            _alunoRepository.Update(existingAluno);
            return Ok(new { message = "Aluno updated" });
        }


        [HttpDelete("{id}")]
 
  
        public IActionResult Delete(int id, [FromHeader(Name = "Authorization")] string authorizationHeader)
        {

            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
                return BadRequest("Invalid token");

            var token = authorizationHeader.Substring("Bearer ".Length).Trim();

            // Validar o modelo.
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Obter o usuário logado a partir do token.
            var loggedUser = _decToken.GetLoggedUser(token);
            if (loggedUser == null)
                return NotFound("Invalid user or password");

            _alunoRepository.Delete(id);
            return Ok(new { message = "Aluno deleted" });
        }
    }
}
