namespace MiPlanV.Application.PackedLunches.Queries.GetCurrentsPackedLunchs
{
    public class GetCurrentsPackedLunchesResponse
    {
        public GetCurrentsPackedLunchesResponse(int id, string name, string? description, string? image, bool isVegan)
        {
            Id = id;
            Name = name;
            Description = description;
            Image = image;
            IsVegan = isVegan;
        }

        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Image { get; set; }
        public bool IsVegan { get; set; }
    }
}
