import {createContext, ReactNode, useEffect, useMemo, useState} from "react";
import { useAuth } from "../hooks/useAuth";
import {Message, Conversation, ChatContextValue } from "../types/interfaces";

export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { socket, user } = useAuth();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [unread, setUnread] = useState<Record<string, number>>({});
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);

    useEffect(() => {
        if (!socket || !user) return;

        const handleNewMessage = (message: Message) => {
            const { conversationId, senderId, createdAt } = message;

            setIncomingMessage(message);

            setConversations((prev: Conversation[]) => {
                const updated = [...prev];
                const index = updated.findIndex(
                    (c) => c.id === conversationId
                );

                if (index !== -1) {
                    const conv = updated[index];

                    const updatedConv: Conversation = {
                        ...conv,
                        messages: conv.messages,
                    };

                    updated.splice(index, 1);
                    return [updatedConv, ...updated];
                }

                return prev;
            });

            if (
                senderId !== user.id &&
                conversationId !== activeChatId
            ) {
                setUnread((prev) => ({
                    ...prev,
                    [conversationId]:
                        (prev[conversationId] || 0) + 1,
                }));
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, user, activeChatId]);

    useEffect(() => {
        if (!activeChatId) return;

        setUnread((prev) => ({
            ...prev,
            [activeChatId]: 0,
        }));
    }, [activeChatId]);

    const value = useMemo(() => ({
        conversations,
        unread,
        activeChatId,
        setConversations,
        setActiveChatId,
        incomingMessage
    }), [conversations,
        unread,
        activeChatId,
        setConversations,
        setActiveChatId,
        incomingMessage]);

    return (
        <ChatContext.Provider
            value={value}
        >
            {children}
        </ChatContext.Provider>
    );
};