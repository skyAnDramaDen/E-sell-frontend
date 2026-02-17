import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/CustomDrawer";

export default function DrawerLayout() {
    return (
    <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
        }}
    >
        <Drawer.Screen
            name="(tabs)"
            options={{
                title: 'Home',
                drawerItemStyle: { display: 'none' },
                headerShown: false,
            }}
        />

        <Drawer.Screen
            name="profile"
            options={{
                title: 'Profile',
                drawerItemStyle: { display: "contents" },
                headerShown: false,
            }}
        />

        <Drawer.Screen
            name="settings"
            options={{
                title: 'Settings',
                drawerItemStyle: { display: "contents" },
                headerShown: false,
            }}
        />
    </Drawer>
    );
}
