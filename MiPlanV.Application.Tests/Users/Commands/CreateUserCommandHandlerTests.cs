using MediatR;
using Moq;
using MiPlanV.Application.Users.Commands;
using MiPlanV.Domain.Entities;
using MiPlanV.Infrastructure.Services;
using Xunit;

namespace MiPlanV.Application.Tests.Users.Commands;

public class CreateUserCommandHandlerTests
{
    private readonly Mock<IUserService> _mockUserService;
    private readonly CreateUserCommandHandler _handler;

    public CreateUserCommandHandlerTests()
    {
        _mockUserService = new Mock<IUserService>();
        _handler = new CreateUserCommandHandler(_mockUserService.Object);
    }

    [Fact]
    public async Task Handle_ValidUser_ReturnsCreatedUser()
    {
        // Arrange
        var command = new CreateUserCommand
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "Password123!"
        };

        var expectedUser = new User
        {
            Id = 1,
            FirstName = command.FirstName,
            LastName = command.LastName,
            Email = command.Email
        };

        _mockUserService.Setup(x => x.CreateUserAsync(
            command.FirstName,
            command.LastName,
            command.Email,
            command.Password
        )).ReturnsAsync(expectedUser);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(command.FirstName, result.FirstName);
        Assert.Equal(command.LastName, result.LastName);
        Assert.Equal(command.Email, result.Email);
        _mockUserService.Verify(x => x.CreateUserAsync(
            command.FirstName,
            command.LastName,
            command.Email,
            command.Password
        ), Times.Once);
    }

    [Fact]
    public async Task Handle_InvalidUser_ThrowsException()
    {
        // Arrange
        var command = new CreateUserCommand
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "weak"
        };

        _mockUserService.Setup(x => x.CreateUserAsync(
            command.FirstName,
            command.LastName,
            command.Email,
            command.Password
        )).ThrowsAsync(new InvalidOperationException("Error al crear el usuario: Password too weak"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None));
        
        Assert.Contains("Error al crear el usuario", exception.Message);
        Assert.Contains("Password too weak", exception.Message);
    }
} 