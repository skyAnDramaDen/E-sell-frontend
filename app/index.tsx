import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function Index() {
    const { user, loading, loadStorage } = useAuth();
    const router = useRouter();
    const { theme }  = useTheme();

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                if (user) {
                    router.replace("/(tabs)" as any);
                }
                else {
                    router.replace("/(auth)/login");
                }
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [user, loading]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
