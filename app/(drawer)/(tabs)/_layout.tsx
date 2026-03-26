import {Ionicons} from "@expo/vector-icons";
import {Tabs} from "expo-router";
import { useTheme } from "../../../hooks/useTheme";

export default function TabsLayout() {
    const { isDark, theme }  = useTheme();
    return (
        <Tabs screenOptions={{headerShown: false,
            tabBarStyle: { paddingTop: 0, backgroundColor: theme.colors.surface, },
            sceneStyle: { paddingTop: 0 },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textLight,}}>
            <Tabs.Screen name="index" options={{
            title: "Home",
            tabBarIcon: ({color, size}) => (<Ionicons name="home" size={size} color={color}/>),
            }}/>
            <Tabs.Screen name="search" options={{
            title: "Search",
            tabBarIcon: ({color, size}) => (<Ionicons name="search" size={size} color={color}/>),
            }}/>
            <Tabs.Screen name="sell" options={{
            title: "Sell",
            tabBarIcon: ({color, size}) => (<Ionicons name="add-circle" size={size} color={color}/>),
            }}/>
            <Tabs.Screen name="chat" options={{
                title: "Chats",
                tabBarIcon: ({color, size}) => (<Ionicons name="chatbubble" size={size} color={color}/>),
            }}/>
        </Tabs>
    );
}

TabsLayout.unstable_settings = {
    drawer: {
        title: 'Tabs',
        hide: true,
    },
};
