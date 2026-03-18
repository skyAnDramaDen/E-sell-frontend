import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";

import { io } from "socket.io-client";

export default function Index() {
    const { user, loading, loadStorage } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                if (user) {
                    router.replace("/(tabs)" as any);
                    // router.replace("/(tabs)/index" as any);
                }
                else {
                    router.replace("/(auth)/login");
                }
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [user, loading]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
