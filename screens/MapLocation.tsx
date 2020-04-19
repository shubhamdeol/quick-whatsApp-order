import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location";
import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView from "react-native-maps";

import { getSingleAddressFromLocation } from "../services/utilityMethods";
import { store } from "../store";
import { theme } from "../theme";

const LATITUDE_DELTA = 0.00021;
const LONGITUDE_DELTA = 0.00021;

const initialRegion = {
  latitude: 28.459497,
  longitude: 77.026634,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

export default function MapLocation({ navigation }) {
  const [marginBottom, setMarginBottom] = useState(0);
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState({});
  const mapRef = useRef(null);
  const globalState = useContext(store);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        navigation.goBack();
      }

      const isAvailable = await Location.hasServicesEnabledAsync();
      if (isAvailable) {
        getLocation();
      } else {
        showLocationAlert();
      }
    })();
  }, []);

  const showLocationAlert = () => {
    Alert.alert("Enable Location", "Please turn on your location services", [
      {
        text: "NO",
        onPress: () => {
          setStatus("");
        },
        style: "cancel",
      },
      {
        text: "YES",
        onPress: () => {
          IntentLauncher.startActivityAsync(
            IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
          ).then(() => {
            getLocation();
          });
        },
      },
    ]);
  };

  async function getLocation() {
    const location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    const userLocationCoords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const userLocationAddress = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });

    if (userLocationAddress.length) {
      setStatus("found");
      const region = {
        ...userLocationCoords,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      setAddress({
        coords: userLocationCoords,
        addressText: userLocationAddress[0],
      });
      mapRef.current.animateToRegion(region);
    } else {
      setStatus("not_found");
    }
  }

  async function onRegionChange(region) {
    const pinnedLocation = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
    try {
      const updatedAddress = await Location.reverseGeocodeAsync({
        longitude: region.longitude,
        latitude: region.latitude,
      });
      const updatedCoords = {
        ...pinnedLocation,
        latitudeDelta: 0.00021,
        longitudeDelta: 0.00021,
      };
      setStatus("found");
      setAddress({
        coords: updatedCoords,
        addressText: updatedAddress[0],
      });
    } catch (error) {}
  }

  function onPickAddress() {
    const { dispatch } = globalState;
    dispatch({
      type: "setPickedLocation",
      address,
    });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <MapView
        provider="google"
        style={{ flex: 3, marginBottom }}
        onMapReady={() => setMarginBottom(1)}
        ref={mapRef}
        loadingEnabled
        showsMyLocationButton
        showsUserLocation={marginBottom === 1}
        onRegionChangeComplete={onRegionChange}
        // followsUserLocation
        onRegionChange={() => {
          if (status !== "Locating...") {
            setStatus("Locating...");
          }
        }}
        initialRegion={initialRegion}
      />
      <View style={styles.wrapAddress}>
        <View style={styles.wrapAddressInner}>
          <View style={styles.wrapMapIcon}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              color={theme.colors.secondary}
              size={20}
            />
          </View>
          <Text style={styles.city}>
            {address && address.addressText && status !== "Locating..."
              ? address.addressText.city || address.addressText.region
              : status}
          </Text>
          {!!address.coords && (
            <Text
              style={styles.coords}
            >{`( Lat: ${address.coords.latitude
              .toString()
              .slice(0, 10)}, Long: ${address.coords.longitude
              .toString()
              .slice(0, 10)} )`}</Text>
          )}
        </View>

        {!!address.addressText && (
          <Text style={styles.addressText}>
            {getSingleAddressFromLocation(address.addressText)}
          </Text>
        )}
        <TouchableOpacity
          disabled={!address.addressText}
          style={[styles.pickButton]}
          onPress={onPickAddress}
        >
          <Text style={styles.pickButtonText}>Pick This Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  wrapAddress: {
    flex: 1,
    justifyContent: "space-between",
  },
  wrapMapIcon: {
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.white_primary,
    elevation: 2,
  },
  wrapAddressInner: {
    flexDirection: "row",
    padding: 10,
  },
  city: {
    fontSize: theme.fontSize.small,
    color: theme.colors.gray_primary,
    fontWeight: "bold",
    marginLeft: 10,
    top: 4,
  },
  addressText: {
    color: theme.colors.black_primary,
    marginVertical: 8,
    marginHorizontal: 12,
  },
  coords: {
    fontSize: theme.fontSize.xxsmall,
    top: 7,
    left: 10,
    fontWeight: "bold",
    color: theme.colors.gray_primary,
  },
  pickButton: {
    backgroundColor: theme.colors.primary,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  pickButtonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: theme.fontSize.large,
  },
});
