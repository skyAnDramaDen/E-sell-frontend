import {Text, View, Pressable, ScrollView, ViewStyle, TextStyle, StatusBar} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import SellButton from "../../../components/SellButton";
import {useNavigation, useRouter} from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import ActionButton from "../../../components/ActionButton";
import ProductCategoryCard from "../../../components/ProductCategoryCard";
import { Ionicons } from "@expo/vector-icons"; import { TouchableOpacity } from "react-native"
import React, {useEffect, useState} from "react";
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';

import { styles as globalStyles } from '../../../src/styles/styles';
import {SafeAreaView} from "react-native-safe-area-context";
import { useTheme } from "../../../hooks/useTheme";

export default function Index() {
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { theme } = useTheme();
    const pageStyles = globalStyles(theme);
    const [loadedCount, setLoadedCount] = useState(0);
    const totalImages = 6;
    const allLoaded = loadedCount === totalImages;

    const [fontsLoaded] = useFonts({
        Pacifico_400Regular,
    });

    if (!fontsLoaded) return null;

    return (
        <SafeAreaView style={{ flex: 1, borderStyle: "solid", borderColor: 'red', backgroundColor: theme.colors.background  }}
                      edges={["top", "left", "right"]}
        >
            <StatusBar backgroundColor="transparent" translucent />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[pageStyles.scrollContainer as ViewStyle, { backgroundColor: theme.colors.background }]}>
                <View style={pageStyles.header as ViewStyle}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={pageStyles.menuButton as ViewStyle}>
                        <Ionicons name="menu" size={25} color={theme.colors.text} />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={pageStyles.titleGradient as ViewStyle}
                    >
                        <Text style={{ fontFamily: 'Pacifico_400Regular', fontSize: 20 }}>E-Sell</Text>
                    </LinearGradient>
                </View>

                <View style={pageStyles.actionsRow as ViewStyle}>
                    <SellButton onPress={() => router.navigate('/sell')} />
                    <ActionButton name="Listings" onPress={() => router.push('/listing')} />
                </View>

                <Pressable
                    onPress={() => router.push('/search')}
                    style={pageStyles.searchBar as ViewStyle}
                >
                    <Ionicons name="search" size={20} color={theme.colors.textLight} style={pageStyles.searchIcon as TextStyle} />
                    <Text style={pageStyles.searchText as TextStyle}>Search</Text>
                </Pressable>

                <View style={pageStyles.section as ViewStyle}>
                    <Text style={pageStyles.sectionTitle as TextStyle}>Browse Categories</Text>
                    {!allLoaded && (
                        <View style={{ padding: 20 }}>
                            <Text style={{ color: theme.colors.text }}>Loading categories…</Text>
                        </View>
                    )}
                    <View style={[pageStyles.grid as ViewStyle, { opacity: allLoaded ? 1 : 0 }]}>
                        <ProductCategoryCard
                            category="Electronics"
                            imageSource={require("../../../assets/images/pexels-photo-1105379-electronics.jpeg")}
                            onLoaded={() => setLoadedCount(prev => prev + 1)}
                        />
                        <ProductCategoryCard
                            category="Mobile Phones"
                            imageSource={require("../../../assets/images/pexels-photo-10791677-phones.jpeg")}
                            onLoaded={() => setLoadedCount(prev => prev + 1)}
                        />
                        <ProductCategoryCard
                            category="Accessories"
                            imageSource={require("../../../assets/images/pexels-photo-325153-accessories.jpeg")}
                            onLoaded={() => setLoadedCount(prev => prev + 1)}
                        />
                        <ProductCategoryCard
                            category="Audio"
                            imageSource={require("../../../assets/images/pexels-photo-14935011-audio.jpeg")}
                            onLoaded={() => setLoadedCount(prev => prev + 1)}
                        />
                        <ProductCategoryCard
                            category="Gaming"
                            imageSource={require("../../../assets/images/pexels-photo-35005905-gaming.jpeg")}
                            onLoaded={() => setLoadedCount(prev => prev + 1)}
                        />
                        <ProductCategoryCard
                            category="Cameras"
                            imageSource={require("../../../assets/images/pexels-photo-955794-cameras.jpeg")}
                            onLoaded={() => setLoadedCount(prev => prev + 1)}
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}