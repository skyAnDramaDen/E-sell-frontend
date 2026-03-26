import React from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet
} from "react-native";
import { useRouter} from "expo-router";
import { useTheme } from "../hooks/useTheme";
import { styles as globalStyles } from "../src/styles/styles";

import {
    Listing
} from "../types/interfaces";
import TextTicker from "react-native-text-ticker";

export default function ListProduct({ item, width }: { item: Listing, width?: number }) {
    const router = useRouter();
    const { isDark, theme }  = useTheme();
    const pageStyles = globalStyles(theme);
    return (
        <TouchableOpacity
            style={[pageStyles.listProductContainer, { width }, { backgroundColor: theme.colors.surface}]}
            onPress={() => {
                router.push({
                    pathname: `/listing/${item.product.id}` as any,
                    params: {
                        from: "search-page"
                    }
                })
            }}
        >
            <Image
                source={{ uri: item.images[0] }}
                style={pageStyles.list_product_image}
            />

            <View style={pageStyles.details}>
                <View style={pageStyles.listing_info_card}>
                    <TextTicker style={{ fontSize: 18, fontWeight: "600", width: 120, color: theme.colors.text }} duration={6000} loop bounce={false} repeatSpacer={50} marqueeDelay={1000} >{item.product.name} </TextTicker>
                    {item.product.price && <Text style={pageStyles.price}>£{item.product.price}</Text>}
                </View>
                {item.product.topCategory && <TextTicker style={pageStyles.category}
                                                         duration={6000} loop bounce={false} repeatSpacer={50} marqueeDelay={1000}

                                                   ellipsizeMode="tail"
                >{item.product.lowestCategory}</TextTicker>}
            </View>
        </TouchableOpacity>
    );
}