using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiPlanV.Domain.Entities;
using MiPlanV.Application.PackedLunches.Commands.CreatePackedLunch;
using MiPlanV.Application.PackedLunches.Commands.UpdatePackedLunch;
using MiPlanV.Application.PackedLunches.Commands.DeletePackedLunch;
using MiPlanV.Application.PackedLunches.Queries.GetAllPackedLunches;
using MiPlanV.Application.PackedLunches.Queries.GetByIdPacketLunch;
using MiPlanV.Application.Common.Dtos;
using MiPlanV.Application.PackedLunches.Queries.GetCurrentsPackedLunchs;

namespace MiPlanV.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackedLunchesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PackedLunchesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Crea una nueva vianda con los datos proporcionados.
        /// </summary>
        /// <param name="command">Datos de la vianda a crear, incluyendo una imagen.</param>
        /// <param name="cancellationToken">Token de cancelación para la operación.</param>
        /// <returns>Respuesta de éxito si la vianda se creó correctamente.</returns>
        /// <response code="200">La vianda se creó exitosamente.</response>
        /// <response code="400">Si los datos proporcionados son inválidos.</response>
        /// <response code="499">Si el usuario cierra la conexión antes de tiempo.</response>
        /// <response code="500">Si ocurre un error interno del servidor.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromForm] CreatePackedLunchCommand command, CancellationToken cancellationToken)
        {
            try
            {
                PackedLunch packedLunch = await _mediator.Send(command, cancellationToken);
                return CreatedAtAction(nameof(GetById), new { id = packedLunch.Id }, packedLunch);
            }
            catch (OperationCanceledException)
            {
                return StatusCode(499); // El cliente cierra la conexión
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Obtiene todas las viandas disponibles según los filtros de búsqueda especificados.
        /// </summary>
        /// <param name="request">Parámetros opcionales de búsqueda para filtrar las viandas.</param>
        /// <returns>Lista de viandas que coinciden con los criterios de búsqueda.</returns>
        /// <response code="200">Retorna la lista de viandas encontradas.</response>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<PackedLunch>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllPackedLunchsQuery request)
        {
            PaginatedList<PackedLunch> packedLunches = await _mediator.Send(request);
            return Ok(packedLunches);
        }

        /// <summary>
        /// Obtiene todas las viandas de la semana activa.
        /// </summary>
        /// <returns>Lista de viandas actvias</returns>
        /// <response code="200">Retorna la lista de viandas encontradas.</response>
        [HttpGet("current")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<PackedLunch>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCurrents([FromQuery] GetCurrentsPackedLunchesQuery request)
        {
            GetCurrentsPackedLunchesResponse[] packedLunches = await _mediator.Send(request);
            return Ok(packedLunches);
        }

        /// <summary>
        /// Obtiene una vianda específica por su identificador único.
        /// </summary>
        /// <param name="request">Identificador único de la vianda a buscar.</param>
        /// <returns>La vianda encontrada.</returns>
        /// <response code="200">Retorna la vianda solicitada.</response>
        /// <response code="404">Si no se encuentra la vianda con el ID especificado.</response>
        /// <response code="500">Si ocurre un error interno del servidor.</response>
        [HttpGet("{Id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(PackedLunch), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetById([FromRoute] GetByIdPackedLunchQuery request)
        {
            try
            {
                PackedLunch packedLunch = await _mediator.Send(request);
                return Ok(packedLunch);
            }
            catch(InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Actualiza una vianda existente con los nuevos datos proporcionados.
        /// </summary>
        /// <param name="id">Identificador único de la vianda a actualizar.</param>
        /// <param name="command">Datos actualizados de la vianda.</param>
        /// <returns>La vianda actualizada.</returns>
        /// <response code="200">La vianda se actualizó exitosamente.</response>
        /// <response code="400">Si los datos proporcionados son inválidos o el ID no coincide.</response>
        /// <response code="404">Si no se encuentra la vianda con el ID especificado.</response>
        /// <response code="499">Si el usuario cierra la conexión antes de tiempo.</response>
        /// <response code="500">Si ocurre un error interno del servidor.</response>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(PackedLunch), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Update(int id, [FromForm] UpdatePackedLunchCommand command, CancellationToken cancellationToken)
        {
            if (id != command.Id)
                return BadRequest("El ID de la URL no coincide con el ID de la vianda");

            try
            {
                var packedLunch = await _mediator.Send(command, cancellationToken);
                return Ok(packedLunch);
            }
            catch (OperationCanceledException)
            {
                return StatusCode(499); // El cliente cierra la conexión
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Elimina una vianda específica por su identificador único.
        /// </summary>
        /// <param name="id">Identificador único de la vianda a eliminar.</param>
        /// <returns>Respuesta de éxito si la vianda se eliminó correctamente.</returns>
        /// <response code="204">La vianda se eliminó exitosamente.</response>
        /// <response code="499">Si el usuario cierra la conexión antes de tiempo.</response>
        /// <response code="500">Si ocurre un error interno del servidor.</response>
        [HttpDelete("{Id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete([FromRoute] DeletePackedLunchCommand request, CancellationToken cancellationToken)
        {
            try
            {
                await _mediator.Send(request, cancellationToken);
                return NoContent();
            }
            catch (OperationCanceledException)
            {
                return StatusCode(499); // El cliente cierra la conexión
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}