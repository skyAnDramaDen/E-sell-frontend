import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../../../../hooks/useAuth';
import { useTheme } from '../../../../hooks/useTheme';
import { styles as globalStyles } from '../../../../src/styles/styles';
import {Conversation, Message, User, UserDTO} from "../../../../types/interfaces";

import {get_all_conversations} from "../../../../services/conversationService";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";

import {Ionicons} from "@expo/vector-icons";
import {DrawerNavigationProp} from "@react-navigation/drawer";

const getOtherParticipants = (conversation: Conversation, currentUserId?: string) => {
    if (!currentUserId) return [];
    return conversation.participant.filter(p => p.id !== currentUserId);
};

// const getAvatar = (conversation: Conversation, currentUserId?: string) => {
//     const others = getOtherParticipants(conversation, currentUserId);
//     // If only one other person, use their avatar; otherwise use group placeholder
//     if (others.length === 1) return others[0].avatar;
//     return null; // will show placeholder
// };

const getLastMessage = (conversation: Conversation): Message | undefined => {
    if (!conversation.messages || conversation.messages.length === 0) return undefined;

    return conversation.messages[conversation.messages.length - 1];
};

const getUnreadCount = (conversation: Conversation, currentUserId?: string): number => {
    if (!currentUserId) return 0;

    return conversation.messages.filter(
        msg => msg.senderId !== currentUserId && !msg.read
    ).length;
};

const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString(); // fallback
};

const Chats = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, socket } = useAuth();
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    const fetchedUserId = useRef<string | null>(null);
    const isMounted = useRef(true);

    const { isDark, toggleTheme, theme } = useTheme();
    const pageStyles = globalStyles(theme);

    const getDisplayName = (conversation: Conversation, currentUserId?: string) => {
        const others = getOtherParticipants(conversation, currentUserId);
        if (others.length === 0) return 'Unknown';
        if (others.length === 1) return others[0].name;

        let sender_name= others.map(p => {
            if (p.userId === user?.id) {
                return p.name.trim().slice(0, 1).toUpperCase() + p.name.trim().slice(1, p.name.length).toLowerCase();
            }
        });

        let receiver_name= others.map(p => {
            if (p.userId != user?.id) {
                return p.name.trim().slice(0, 1).toUpperCase() + p.name.trim().slice(1, p.name.length).toLowerCase();
            }
        });
        // return others.map(p => p.name.split(' ')[0]).join(', ');
        return receiver_name;
    };

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!user) return;

        if (fetchedUserId.current === user.id) return;

        const fetchConversations = async () => {
            try {
                setLoading(true);

                const response = await get_all_conversations(user.id);

                if (response.success === true) {
                    setConversations([]);
                } else if (response) {
                    if (response.length > 0) {
                        if (!isMounted.current) return;

                        const sorted = response.sort((a: Conversation, b: Conversation) => {
                            const aLast = getLastMessage(a)?.createdAt || a.createdAt;
                            const bLast = getLastMessage(b)?.createdAt || b.createdAt;
                            return new Date(bLast).getTime() - new Date(aLast).getTime();
                        });
                        setConversations(sorted);
                        setError(null);
                        fetchedUserId.current = user.id;
                    }
                }
            } catch (err) {
                if (isMounted.current) {
                    setError('Failed to load conversations');
                }
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const handleNewMessage = useCallback((message: Message & { conversationId: string }) => {
        if (!isMounted.current) return;
        setConversations(prev => {
            const index = prev.findIndex(c => c.id === message.conversationId);
            if (index === -1) return prev;

            const updatedConv = { ...prev[index] };
            updatedConv.messages = [...updatedConv.messages, message];

            const newConvs = [...prev];
            newConvs.splice(index, 1);
            newConvs.unshift(updatedConv);
            return newConvs;
        });
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('new_message', handleNewMessage);
        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, handleNewMessage]);

    const renderItem = ({ item }: { item: Conversation }) => {
        const lastMsg = getLastMessage(item);
        const isLastMessageFromMe = lastMsg?.senderId === user?.id;
        const displayName = getDisplayName(item, user?.id);
        const unreadCount = getUnreadCount(item, user?.id);
        const lastMessageText = lastMsg?.content || 'No messages yet';
        const lastMessagePreview = isLastMessageFromMe
            ? `You: ${lastMessageText}`
            : lastMessageText;
        const lastMessageTime = lastMsg?.createdAt || item.createdAt;

        return (
            <TouchableOpacity
                style={pageStyles.conversationItem as ViewStyle}
                onPress={() => {
                    // router.push(`/chat/${item.id}`);
                    router.push({
                        pathname: "/chat/0" as any,
                        params: {
                            buyerId: user?.id,
                            buyerName: user?.username,
                            sentConversationId: item.id,
                            // sellerId: product.sellerId,
                            // sellerName: product.sellerName,
                        },
                    });
                }}
                activeOpacity={0.7}
            >
                <View style={pageStyles.avatarContainer as ViewStyle}>
                    {/*<View style={pageStyles.avatarPlaceholder}>*/}
                    {/*    <Text style={pageStyles.avatarText}>*/}
                    {/*        {displayName.charAt(0).toUpperCase()}*/}
                    {/*    </Text>*/}
                    {/*</View>*/}
                    {unreadCount > 0 && (
                        <View style={pageStyles.unreadBadge as ViewStyle}>
                            <Text style={pageStyles.unreadText as TextStyle}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={pageStyles.conversationInfo as ViewStyle}>
                    <View style={pageStyles.topRow as ViewStyle}>
                        <Text style={pageStyles.name as TextStyle} numberOfLines={1}>
                            {displayName}
                        </Text>
                        <Text style={pageStyles.timestamp as TextStyle}>
                            {formatTime(lastMessageTime)}
                        </Text>
                    </View>
                    <View style={pageStyles.bottomRow as ViewStyle}>
                        <Text
                            style={[
                                pageStyles.lastMessage as TextStyle,
                                (unreadCount > 0) && pageStyles.unreadLastMessage as TextStyle,
                            ]}
                            numberOfLines={1}
                        >
                            {lastMessagePreview}
                        </Text>
                        {unreadCount > 0 && <View style={pageStyles.unreadDot as ViewStyle} />}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={pageStyles.centerContainer as ViewStyle}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={pageStyles.centerContainer as ViewStyle}>
                <Text style={pageStyles.errorText as TextStyle}>{error}</Text>
                <TouchableOpacity
                    style={pageStyles.backButton as ViewStyle}
                    onPress={() => {
                        fetchedUserId.current = null;
                        setError(null);
                        setLoading(true);
                    }}
                >
                    <Icon name="refresh" size={20} color={theme.colors.text} />
                    <Text style={pageStyles.backButtonText as TextStyle}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={pageStyles.container as ViewStyle}>
            <View style={pageStyles.header as ViewStyle}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={pageStyles.menuButton as ViewStyle}>
                    <Ionicons name="menu" size={25} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={pageStyles.headerTitle as TextStyle}>Chats</Text>
            </View>

            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={pageStyles.listContent as ViewStyle}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={pageStyles.emptyContainer as ViewStyle}>
                        <Icon name="chat" size={60} color={theme.colors.textLight} />
                        <Text style={pageStyles.emptyText as TextStyle}>No conversations yet</Text>
                        <TouchableOpacity style={pageStyles.startChatButton as ViewStyle}>
                            <Text style={pageStyles.startChatButtonText as TextStyle}>Start a new chat</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default Chats;