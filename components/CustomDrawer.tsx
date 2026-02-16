import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {View, Text, TouchableOpacity, StyleSheet, Modal, Pressable} from "react-native";
import { Link } from "expo-router";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useState, useEffect, useContext} from "react";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";

export default function CustomDrawer(props: any) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const { logout } = useContext(AuthContext)!;

    return (
        <DrawerContentScrollView {...props}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Menu</Text>
            </View>

            <DrawerItem
                label="Profile"
                labelStyle={styles.label}
                style={styles.drawerItem}
                onPress={() => router.push("/profile")}
            />
            <DrawerItem
                label="Settings"
                labelStyle={styles.label}
                style={styles.drawerItem}
                onPress={() => props.navigation.navigate("profile")}
            />
            <DrawerItem
                label="Logout"
                labelStyle={[styles.label, styles.logout]}
                style={styles.drawerItem}
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
                    <View style={{width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10,}}>
                        <Text style={{fontSize: 18, fontWeight: "600", marginBottom: 12}}>
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

const styles = StyleSheet.create({
    header: {
        // padding: 20,
        paddingLeft: 16,
        paddingVertical: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "600",
    },
    drawerItem: {
        marginVertical: 0,
        paddingVertical: 0,
    },
    row: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontSize: 16,
    },
    logout: {
        color: "red",
    },
});
