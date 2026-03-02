import { api } from "./authService";
import {UserDTO, EditUserPayload, ChangePasswordPayload} from "../types/interfaces";

export async function edit_user (payload: FormData) {
    const response = await api.post("/user/edit", payload);
    return response.data;
}

export async function get_user (id: string) {
    const response = await api.post("/user", {id: id});
    return response.data;
}

export async function change_user_password (payload: ChangePasswordPayload) {
    const response = await api.post("/user/change_user_password", payload);
    return response.data;
}