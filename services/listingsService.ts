import { api } from "./authService";

export async function get_listing(id: string) {
    const response = await api.post("/listing", {id: id});
    return response.data;
}

export async function get_listings(id: string) {
    const response = await api.post("/listing/all_listings", {id: id});
    return response.data;
}

export async function delete_listing(id: string) {
    const response = await api.post("/listing", {id: id});
    return response.data;
}

export async function search_listings(search: string, id: string, category?: string) {
    const response = await api.get(`/listing?search=${search}&category=${category}&id=${id}`);
    return response.data;
}

export async function create_listing(formData: FormData) {
    const response = await api.post("/listing/add", formData);
    return response.data;
}