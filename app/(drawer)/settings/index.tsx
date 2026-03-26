import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Switch,
    SafeAreaView,
    ViewStyle, TextStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles as globalStyles } from '../../../src/styles/styles';
import { SettingItemProps, SettingToggleProps } from "../../../types/interfaces";

import { DrawerNavigationProp } from '@react-navigation/drawer';
import {useNavigation, useRouter} from "expo-router";
import MultiActionButton from "../../../components/MultiActionButton";
type SettingsScreenNavigationProp = DrawerNavigationProp<any>;
import { useTheme } from "../../../hooks/useTheme";

import {ImageStyle} from "expo-image";

type Props = {
    navigation: SettingsScreenNavigationProp;
};

const SettingItem = ({
                         icon,
                         label,
                         onPress,
                         showChevron = true,
                         rightElement,
                     }: SettingItemProps) => {
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme);

    return (
        <TouchableOpacity style={pageStyles.settingItem as ViewStyle} onPress={onPress} activeOpacity={0.7}>
            <View style={pageStyles.settingItemLeft as ViewStyle}>
                <Ionicons name={icon} size={24} color={theme.colors.primary} style={pageStyles.settingIcon as ImageStyle} />
                <Text style={pageStyles.settingLabel as TextStyle}>{label}</Text>
            </View>
            {rightElement ? rightElement : showChevron && (
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
            )}
        </TouchableOpacity>
    )
};

const SettingToggle = ({ icon, label, value, onValueChange }: SettingToggleProps) => {
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme);
    return (
        <View style={pageStyles.settingItem as ViewStyle}>
            <View style={pageStyles.settingItemLeft as ViewStyle}>
                <Ionicons name={icon} size={24} color={theme.colors.primary} style={pageStyles.settingIcon as ImageStyle} />
                <Text style={pageStyles.settingLabel as TextStyle}>{label}</Text>
            </View>
            <Switch
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={value ? '#fff' : '#f4f3f4'}
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    )
};

const Index = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(true);
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const router = useRouter();

    const { toggleTheme, theme } = useTheme();
    const pageStyles = globalStyles(theme);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={pageStyles.scrollContainer as ViewStyle}
                showsVerticalScrollIndicator={false}
            >
                <View style={pageStyles.header as ViewStyle}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={pageStyles.menuButton as ViewStyle}>
                        <Ionicons name="menu" size={28} color={theme.colors.text} />
                    </TouchableOpacity>

                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={pageStyles.titleGradient as ViewStyle}
                    >
                        <Text style={pageStyles.title as TextStyle}>Settings</Text>
                    </LinearGradient>

                    <MultiActionButton
                        icon="home-outline"
                        onPress={() => router.push("/(tabs)" as any)}
                    />
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle as TextStyle}>Account</Text>
                    <View style={pageStyles.settingCard as ViewStyle}>
                        <SettingItem
                            icon="person-outline"
                            label="Profile Information"
                            onPress={() => router.push('/profile')}
                            showChevron={false}
                        />
                        <View style={pageStyles.divider as ViewStyle} />
                        <SettingItem
                            icon="lock-closed-outline"
                            label="Change Password"
                            onPress={() => router.push("/settings/changePassword")}
                            showChevron={false}
                        />
                    </View>
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle as TextStyle}>Preferences</Text>
                    <View style={pageStyles.settingCard as ViewStyle}>
                        <SettingToggle
                            icon="notifications-outline"
                            label="Push Notifications"
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                        />
                        <View style={pageStyles.divider as ViewStyle} />
                        <SettingToggle
                            icon="moon-outline"
                            label="Dark Mode"
                            value={darkModeEnabled}
                            onValueChange={() => {
                                setDarkModeEnabled(!darkModeEnabled);
                                toggleTheme();
                            }}
                        />
                        <View style={pageStyles.divider as ViewStyle} />
                        <SettingToggle
                            icon="location-outline"
                            label="Location Services"
                            value={locationEnabled}
                            onValueChange={setLocationEnabled}
                        />
                    </View>
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle as TextStyle}>Privacy & Security</Text>
                    <View style={pageStyles.settingCard as ViewStyle}>
                        <SettingItem
                            icon="shield-checkmark-outline"
                            label="Privacy Policy"
                            onPress={() => navigation.navigate('PrivacyPolicy')}
                            showChevron={false}
                        />
                        <View style={pageStyles.divider as ViewStyle} />
                        <SettingItem
                            icon="document-text-outline"
                            label="Terms of Service"
                            onPress={() => navigation.navigate('TermsOfService')}
                            showChevron={false}
                        />
                        <View style={pageStyles.divider as ViewStyle} />
                        <SettingItem
                            icon="log-out-outline"
                            label="Log Out"
                            onPress={() => {}}
                            showChevron={false}
                            rightElement={<Text style={pageStyles.logoutText as TextStyle}>Logout</Text>}
                        />
                    </View>
                </View>

                <View style={pageStyles.section as ViewStyle}>
                    <View style={pageStyles.settingCard as ViewStyle}>
                        <SettingItem
                            icon="information-circle-outline"
                            label="App Version"
                            onPress={() => {}}
                            showChevron={false}
                            rightElement={<Text style={pageStyles.versionText as TextStyle}>1.0.0</Text>}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};



export default Index;