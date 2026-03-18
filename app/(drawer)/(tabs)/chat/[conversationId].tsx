import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../../../hooks/useAuth";
import { theme } from "../../../../src/theme/theme";
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

const Avatar = ({ name }: { name?: string }) => (
    <View style={styles.avatar}>
        <Text style={styles.avatarText}>
            {name ? name.charAt(0).toUpperCase() : "?"}
        </Text>
    </View>
);

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);
    const { socket, user, loading, error } = useAuth();
    const flatListRef = useRef<FlatList>(null);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [participants, setParticipants] = useState<ConversationParticipants | null>(null);
    const router = useRouter();

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

        let response;
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
            <View style={[styles.messageRow, isMyMessage && styles.myMessageRow]}>
                {!isMyMessage && (
                    <View style={{ marginRight: theme.spacing.xs }}>
                        <Avatar name={item.senderName} />
                    </View>
                )}
                <View
                    style={[
                        styles.messageBubble,
                        isMyMessage ? styles.myBubble : styles.otherBubble,
                    ]}
                >
                    {!isMyMessage && item.senderName && (
                        <Text style={styles.senderName}>{item.senderName}</Text>
                    )}
                    <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.timestamp, isMyMessage && styles.myTimestamp]}>
                        {formatTime(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContent}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContent}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => {}}>
                    <Icon name="arrow-back" size={20} color={theme.colors.text} />
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={() => {
                        router.replace("/chat");
                    }}>
                        <Icon name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.conversationInfo}>
                        {/*<Avatar name={conversationName} />*/}
                        <Text style={styles.conversationName} numberOfLines={1}>
                            {"Chat"}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="more-vert" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
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
                        style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: theme.spacing.sm,
        padding: theme.spacing.xs,
    },
    conversationInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        marginRight: theme.spacing.sm,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    conversationName: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: "600",
        color: theme.colors.text,
    },
    iconButton: {
        padding: theme.spacing.xs,
    },
    messagesList: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
    messageRow: {
        marginBottom: theme.spacing.md,
        flexDirection: "row",
    },
    myMessageRow: {
        justifyContent: "flex-end",
    },
    messageBubble: {
        maxWidth: "75%",
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.sm,
    },
    myBubble: {
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: theme.borderRadius.xs,
    },
    otherBubble: {
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: theme.borderRadius.xs,
    },
    messageText: {
        fontSize: theme.typography.body.fontSize,
        lineHeight: theme.typography.body.lineHeight,
        color: theme.colors.text,
    },
    myMessageText: {
        color: "#fff",
    },
    senderName: {
        fontSize: theme.typography.caption.fontSize,
        fontWeight: "600",
        color: theme.colors.textLight,
        marginBottom: 2,
    },
    timestamp: {
        fontSize: 12,
        color: theme.colors.textLight,
        alignSelf: "flex-end",
        marginTop: 4,
    },
    myTimestamp: {
        color: "rgba(255,255,255,0.7)",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    textInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        ...theme.shadows.sm,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: theme.colors.error,
        marginBottom: theme.spacing.md,
    },
    backButtonText: {
        marginLeft: theme.spacing.xs,
        fontSize: 16,
        color: theme.colors.text,
        fontWeight: "500",
    },
});

export default ChatScreen;