import { Stack } from "expo-router";
import React from 'react';
import { AuthProvider } from "../contexts/AuthContext";
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets, } from 'react-native-safe-area-context';
import FlashMessage from "react-native-flash-message";

import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ChatProvider } from "../contexts/ChatContext";

function RootLayoutContent() {
    const insets = useSafeAreaInsets();
    return (
        <>
            <Stack
                screenOptions = {{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false,
                    title: "Home"}} />
                <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(drawer)" />   /
                <Stack.Screen name="listing/index" options={{ headerShown: false }} />
            </Stack>
            <FlashMessage position="top" />
        </>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({

    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider>
            <AuthProvider>
                <ChatProvider>
                    <RootLayoutContent />
                </ChatProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
