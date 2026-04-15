import { CreateConversationPayload } from "../types/interfaces";
import {api} from "./authService";

export async function get_all_conversations (id: string) {
    const response = await api.post("/conversation/get_all_conversations", {id: id});
    return response.data;
}

export async function create_conversation (payload: CreateConversationPayload) {
    const response = await api.post("/conversation/create_conversation", {payload: payload});
    return response.data;
}

export async function get_conversation_by_id( conversationId: string, ) {
    const response = await api.post("/conversation/get_conversation", {conversationId});
    return response.data;
}

export async function get_conversation_by_participants_id(buyerId: string, sellerId: string) {
    const response = await api.post("/conversation/get_conversation_by_participants_id", {
        buyerId,
        sellerId,
    })
    return response.data;
}