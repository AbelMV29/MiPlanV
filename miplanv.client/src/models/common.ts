export interface PaginatedList<T> {
    items: T[];
    pageIndex: number;
    totalItems: number;
}