import { api } from "./authService";
import {
    LoginRequestBody,
    RegisterRequestBody,
    AuthResponse,
    Message, SaveMessageResponseBody,
} from "../types/interfaces";

export async function send_message (message: SaveMessageResponseBody) {
    const response = await api.post("/message/send_message", { message: message });
    return response.data;
}

//
// export async function get_all_conversations (message: Message) {
//     const response = await api.post("/message", message);
//     return response.data;
// }