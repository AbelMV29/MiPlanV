using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Infrastructure.Identity;
using MiPlanV.Infrastructure.Repository.Common;
using MiPlanV.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var services = builder.Services;

services.AddControllers();

// Configuración de Swagger con soporte para JWT
services.AddEndpointsApiExplorer();
services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MiPlanV API",
        Version = "v1",
        Description = "API para MiPlanV - Plataforma de comidas veganas"
    });

    // Definir el esquema de seguridad JWT
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando el esquema Bearer. Ejemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configurar JWT para mostrar errores más detallados en caso de fallos en la validación del token
var jwtBearerOptions = new JwtBearerOptions
{
    TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,      // Deshabilitar validación del emisor
        ValidateAudience = false,    // Deshabilitar validación de audiencia
        ValidateLifetime = true,     // Mantener validación de tiempo de vida
        ValidateIssuerSigningKey = true,  // Validar clave de firma
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        // Especificar explícitamente el tipo de claim para roles
        RoleClaimType = ClaimTypes.Role, // Usar formato estándar
        NameClaimType = ClaimTypes.Name,
        // Permitir un pequeño margen de tiempo para evitar problemas de sincronización
        ClockSkew = TimeSpan.FromMinutes(5),
        // Configuración avanzada para mejorar la compatibilidad
        RequireSignedTokens = true,
        RequireExpirationTime = true
    }
};

// Configurar servicios de autenticación JWT
services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    
    // Deshabilitar cualquier otro esquema
    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultForbidScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = jwtBearerOptions.TokenValidationParameters;
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    
    // Agregar eventos de debugging para ver qué está pasando con la autenticación
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Obtener token solo del header Authorization
            string authorization = context.Request.Headers["Authorization"];
            
            if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                context.Token = authorization.Substring("Bearer ".Length).Trim();
            }
            
            return Task.CompletedTask;
        },
        
        OnTokenValidated = context =>
        {
            // Verificar explícitamente que el principal tiene la identidad correcta
            if (context.Principal?.Identity != null)
            {
                if (context.Principal.Identity is ClaimsIdentity claimsIdentity)
                {                    
                    // Asegurarse de que el contexto HTTP tenga el principal
                    if (context.HttpContext != null)
                    {
                        context.HttpContext.User = context.Principal;
                        
                        // Esto es clave: Establecer explícitamente la autenticación en el contexto
                        context.Success();
                    }
                }
            }
            
            return Task.CompletedTask;
        },
        
        OnAuthenticationFailed = context =>
        {
            // Loguear información útil para diagnosticar
            Console.WriteLine($"Autenticación fallida: {context.Exception.Message}");
            
            return Task.CompletedTask;
        },
        
        OnChallenge = context =>
        {
            // Evitar redirects en API respondiendo con 401 Unauthorized
            context.HandleResponse();
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            
            // Añadir más información sobre la razón del desafío
            var path = context.Request.Path;
            var result = System.Text.Json.JsonSerializer.Serialize(new { 
                message = "No autorizado. Se requiere un token JWT válido.",
                status = 401,
                path = path.ToString(),
                timestamp = DateTime.UtcNow
            });
            
            // Log para depuración
            Console.WriteLine($"Error 401 en ruta: {path}");
            if (context.AuthenticateFailure != null)
            {
                Console.WriteLine($"Error de autenticación: {context.AuthenticateFailure.Message}");
            }
            
            return context.Response.WriteAsync(result);
        }
    };
});

// Configurar CORS para la aplicación cliente
services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy
            .WithOrigins(
                "https://localhost:5173", // URL del cliente con HTTPS
                "http://localhost:5173",  // URL del cliente sin HTTPS
                "https://localhost:7027", // URL del servidor con HTTPS
                "http://localhost:7027"   // URL del servidor sin HTTPS
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition", "Authorization");
    });
});

// Configurar políticas de autorización
services.AddAuthorization(options =>
{
    // Establecer política por defecto para usar el esquema JWT
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build();
    
    // Política específica para admin que acepta múltiples formatos de claims
    options.AddPolicy("RequireAdminRole", policy => 
        policy.RequireAssertion(context => 
            context.User.IsInRole("Admin") || 
            context.User.HasClaim(c => c.Type == "role" && c.Value == "Admin")
        ).AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme));
});

services.AddInfrastructureServices(builder.Configuration);

services.AddScoped<IdentityInitializer>();
services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
services.AddMediatR(cfg => 
{
    Console.WriteLine("Configurando MediatR");
    var assemblies = new[]
    {
        typeof(MiPlanV.Application.Users.Commands.CreateUserCommand).Assembly,
        typeof(Program).Assembly
    };
    
    foreach (var assembly in assemblies)
    {
        Console.WriteLine($"Registrando handlers de {assembly.GetName().Name}");
        cfg.RegisterServicesFromAssembly(assembly);
    }
});

var app = builder.Build();

// Aplicar migraciones
await app.RunMigrationsAsync();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MiPlanV API v1");
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    });
}

app.UseHttpsRedirection();

// Orden correcto de middleware para autenticación y autorización
app.UseRouting();

// Habilitar CORS - antes de Authentication y Authorization
app.UseCors("AllowClient");

// Middleware de diagnóstico temporal
app.Use(async (context, next) =>
{
    // Solamente para endpoints protegidos
    if (context.Request.Path.StartsWithSegments("/api") && 
        !context.Request.Path.StartsWithSegments("/api/Auth"))
    {
        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
        if (authHeader != null && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                // Autenticar explícitamente usando el esquema JWT Bearer
                var result = await context.AuthenticateAsync(JwtBearerDefaults.AuthenticationScheme);
                if (result.Succeeded)
                {
                    // Establecer el principal manualmente en el contexto
                    context.User = result.Principal;
                    
                    // Informar de la identidad autenticada
                    Console.WriteLine($"Identidad establecida: {result.Principal.Identity.Name}, Autenticada: {result.Principal.Identity.IsAuthenticated}, Esquema: {result.Principal.Identity.AuthenticationType}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al autenticar token: {ex.Message}");
            }
        }
    }
    
    await next();
});

// Middleware de autenticación y autorización en el orden correcto
app.UseAuthentication();
app.UseAuthorization();

// Inicializar roles y usuario admin
using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<IdentityInitializer>();
    await initializer.InitializeAsync();
}

app.MapControllers();

app.MapFallbackToFile("/index.html");

// Imprimir un mensaje cuando la aplicación está lista
Console.WriteLine("Aplicación iniciada correctamente");

// Agregar un endpoint directo para diagnóstico de autenticación
app.MapGet("/auth-test", (HttpContext context) => {
    var isAuthenticated = context.User?.Identity?.IsAuthenticated ?? false;
    var userName = context.User?.Identity?.Name;
    var authScheme = context.User?.Identity?.AuthenticationType;
    
    var claims = new List<object>();
    if (context.User?.Claims != null) 
    {
        claims = context.User.Claims
            .Select(c => new { c.Type, c.Value })
            .Cast<object>()
            .ToList();
    }
    
    var result = new {
        IsAuthenticated = isAuthenticated,
        UserName = userName,
        Claims = claims,
        AuthScheme = authScheme
    };
    
    return Results.Ok(result);
}).RequireAuthorization(new AuthorizationPolicyBuilder()
    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
    .RequireAuthenticatedUser()
    .Build());

app.Run();
