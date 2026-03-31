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
    const response = await api.post("/listing/delete_listing", {id: id});
    return response.data;
}

export async function search_listings(id: string, category: string | null, search: string | null) {
    let payload;
    let response;

    if (category != null || category != undefined && id != null) {
        payload = {
            category: category,
            id: id,
        };

        response = await api.post("/listing/search_listings_by_category", {payload: payload});

    } else if (search != null || search != undefined && id != null) {
        payload = {
            search: search,
            id: id,
        };
        response = await api.post("/listing/search_listings_by_search_params", {payload: payload});
    }

    if (response) {
        return response.data;
    } else {
        return null;
    }
}

export async function create_listing(formData: FormData) {
    const response = await api.post("/listing/add", formData);
    return response.data;
}