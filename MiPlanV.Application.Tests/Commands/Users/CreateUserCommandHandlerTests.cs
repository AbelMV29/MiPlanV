using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Moq;
using MiPlanV.Application.Commands.Users;
using MiPlanV.Domain.Entities;
using MiPlanV.Infrastructure.Data;
using Xunit;

namespace MiPlanV.Application.Tests.Commands.Users;

public class CreateUserCommandHandlerTests
{
    private readonly Mock<UserManager<User>> _mockUserManager;
    private readonly Mock<ApplicationDbContext> _mockContext;
    private readonly CreateUserCommandHandler _handler;

    public CreateUserCommandHandlerTests()
    {
        var userStore = new Mock<IUserStore<User>>();
        _mockUserManager = new Mock<UserManager<User>>(
            userStore.Object, null, null, null, null, null, null, null, null);
        
        _mockContext = new Mock<ApplicationDbContext>();
        _handler = new CreateUserCommandHandler(_mockUserManager.Object, _mockContext.Object);
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
            Email = command.Email,
            UserName = command.Email
        };

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(command.FirstName, result.FirstName);
        Assert.Equal(command.LastName, result.LastName);
        Assert.Equal(command.Email, result.Email);
        _mockUserManager.Verify(x => x.CreateAsync(It.IsAny<User>(), command.Password), Times.Once);
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

        var errors = new List<IdentityError>
        {
            new IdentityError { Description = "Password too weak" }
        };

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Failed(errors.ToArray()));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None));
        
        Assert.Contains("Error al crear el usuario", exception.Message);
        Assert.Contains("Password too weak", exception.Message);
    }
} 