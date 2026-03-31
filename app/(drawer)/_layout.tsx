import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/CustomDrawer";
import { useTheme } from "../../hooks/useTheme";

export default function DrawerLayout() {
    const { theme } = useTheme();
    return (
    <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
            headerShown: false,
            drawerStyle: {
                backgroundColor: theme.colors.background,
            },
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
