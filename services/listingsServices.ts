import { api } from "./authService";

export async function get_listing(id: string) {
    const response = await api.get(`/listing/${id}`);
    return response.data;
}

export async function get_listings(id: string) {
    const response = await api.get(`/listing/all_listings/${id}`);
    return response.data;
}

export async function delete_listing(id: string) {
    const response = await api.delete(`/listing/${id}`);
    return response.data;
}

export async function search_listings(search: string, category?: string) {
    const response = await api.get(`/listing?search=${search}&category=${category}`);
    return response.data;
}