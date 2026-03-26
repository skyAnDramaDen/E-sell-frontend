import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../../../hooks/useAuth";
import { useTheme } from "../../../../hooks/useTheme";
import { styles as globalStyles } from "../../../../src/styles/styles";
import {
    create_conversation,
    get_conversation_by_participants_id,
    get_conversation_by_id
} from "../../../../services/conversationService";
import {Conversation, ConversationType, ConversationParticipants} from "../../../../types/interfaces";
import {send_message} from "../../../../services/messageService";
import { add_participants } from "../../../../services/conversationParticipantService";
import {Message} from "postcss";

import {showMessage} from "react-native-flash-message";

const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Avatar = ({ name }: { name?: string }) => {
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme);
    return (
        <View style={pageStyles.avatar}>
            <Text style={pageStyles.avatarText}>
                {name ? name.charAt(0).toUpperCase() : "?"}
            </Text>
        </View>
    )
};

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);
    const { socket, user, loading, error } = useAuth();
    const flatListRef = useRef<FlatList>(null);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [participants, setParticipants] = useState<ConversationParticipants | null>(null);
    const router = useRouter();
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme);

    const {
        sentConversationId,
        buyerName,
        buyerId,
        sellerId,
        sellerName,
    } = useLocalSearchParams<{
        product_id?: string;
        sellerId: string;
        buyerId?: string;
        sellerName: string;
        buyerName?: string;
        sentConversationId?: string;
    }>();

    useEffect(() => {
        if (sentConversationId) {
            setConversationId(sentConversationId);
        }

        const fetch_conversation = async () => {
            try {
                let response;
                if (sentConversationId) {
                    response = await get_conversation_by_id(sentConversationId);
                } else if (!sentConversationId && buyerId) {
                    response = await get_conversation_by_participants_id(buyerId, sellerId);
                }

                if (response) {
                    setMessages(response.messages);
                    setConversationId(response.id);
                }
            } catch (error) {
                showMessage({message: "Failed to fetch conversation", type: "danger"});
            }
        }

        fetch_conversation();
    }, [])

    useEffect(() => {
        if (!socket) return;

        if (conversationId) {
            socket.emit("join_conversation", conversationId);
        } else {
            return;
        }

        const handleReceiveMessage = (message: any) => {
            setMessages((prev) => [...prev, message]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.emit("leave_conversation", conversationId);
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket, conversationId]);

    const sendMessage = async () => {
        if (!socket || !user || !input.trim()) return;

        if (input.trim().length === 0) {
            return;
        }

        let message: Message;
        let message_payload;

        let created_conversation;
        let created_conversation_payload;
        let created_conversation_participants;
        let created_conversation_participants_payload;
        if (conversationId != undefined && buyerId != undefined && buyerName != undefined) {
            message_payload = {
                content: input.trim(),
                senderId: buyerId,
                conversationId: conversationId,
                read: false,
            }

            message = await send_message(message_payload);

            socket.emit("send_message", {
                message: message,
            });
            setInput("");
        } else {
            created_conversation_payload = {
                type: ConversationType.SELLER_BUYER,
            }

            created_conversation = await create_conversation(created_conversation_payload);

            if (created_conversation) {
                setConversation(created_conversation);
                setConversationId(created_conversation.id);
                created_conversation_participants_payload = [
                    {
                        conversationId: created_conversation.id,
                        userId: user.id,
                        name: user.username,
                    },
                    {
                        conversationId: created_conversation.id,
                        userId: sellerId,
                        name: sellerName,
                    }
                ]

                created_conversation_participants = await add_participants(created_conversation_participants_payload);

                if (created_conversation_participants.length === 2) {
                    setParticipants(created_conversation_participants);
                    if (buyerId != undefined) {
                        message_payload = {
                            content: input.trim(),
                            senderId: buyerId,
                            conversationId: created_conversation.id,
                            read: false,
                        }

                        message = await send_message(message_payload);


                        if (message) {
                            setMessages(prev => [...prev, message]);
                            socket.emit("send_message", {
                                conversationId: created_conversation.id,
                                message: message,
                            });
                            setInput("");
                        }
                    }
                }
            }
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMyMessage = item.senderId === user?.id;

        return (
            <View style={[pageStyles.messageRow, isMyMessage && pageStyles.myMessageRow]}>
                {/*{!isMyMessage && (*/}
                {/*    <View style={{ marginRight: theme.spacing.xs }}>*/}
                {/*        <Avatar name={item.senderName} />*/}
                {/*    </View>*/}
                {/*)}*/}
                <View
                    style={[
                        pageStyles.messageBubble,
                        isMyMessage ? pageStyles.myBubble : pageStyles.otherBubble,
                    ]}
                >
                    {!isMyMessage && item.senderName && (
                        <Text style={pageStyles.senderName}>{item.senderName}</Text>
                    )}
                    <Text style={[pageStyles.messageText, isMyMessage && pageStyles.myMessageText]}>
                        {item.content}
                    </Text>
                    <Text style={[pageStyles.conversationTimestamp, isMyMessage && pageStyles.myTimestamp]}>
                        {formatTime(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={pageStyles.centerContent}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={pageStyles.centerContent}>
                <Text style={pageStyles.conversationErrorText}>Error: {error}</Text>
                <TouchableOpacity style={pageStyles.backButton} onPress={() => {}}>
                    <Icon name="arrow-back" size={20} color={theme.colors.text} />
                    <Text style={pageStyles.conversationBackButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={pageStyles.conversationContainer} edges={["top"]}>
            <View style={pageStyles.conversationHeader}>
                <View style={pageStyles.headerLeft}>
                    <TouchableOpacity style={pageStyles.conversationBackButton} onPress={() => {
                        router.replace("/chat");
                    }}>
                        <Icon name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={pageStyles.individualConversationInfo}>
                        {/*<Avatar name={conversationName} />*/}
                        <Text style={pageStyles.conversationName} numberOfLines={1}>
                            {"Chat"}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={pageStyles.conversationIconButton}>
                    <Icon name="more-vert" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={pageStyles.messagesList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <View style={pageStyles.inputContainer}>
                    <TextInput
                        style={pageStyles.textInput}
                        value={input}
                        onChangeText={(text) => {
                            setInput(text);
                        }}
                        placeholder="Type a message..."
                        placeholderTextColor={theme.colors.textLight}
                        multiline
                        returnKeyType="send"
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity
                        style={[pageStyles.sendButton, !input.trim() && pageStyles.sendButtonDisabled]}
                        onPress={() => {
                            sendMessage();
                        }}
                        disabled={!input.trim()}
                    >
                        <Icon name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;