using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MiPlanV.Application.Common.Interfaces;
using MiPlanV.Application.Users.Interfaces;
using MiPlanV.Domain.Entities;
using MiPlanV.Infrastructure.Identity;
using MiPlanV.Infrastructure.Repository;
using MiPlanV.Infrastructure.Repository.Common;
using MiPlanV.Infrastructure.Persistence;
using MiPlanV.Infrastructure;

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

// Configurar servicios de autenticación JWT
services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };

    // Configurar para extraer el token de cookies
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Intentar extraer el token de la cookie auth_token
            context.Token = context.Request.Cookies["auth_token"];
            
            // Si no hay token en la cookie, usar el header Authorization
            if (string.IsNullOrEmpty(context.Token))
            {
                string authorization = context.Request.Headers["Authorization"];
                if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    context.Token = authorization.Substring("Bearer ".Length).Trim();
                }
            }
            
            return Task.CompletedTask;
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
            .WithExposedHeaders("Content-Disposition");
    });
});

services.AddInfrastructureServices(builder.Configuration);

services.AddScoped<IdentityInitializer>();
services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
services.AddMediatR(cfg => 
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly)
       .RegisterServicesFromAssembly(typeof(MiPlanV.Application.Users.Commands.CreateUserCommand).Assembly)
);

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

// Habilitar CORS - asegúrate de que esté antes de Authentication y Authorization
app.UseCors("AllowClient");

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

app.Run();
