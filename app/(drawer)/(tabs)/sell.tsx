import React, {useEffect, useState} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Pressable} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import {
    CategoryNode
} from "../../../types/interfaces";

import taxonomy from "../../../assets/taxonomy.json";
import { useLocation } from "../../../hooks/useLocation";

import * as Location from "expo-location";

export default function SellScreen() {
    // const { coords, address, useLocationError, setUseLocationLoading, getLocation } = useLocation();
    const router = useRouter();
    const { login, loading, error, user } = useAuth();
    const [images, setImages] = useState<string[] | null>([]);
    const [image, setImage] = useState<string | null>(null);

    const [selectedTop, setSelectedTop] = useState<CategoryNode | null | undefined>(null);
    const [selectedSecond, setSelectedSecond] = useState<CategoryNode | null | undefined>(null);
    const [selectedThird, setSelectedThird] = useState<CategoryNode | null | undefined>(null);

    const [description, setDescription] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [condition, setCondition] = useState<string | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [availability , setAvailability] = useState<boolean | null>(true);
    const [location, setLocation] = useState<string>("");



    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [geocode1, setGeocode1] = useState<any>(null);
    const [address, setAddress] = useState<string | undefined>(undefined);
    const [useLocationError, setUseLocationError] = useState<string | null>(null);
    const [useLocationLoading, setUseLocationLoading] = useState(false);

    useEffect(() => {
        // console.log(address);
    }, [coords, address]);

    const getLocation = async () => {
        try {
            setUseLocationLoading(true);

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setUseLocationError("Location permission denied");
                setUseLocationLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            setCoords({ latitude, longitude });

            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            setGeocode1(geocode[0]);
            setAddress(geocode1.city + ", " + geocode1.subregion);
        } catch (err) {
            setUseLocationError("Failed to get location");
        } finally {
            setUseLocationLoading(false);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //if I set allowsEditing to true, I cannot select multiple images.
            allowsEditing: false,
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            setImages(result.assets.map(asset => asset.uri))
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Camera access is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (title && description && condition && price && selectedTop && selectedSecond && user) {

            const formData = new FormData();

            if (images != null) {
                images.forEach((uri, i) => {
                    formData.append("images", {
                        uri,
                        type: "image/jpeg",
                        name: `photo_${i}.jpg`,
                    } as any);
                });
            }

            formData.append("name", title);
            formData.append("description", description);
            formData.append("condition", condition);
            formData.append("price", price.toString());
            formData.append("subCategoryId", selectedSecond.id.toString());
            formData.append("subCategory", selectedSecond.name);
            formData.append("topCategoryId", selectedTop.id.toString());
            formData.append("topCategory", selectedTop.name);

            if (selectedThird) {
                formData.append("lowestCategoryId", selectedThird.id.toString());
                formData.append("lowestCategory", selectedThird.name);
            }
            formData.append("userId", user.id);

            try {
                const res = await fetch("http://172.20.10.11:3000/listing/add", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();


                router.replace(`/listing/${data.product.id}`)
            } catch (error) {
            }
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Create a Listing</Text>

                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 20,
                        justifyContent: "space-evenly",
                    }}
                >
                    <TouchableOpacity onPress={pickImage} >
                        <LinearGradient
                            colors={["#ff6a00", "#ee0979"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>Choose from Gallery</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={takePhoto} >
                        <LinearGradient
                            colors={["#4c669f", "#3b5998", "#192f6a"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>Take a Photo</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}
                >
                    {image && <Image source={{ uri: image }} style={styles.preview} />}
                    {images && images.map((uri, index) => (
                        <Image
                            key={index}
                            source={{ uri }}
                            style={{ width: 100, height: 100, borderRadius: 8, margin: 5 }}
                        />
                    ))}
                </View>

                <Text>Name</Text>
                <TextInput
                placeholder="Enter name"
                value={title}
                onChangeText={(text) => {
                    setTitle(text);
                }}
                style={styles.input}
                />


                <Text>Description</Text>
                <TextInput
                    placeholder="Description"
                    value={description ?? ""}
                    onChangeText={(text) => {
                        setDescription(text);
                    }}
                    style={[styles.input, { height: 100 }]}
                    multiline
                />

                <Text>Price</Text>
                <TextInput
                    placeholder="Price"
                    value={price !== null ? price.toString() : ""}
                    onChangeText={(text) => {
                        setPrice(Number(text));
                    }}
                    style={[styles.input, { height: 100, color: "#000" }]}
                    multiline
                />
                
                <Text>Condition</Text>
                <Picker
                    selectedValue={condition}
                    onValueChange={(condition) => {
                        setCondition(condition);
                    }}
                    // style={{
                    //     height: 50
                    // }}
                    style={{ marginVertical: 8, width: 250 }}
                >
                    <Picker.Item label="Select a condition" value ="" />
                    <Picker.Item label="New" value="new" color = "#000" />
                    <Picker.Item label="Used - Like New" value="like_new" color = "#000" />
                    <Picker.Item label="Used - Good" value="good" color = "#000" />
                    <Picker.Item label="Used - Fair" value="fair" color = "#000" />
                </Picker>


                <Picker
                    selectedValue={selectedTop?.id ?? ""}
                    onValueChange={(catID) => {
                        const category = taxonomy.find((cat) => cat.id === catID);
                        setSelectedTop(category);
                        setSelectedSecond(null);
                        setSelectedThird(null);
                    }}
                    // style={{
                    //     height: 50
                    // }}
                    style={{ marginVertical: 8, width: 300 }}
                >
                    <Picker.Item label = "Select a category" value= "" color="#888" />
                    {
                        taxonomy.map((subCat) => (
                            <Picker.Item key = {subCat.id} label = {subCat.name} value = {subCat.id} color="#000" />
                        ))
                    }

                </Picker>

                {
                    selectedTop && (
                        <Picker
                            selectedValue={selectedSecond?.id ?? ""}
                            onValueChange={(subCatID) => {
                                const subCategory = selectedTop.children?.find((subCat2) => subCat2.id === subCatID);
                                setSelectedSecond(subCategory);
                                setSelectedThird(null);
                            }}
                            style={{ marginVertical: 8, width: 300 }}
                        >
                            <Picker.Item label="Select a sub-category" value ="" color="#888" />
                            {
                                selectedTop.children?.map((selectedTopCatChild) => (
                                    <Picker.Item key = {selectedTopCatChild.id} label = {selectedTopCatChild.name} value = {selectedTopCatChild.id} color = "#000"/>
                                ))
                            }
                        </Picker>
                    )
                }

                {
                    selectedSecond && selectedSecond.children.length > 0 && (
                        <Picker
                            selectedValue={selectedThird?.id ?? ""}
                            onValueChange={(subCatID) => {
                                const subCategory = selectedSecond.children?.find((subCat2) => subCat2.id === subCatID);
                                setSelectedThird(subCategory);
                            }}
                            style={{ marginVertical: 8, width: 300 }}
                        >
                            <Picker.Item label="Select a sub-category" value ="" color="#888" />
                            {
                                selectedSecond.children?.map((selectedSecondCatChild) => (
                                    <Picker.Item key = {selectedSecondCatChild.id} label = {selectedSecondCatChild.name} value = {selectedSecondCatChild.id} color = "#000"/>
                                ))
                            }
                        </Picker>
                    )
                }
                <View>
                    <TextInput
                        placeholder="Enter a location"
                        value={address}
                        onChangeText={setAddress}
                        style={{
                            height: 45,
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            color: "#000",
                            marginBottom: 12,
                        }}
                    />

                    <Pressable
                        onPress={async () => {
                            await getLocation();

                        }}
                    ><Text>Use my location</Text></Pressable>
                </View>


                <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.submitButton}
                >
                    <Text style={styles.submitText}>Create Listing</Text>
                </TouchableOpacity>



            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        display: "flex",
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 20,
        alignItems: "center",
    },
    preview: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 20,
    },
    gradientButton: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginVertical: 8,
        backgroundColor: "#fff",
    },
    submitButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 14,
        borderRadius: 8,
        marginVertical: 20,
        alignItems: "center",
    },
    submitText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
