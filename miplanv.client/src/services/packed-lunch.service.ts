import { PaginatedList } from "../models/common";
import { CurrentPackedLunch, PackedLunch } from "../models/packedLunch";
import { buildQueryString } from "../utils/common";
import api from "./api.service"

const ENDPOINTS = {
    BASE: '/PackedLunches',
    BASE_WITH_ID: (id: number) : string => `${ENDPOINTS.BASE}/${id}`
}

export interface GetAllQuery
{
    page: number;
    pageSize: number;
    name: string;
    isVegan?: boolean | null;
    isActive?: boolean | null;
    isCurrentCampaign?: boolean | null;
}

export const packedLunchService = {
    getAll: (query: GetAllQuery): Promise<PaginatedList<PackedLunch>> => {

        return api.get<PaginatedList<PackedLunch>>(`${ENDPOINTS.BASE}?${buildQueryString(query)}`)
            .then(response => {
                return response.data;
            })
            .catch(() => {
                throw new Error("Desconexión con el servidor");
            });
    },
    getCurrents: () : Promise<CurrentPackedLunch[]> =>
    {
        return api.get<CurrentPackedLunch[]>(`${ENDPOINTS.BASE}/current`)
            .then(response => {
                return response.data;
            })
            .catch(() => {
                throw new Error("Desconexión con el servidor");
            });
    },
    getById: (id: number): Promise<PackedLunch> => {
        return api.get<PackedLunch>(ENDPOINTS.BASE_WITH_ID(id))
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw new Error(error.response.data);
            });
    },
    create: (data: FormData): Promise<PackedLunch> => {
        return api.post<PackedLunch>(ENDPOINTS.BASE, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw new Error(error.response.data);
            })
    },
    update: (id: number, data: FormData): Promise<PackedLunch> => {
        return api.put<PackedLunch>(ENDPOINTS.BASE_WITH_ID(id), data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw new Error(error.response.data);
            })
    },
    delete: (id: number): Promise<void> => {
        return api.delete(ENDPOINTS.BASE_WITH_ID(id))
            .then(() => { })
            .catch(error => {
                throw new Error(error.response.data);
            });
    }
}