namespace MiPlanV.Application.Common.Dtos
{
    public class PaginatedList<T>
    {
        public PaginatedList(IEnumerable<T> items, int count, int pageIndex, int totalItems)
        {
            TotalItems = totalItems;
            PageIndex = pageIndex;
            Items = items.ToList();
        }

        public List<T> Items { get; }
        public int PageIndex { get; }
        public int TotalItems { get; }
    }
}