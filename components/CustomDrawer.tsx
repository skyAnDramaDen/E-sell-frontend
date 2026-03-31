import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {View, Text, Modal, Pressable} from "react-native";
import { useRouter } from "expo-router";
import {useState, useContext} from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { styles as globalStyles } from "../src/styles/styles";

export default function CustomDrawer(props: any) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const { logout } = useContext(AuthContext)!;
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme);

    return (
        <DrawerContentScrollView {...props}>

            <View style={pageStyles.drawerHeader}>
                <Text style={pageStyles.drawerHeaderText}>Menu</Text>
            </View>

            <DrawerItem
                label="Profile"
                labelStyle={pageStyles.drawerLabel}
                style={pageStyles.drawerItem}
                onPress={() => router.push("/profile")}
            />
            <DrawerItem
                label="Settings"
                labelStyle={pageStyles.drawerLabel}
                style={pageStyles.drawerItem}
                onPress={() => router.push("/(drawer)/settings" as any)}
            />
            <DrawerItem
                label="Logout"
                labelStyle={[pageStyles.drawerLabel, pageStyles.drawerLogout]}
                style={pageStyles.drawerItem}
                onPress={() => setShowModal(true)}
            />
            <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={{width: "80%", backgroundColor: theme.colors.background, padding: 20, borderRadius: 10,}}>
                        <Text style={{fontSize: 18, fontWeight: "600", marginBottom: 12, color: theme.colors.text}}>
                            Are you sure you want to logout?
                        </Text>

                        <Pressable onPress={async () => {
                            setShowModal(false)
                            const success = await logout();
                        }}
                                   style={{
                                       backgroundColor: "red",
                                       padding: 12,
                                       borderRadius: 8,
                                       marginBottom: 10,
                                   }}
                        >
                            <Text style={{color: "#fff", textAlign: "center"}}>Logout</Text>
                        </Pressable>

                        <Pressable onPress={() => setShowModal(false)}
                                   style={{
                                       backgroundColor: "#ddd",
                                       padding: 12,
                                       borderRadius: 8,
                                   }}
                        >
                            <Text style={{textAlign: "center"}}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </DrawerContentScrollView>
    );
}

