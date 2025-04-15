using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MiPlanV.Domain.Common.Constants;
using MiPlanV.Domain.Entities;
using Microsoft.AspNetCore.Cors;

namespace MiPlanV.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowClient")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Email o contraseña inválidos" });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
        if (!result.Succeeded)
        {
            return Unauthorized(new { message = "Email o contraseña inválidos" });
        }

        // Generar token JWT
        var token = await GenerateJwtToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            Email = user.Email,
            UserId = user.Id,
            Name = user.Name,
            PhoneNumber = user.PhoneNumber,
            Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault()
        });
    }

    [HttpPost("google")]
    [EnableCors("AllowClient")]
    public async Task<ActionResult<AuthResponse>> GoogleLogin([FromBody] GoogleLoginRequest model)
    {
        try
        {
            _logger.LogInformation("Recibida solicitud de login con Google: {Email}", model.Email);
            
            // Validar el token de Google (en una implementación real deberías verificar el token)
            // Aquí asumimos que el token ya está validado y solo procesamos la información
            if (string.IsNullOrEmpty(model.Email))
            {
                _logger.LogWarning("Email no proporcionado en la solicitud");
                return BadRequest(new { message = "Email no proporcionado" });
            }

            var email = model.Email;
            var user = await _userManager.FindByEmailAsync(email);

            // Si el usuario no existe, lo creamos
            if (user == null)
            {
                _logger.LogInformation("Creando nuevo usuario con Google: {Email}", email);
                
                user = new User
                {
                    UserName = email,
                    Email = email,
                    Name = model.Name,
                    PhoneNumber = model.PhoneNumber,
                    EmailConfirmed = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogError("Error al crear usuario: {Errors}", errors);
                    return BadRequest(new { message = $"Error al crear el usuario con Google: {errors}" });
                }

                // Asignar rol de usuario por defecto
                await _userManager.AddToRoleAsync(user, Roles.User);
                _logger.LogInformation("Usuario creado correctamente: {UserId}", user.Id);
            }
            else
            {
                _logger.LogInformation("Usuario existente encontrado: {UserId}", user.Id);
            }

            // Generar token JWT
            var token = await GenerateJwtToken(user);
            _logger.LogInformation("Token JWT generado correctamente para el usuario {UserId}", user.Id);

            // Crear respuesta
            var response = new AuthResponse
            {
                Token = token,
                Email = user.Email,
                UserId = user.Id,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault()
            };
            
            _logger.LogInformation("Login con Google exitoso: {UserId}", user.Id);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en login con Google");
            return BadRequest(new { message = $"Error en la autenticación con Google: {ex.Message}" });
        }
    }

    [HttpPost("set-cookie")]
    public IActionResult SetCookie([FromBody] TokenRequest request)
    {
        if (string.IsNullOrEmpty(request.Token))
        {
            return BadRequest(new { message = "Token no proporcionado" });
        }

        // Configurar cookie segura
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Para producción y desarrollo con HTTPS
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"]))
        };

        Response.Cookies.Append("auth_token", request.Token, cookieOptions);
        return Ok(new { message = "Cookie establecida correctamente" });
    }

    [HttpPost("clear-cookie")]
    public IActionResult ClearCookie()
    {
        // Eliminar la cookie de autenticación
        Response.Cookies.Delete("auth_token");
        return Ok(new { message = "Cookie eliminada correctamente" });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // Implementar la lógica de revocación de tokens si es necesario
        // Esto podría incluir agregar el token a una lista negra, etc.
        
        // Eliminar la cookie de autenticación
        Response.Cookies.Delete("auth_token");
        
        return Ok(new { message = "Sesión cerrada correctamente" });
    }

    private async Task<string> GenerateJwtToken(User user)
    {
        var userRoles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
            new Claim(ClaimTypes.Email, user.Email)
        };

        // Agregar el teléfono como claim si existe
        if (!string.IsNullOrEmpty(user.PhoneNumber))
        {
            claims.Add(new Claim(ClaimTypes.MobilePhone, user.PhoneNumber));
        }

        // Agregar roles como claims
        foreach (var role in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["Jwt:ExpireDays"]));

        var token = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// Modelos para las solicitudes y respuestas
public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class GoogleLoginRequest
{
    public string Email { get; set; }
    public string Name { get; set; }
    public string GoogleId { get; set; }
    public string ImageUrl { get; set; }
    public string PhoneNumber { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; }
    public string Email { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string Role { get; set; }
}

public class TokenRequest
{
    public string Token { get; set; }
} 