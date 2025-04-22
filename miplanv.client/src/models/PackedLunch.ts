export interface BaseEntity
{
    id: number,
    createdAt: string,
    isActive: boolean
}

export interface PackedLunch extends BaseEntity {
    name: string;
    isVegan: boolean;
    image: string | null;
    description: string | null;
    isCurrent: boolean;
    orderDetails: any[];
}