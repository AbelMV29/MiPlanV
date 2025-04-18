using FluentValidation;

namespace MiPlanV.Application.PackedLunchs.Commands.CreatePackedLunch
{
    public class CreatePackedLunchCommandValidator : AbstractValidator<CreatePackedLunchCommand>
    {
        public CreatePackedLunchCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El nombre es requerido")
                .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("La descripción no puede exceder los 500 caracteres")
                .When(x => x.Description is not null);
        }
    }
} 