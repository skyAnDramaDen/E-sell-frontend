import {useState, useEffect} from "react";
import {Text, View, Image, Pressable, Modal} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";

import {
    Listing
} from "../types/interfaces";

import {delete_listing} from "../services/listingsService";
import TextTicker from 'react-native-text-ticker';

import { useTheme } from "../hooks/useTheme";
import { styles as globalStyles } from "../src/styles/styles";

export default function ListingCard({listing, onDelete}: { listing: Listing, onDelete: (productId: string) => void }) {
    const router = useRouter();
    const {product, images} = listing;
    const [listingImages, setListingImages] = useState<string[] | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const { theme }  = useTheme();
    const pageStyles = globalStyles(theme);

    useEffect(() => {
        setListingImages(images);
    }, []);

    return (
        <Pressable
            onPress={() => {
                router.replace({
                    pathname: `/listing/${product.id}` as any,
                    params: {
                        from: "listings",
                    }
                })
            }}
            style={{  backgroundColor: theme.colors.background  }}
        >
            <View
                style={{padding: 12, borderRadius: 10, backgroundColor: theme.colors.surface}}
            >
                <Pressable onPress={() => setShowModal(true)}
                           style={{
                               position: "absolute",
                               top: 8,
                               right: 8,
                               zIndex: 10,
                               backgroundColor: "rgba(0,0,0,0.6)",
                               width: 32,
                               height: 32,
                               borderRadius: 16,
                               justifyContent: "center",
                               alignItems: "center",
                           }}
                >
                    <Text style={{color: theme.colors.text, fontSize: 15, fontWeight: "bold"}}>×</Text>
                </Pressable>
                {images && images.length > 0 ? (
                    <Image
                        source={{uri: images[0]}}
                        style={{width: "100%", height: 160, borderRadius: 10}}
                        resizeMode="cover"/>
                ) : (
                    <View style={{
                        width: "100%",
                        height: 160,
                        borderRadius: 10,
                        backgroundColor: "#eee",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Text>No Image</Text>
                    </View>)}

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
                                Delete this listing?
                            </Text>

                            <Pressable onPress={async () => {
                                setShowModal(false)
                                const success = await delete_listing(product.id);

                                if (success) {
                                    onDelete(product.id);
                                }
                            }}
                                       style={{
                                           backgroundColor: "red",
                                           padding: 12,
                                           borderRadius: 8,
                                           marginBottom: 10,
                                       }}
                            >
                                <Text style={{color: "#fff", textAlign: "center"}}>Delete</Text>
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
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    {/*<Text style={{fontSize: 18, fontWeight: "600", marginTop: 8, overflow: "scroll"}}>{product.name} </Text>*/}
                    <TextTicker style={{ fontSize: 18, fontWeight: "600", marginTop: 8, width: 120, color: theme.colors.text }} duration={6000} loop bounce={false} repeatSpacer={50} marqueeDelay={1000} > {product.name} </TextTicker>
                    <Text style={{fontSize: 18, fontWeight: "600", marginTop: 8, color: theme.colors.text}}>£{product.price} </Text>
                </View>
            </View>
        </Pressable>
    );
}
