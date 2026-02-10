import * as Location from "expo-location";
import { useState } from "react";

export function useLocation() {
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [address, setAddress] = useState<any>(null);
    const [useLocationError, setUseLocationError] = useState<string | null>(null);
    const [useLocationLoading, setUseLocationLoading] = useState(false);

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
            setAddress(geocode[0]);
        } catch (err) {
            setUseLocationError("Failed to get location");
        } finally {
            setUseLocationLoading(false);
        }
    };

    return { coords, address, useLocationError, setUseLocationLoading, getLocation };
}
