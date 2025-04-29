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

export interface CurrentPackedLunch {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    isVegan: boolean;
}