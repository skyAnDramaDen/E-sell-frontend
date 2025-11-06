import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) router.replace("/");
            else router.replace("/login");
        }
    }, [user, loading]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
