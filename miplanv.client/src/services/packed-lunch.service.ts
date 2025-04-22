import { PackedLunch } from "../models/PackedLunch"
import api from "./api.service"

const ENDPOINTS = {
    BASE: '/PackedLunchs',
    BASE_WITH_ID: (id: number) : string => `${ENDPOINTS.BASE}/${id}`
}

export const packedLunchService = {
    getAll: (name: string | null = null): Promise<PackedLunch[]> => {
        return api.get<PackedLunch[]>(`${ENDPOINTS.BASE}${name ? `?name=${name}` : ''}`)
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