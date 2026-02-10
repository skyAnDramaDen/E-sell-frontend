import {StackScreen} from "react-native-screens";
import {Ionicons} from "@expo/vector-icons";

import react from "react";
import {Tabs} from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{headerShown: false}}>
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
        </Tabs>
    );
}

TabsLayout.unstable_settings = {
    drawer: {
        title: 'Tabs',
        hide: true,
    },
};
