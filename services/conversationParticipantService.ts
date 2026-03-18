import {
    Message,
    ConversationType,
    CreateConversationPayload,
    CreateConversationParticipantPayloads
} from "../types/interfaces";
import {api} from "./authService";

export async function add_participants (participants: CreateConversationParticipantPayloads) {
    const response = await api.post("/conversationParticipant/add_participants", participants);
    return response.data;
}