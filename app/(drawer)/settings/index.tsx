import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../../src/theme/theme';
import { styles as globalStyles } from '../../../src/styles/styles';
import { SettingItemProps, SettingToggleProps } from "../../../types/interfaces";

import { DrawerNavigationProp } from '@react-navigation/drawer';
import {useNavigation, useLocalSearchParams, useRouter} from "expo-router";
import MultiActionButton from "../../../components/MultiActionButton";
type SettingsScreenNavigationProp = DrawerNavigationProp<any>;

type Props = {
    navigation: SettingsScreenNavigationProp;
};



const SettingItem = ({
                         icon,
                         label,
                         onPress,
                         showChevron = true,
                         rightElement,
                     }: SettingItemProps) => (
    <TouchableOpacity style={localStyles.settingItem} onPress={onPress} activeOpacity={0.7}>
        <View style={localStyles.settingItemLeft}>
            <Ionicons name={icon} size={24} color={theme.colors.primary} style={localStyles.settingIcon} />
            <Text style={localStyles.settingLabel}>{label}</Text>
        </View>
        {rightElement ? rightElement : showChevron && (
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
        )}
    </TouchableOpacity>
);

const SettingToggle = ({ icon, label, value, onValueChange }: SettingToggleProps) => (
    <View style={localStyles.settingItem}>
        <View style={localStyles.settingItemLeft}>
            <Ionicons name={icon} size={24} color={theme.colors.primary} style={localStyles.settingIcon} />
            <Text style={localStyles.settingLabel}>{label}</Text>
        </View>
        <Switch
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={value ? '#fff' : '#f4f3f4'}
            onValueChange={onValueChange}
            value={value}
        />
    </View>
);


const Index = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(true);
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={globalStyles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={globalStyles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={globalStyles.menuButton}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>

                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={globalStyles.titleGradient}
                    >
                        <Text style={globalStyles.title}>Settings</Text>
                    </LinearGradient>

                    <MultiActionButton
                        icon="home-outline"
                        onPress={() => router.push("/(tabs)" as any)}
                    />
                </View>

                <View style={globalStyles.section}>
                    <Text style={globalStyles.sectionTitle}>Account</Text>
                    <View style={localStyles.card}>
                        <SettingItem
                            icon="person-outline"
                            label="Profile Information"
                            onPress={() => navigation.navigate('Profile')}
                            showChevron={false}
                        />
                        <View style={localStyles.divider} />
                        <SettingItem
                            icon="lock-closed-outline"
                            label="Change Password"
                            onPress={() => navigation.navigate('ChangePassword')}
                            showChevron={false}
                        />
                    </View>
                </View>


                <View style={globalStyles.section}>
                    <Text style={globalStyles.sectionTitle}>Preferences</Text>
                    <View style={localStyles.card}>
                        <SettingToggle
                            icon="notifications-outline"
                            label="Push Notifications"
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                        />
                        <View style={localStyles.divider} />
                        <SettingToggle
                            icon="moon-outline"
                            label="Dark Mode"
                            value={darkModeEnabled}
                            onValueChange={setDarkModeEnabled}
                        />
                        <View style={localStyles.divider} />
                        <SettingToggle
                            icon="location-outline"
                            label="Location Services"
                            value={locationEnabled}
                            onValueChange={setLocationEnabled}
                        />
                    </View>
                </View>

                <View style={globalStyles.section}>
                    <Text style={globalStyles.sectionTitle}>Privacy & Security</Text>
                    <View style={localStyles.card}>
                        <SettingItem
                            icon="shield-checkmark-outline"
                            label="Privacy Policy"
                            onPress={() => navigation.navigate('PrivacyPolicy')}
                            showChevron={false}
                        />
                        <View style={localStyles.divider} />
                        <SettingItem
                            icon="document-text-outline"
                            label="Terms of Service"
                            onPress={() => navigation.navigate('TermsOfService')}
                            showChevron={false}
                        />
                        <View style={localStyles.divider} />
                        <SettingItem
                            icon="log-out-outline"
                            label="Log Out"
                            onPress={() => {}}
                            showChevron={false}
                            rightElement={<Text style={localStyles.logoutText}>Logout</Text>}
                        />
                    </View>
                </View>

                <View style={globalStyles.section}>
                    <View style={localStyles.card}>
                        <SettingItem
                            icon="information-circle-outline"
                            label="App Version"
                            onPress={() => {}}
                            showChevron={false}
                            rightElement={<Text style={localStyles.versionText}>1.0.0</Text>}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        ...theme.shadows.md,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: theme.spacing.md,
    },
    settingLabel: {
        fontSize: 16,
        color: theme.colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginLeft: 52,
    },
    logoutText: {
        fontSize: 16,
        color: theme.colors.error,
        fontWeight: '500',
    },
    versionText: {
        fontSize: 16,
        color: theme.colors.textLight,
    },
});

export default Index;