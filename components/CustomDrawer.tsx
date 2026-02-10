import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function CustomDrawer(props: any) {
    return (
        <DrawerContentScrollView {...props}>

            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>
                    Menu
                </Text>
            </View>

            <DrawerItem
                label="Profile"
                onPress={() => props.navigation.navigate("profile")}
            />

            <Link href="/settings" asChild>
                <TouchableOpacity style={{ padding: 20 }}>
                    <Text>Settings</Text>
                </TouchableOpacity>
            </Link>

            <TouchableOpacity
                style={{ padding: 20 }}
                onPress={() => console.log("Logout pressed")}
            >
                <Text style={{ color: "red" }}>Logout</Text>
            </TouchableOpacity>

        </DrawerContentScrollView>
    );
}
