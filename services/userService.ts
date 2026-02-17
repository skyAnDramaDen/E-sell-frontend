import { api } from "./authService";
import {UserDTO, EditUserPayload} from "../types/interfaces";

export async function edit_user (payload: FormData) {
    const response = await api.post("/user/edit", payload);
    return response.data;
}

export async function get_user (id: string) {
    const response = await api.get(`/user/${id}`);
    return response.data;
}