using Microsoft.AspNetCore.Http;

namespace MiPlanV.Application.PackedLunches
{
    internal static class Utils
    {
        internal static async Task<string> ConvertFileToBase64(this IFormFile file, CancellationToken cancellationToken)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream, cancellationToken);
            byte[] fileBytes = stream.ToArray();

            return Convert.ToBase64String(fileBytes);
        }
    }
}
