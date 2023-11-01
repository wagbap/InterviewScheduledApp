using AutoMapper;
using DataAccessLayer.Interface;
using DataAccessLayer.Model;
using DataAccessLayer.Repository;
using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.Filters;
using DataAccessLayer.Data;
using Newtonsoft.Json.Linq;

namespace eConsultas_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntrevistaController : ControllerBase
    {
        private readonly IEntrevistaRepository _entrevistaRepository;
        private readonly IMapper _mapper;
        private readonly IDecToken _decToken;

        public EntrevistaController(IEntrevistaRepository entrevistaRepository, IMapper mapper, IDecToken decToken)
        {
            _entrevistaRepository = entrevistaRepository;
            _mapper = mapper;
            _decToken = decToken;
        }

        [HttpGet]
  
      
        public IActionResult GetAll()
        {
            return Ok(_entrevistaRepository.GetAll());
        }

        [UserAcess]
        [PrivilegeUser("Aluno")]
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

            var entrevista = _entrevistaRepository.GetById(id);
            if (entrevista == null)
            {
                return NotFound();
            }
            return Ok(entrevista);
        }


        [HttpPost]
        [UserAcess]
        [PrivilegeUser("Aluno")]
        public IActionResult CreateEntrevista(int alunoId, [FromBody] EntrevistaDTO model, [FromHeader(Name = "Authorization")] string authorizationHeader)
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

            // Verificar se o aluno existe.
            if (!_entrevistaRepository.AlunoExists(alunoId))
                return BadRequest("Aluno does not exist.");

            // Verificar se o alunoId fornecido corresponde ao ID do usuário logado.
            if (loggedUser.UserId != alunoId) // Assumindo que seu objeto 'loggedUser' tenha uma propriedade 'Id'.
                return Unauthorized("Você não tem permissão para adicionar uma entrevista a outro aluno.");

            try
            {
                // Mapear o modelo para a entidade e adicionar a entrevista.
                var entrevista = _mapper.Map<Entrevista>(model);
                _entrevistaRepository.Add(entrevista, alunoId);

                return Ok(new { message = "Entrevista created" });
            }
            catch (Exception ex)
            {
                // Você pode querer logar a exceção aqui também.
                return BadRequest(new { message = $"An error occurred: {ex.Message}" });
            }
        }






        [UserAcess]
        [PrivilegeUser("Aluno")]

        [HttpPut]
        public IActionResult Update(int alunoId, int id, [FromBody] EntrevistaDTO model, [FromHeader(Name = "Authorization")] string authorizationHeader)    
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

    
        [PrivilegeUser("Aluno")]
        [UserAcess]
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

            _entrevistaRepository.Delete(id);
            return Ok(new { message = "Entrevista deleted" });
        }
    }
}
