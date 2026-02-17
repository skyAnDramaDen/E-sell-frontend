import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native';
import {DrawerNavigationProp} from "@react-navigation/drawer";


export const pickImage = async () => {
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
        return(result);
    }
};

export const pickOneImage = async (): Promise<ImagePicker.ImagePickerResult | any> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Sorry, we need camera roll permissions to make this work!");
                return;
            }

            let result;
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsMultipleSelection: false,
            });


            if (!result.canceled) {
                resolve(result);
            } else {
                resolve(null);
            }
        }, 600)
    })
};

export const takePhoto = async () => {
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
        return result.assets[0].uri;
    }
};