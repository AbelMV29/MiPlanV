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
using Microsoft.AspNetCore.Authorization;

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
        try
        {
            _logger.LogInformation($"Intento de login para email: {model.Email}");
            
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                _logger.LogWarning("Intento de login con email o contraseña vacíos");
                return BadRequest(new { message = "Email y contraseña son requeridos" });
            }
            
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                _logger.LogWarning($"Intento de login fallido: usuario no encontrado para {model.Email}");
                return Unauthorized(new { message = "Email o contraseña inválidos" });
            }

            if (!user.IsActive)
            {
                _logger.LogWarning($"Intento de login fallido: usuario inactivo {model.Email}");
                return Unauthorized(new { message = "La cuenta está desactivada" });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
            {
                _logger.LogWarning($"Intento de login fallido: contraseña incorrecta para {model.Email}");
                return Unauthorized(new { message = "Email o contraseña inválidos" });
            }

            // Generar token JWT
            var token = await GenerateJwtToken(user);
            _logger.LogInformation($"Login exitoso para {model.Email}, token generado");

            var roles = await _userManager.GetRolesAsync(user);
            _logger.LogInformation($"Roles del usuario {model.Email}: {string.Join(", ", roles)}");

            // Respuesta con información del usuario y el token
            var response = new AuthResponse
            {
                Token = token,
                Email = user.Email,
                UserId = user.Id,
                Name = user.Name,
                PhoneNumber = user.PhoneNumber,
                Role = roles.FirstOrDefault()
            };
            
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error inesperado en login para {model.Email}: {ex.Message}");
            return StatusCode(500, new { message = "Error en el servidor. Por favor intente más tarde." });
        }
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

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        // En una implementación real, puedes agregar el token a una lista negra
        // o implementar una estrategia para revocar tokens si es necesario
        
        return Ok(new { message = "Sesión cerrada correctamente" });
    }

    [HttpGet("verify-token")]
    [AllowAnonymous]
    public IActionResult VerifyToken()
    {
        try
        {
            // Obtener el token del header Authorization
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            string token = null;

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = authHeader.Substring("Bearer ".Length).Trim();
                _logger.LogInformation("Token obtenido del header Authorization");
            }

            if (string.IsNullOrEmpty(token))
            {
                _logger.LogWarning("No se encontró token en el request");
                return BadRequest(new { message = "No se encontró token en la solicitud" });
            }

            // Configurar los parámetros de validación
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]))
            };

            // Validar y decodificar el token
            var handler = new JwtSecurityTokenHandler();
            var principal = handler.ValidateToken(token, validationParameters, out var validatedToken);
            
            var jwtToken = (JwtSecurityToken)validatedToken;
            
            // Establecer el principal de autenticación en el contexto HTTP
            HttpContext.User = principal;
            
            // Extraer información del token
            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = principal.FindFirst(ClaimTypes.Email)?.Value;
            var name = principal.FindFirst(ClaimTypes.Name)?.Value;
            var roles = principal.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            var expirationDate = jwtToken.ValidTo;

            return Ok(new
            {
                isValid = true,
                isAuthenticated = true,
                userId,
                email,
                name,
                roles,
                expiresAt = expirationDate,
                isExpired = DateTime.UtcNow > expirationDate
            });
        }
        catch (SecurityTokenExpiredException)
        {
            _logger.LogWarning("Token JWT expirado");
            return Unauthorized(new { message = "El token ha expirado" });
        }
        catch (SecurityTokenInvalidSignatureException)
        {
            _logger.LogWarning("Firma del token JWT inválida");
            return Unauthorized(new { message = "La firma del token es inválida" });
        }
        catch (SecurityTokenException ex)
        {
            _logger.LogWarning(ex, "Token JWT inválido");
            return Unauthorized(new { message = $"Token inválido: {ex.Message}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al verificar el token");
            return StatusCode(500, new { message = $"Error al verificar el token: {ex.Message}" });
        }
    }

    [HttpGet("whoami")]
    [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
    public IActionResult WhoAmI()
    {
        try
        {
            if (User?.Identity == null || !User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "No autenticado" });
            }

            var claims = User.Claims.ToDictionary(c => c.Type, c => c.Value);
            var roles = User.Claims
                .Where(c => c.Type == ClaimTypes.Role || c.Type == "role")
                .Select(c => c.Value)
                .Distinct()
                .ToList();

            return Ok(new
            {
                userName = User.Identity.Name,
                userId = User.FindFirstValue(ClaimTypes.NameIdentifier),
                email = User.FindFirstValue(ClaimTypes.Email),
                isAuthenticated = User.Identity.IsAuthenticated,
                authenticationType = User.Identity.AuthenticationType,
                roles = roles,
                isAdmin = User.IsInRole("Admin"),
                claims = claims
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en whoami: {Message}", ex.Message);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    private async Task<string> GenerateJwtToken(User user)
    {
        var userRoles = await _userManager.GetRolesAsync(user);
        // Eliminar posibles duplicados en los roles
        userRoles = userRoles.Distinct().ToList();

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

        // Agregar roles como claims usando el formato específico que se usa en TokenValidationParameters
        foreach (var role in userRoles)
        {
            // Asegurarse de que se usa el formato correcto para roles
            claims.Add(new Claim(ClaimTypes.Role, role));
            
            // Para compatibilidad, también añadir en el formato simple
            claims.Add(new Claim("role", role));
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