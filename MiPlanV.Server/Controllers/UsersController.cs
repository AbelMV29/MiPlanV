using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiPlanV.Application.Users.Commands;
using MiPlanV.Application.Users.Queries;
using MiPlanV.Domain.Common.Constants;
using MiPlanV.Domain.Entities;
using System.Security.Claims;
using Microsoft.Extensions.Primitives;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace MiPlanV.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IMediator mediator, ILogger<UsersController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = Roles.Admin, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<IEnumerable<User>>> GetAll()
    {
        try {
            var users = await _mediator.Send(new GetAllUsersQuery());
            return Ok(users);
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Error al obtener usuarios");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<User>> GetById(int id)
    {
        var user = await _mediator.Send(new GetUserByIdQuery { Id = id });
        return Ok(user);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<User>> Create([FromBody] CreateUserCommand command)
    {
        try
        {
            var user = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        catch (UserAlreadyExistsException ex)
        {
            _logger.LogInformation($"Intento de registro con email ya existente: {command.Email}");
            return BadRequest(new { message = ex.Message, code = "UserAlreadyExists" });
        }
        catch (UserReactivatedException ex)
        {
            _logger.LogInformation($"Usuario reactivado: {command.Email}");
            return BadRequest(new { message = ex.Message, code = "UserReactivated" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al crear usuario con email {command.Email}");
            return StatusCode(500, new { message = "Error al crear el usuario", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult<User>> Update(int id, [FromBody] UpdateUserCommand command)
    {
        if (id != command.Id)
            return BadRequest("El ID de la URL no coincide con el ID del usuario");

        var user = await _mediator.Send(command);
        return Ok(user);
    }

    [HttpDelete("{id}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteUserCommand { Id = id });
        return NoContent();
    }
} 