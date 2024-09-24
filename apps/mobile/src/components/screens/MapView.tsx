import React, { useMemo, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Dimensions, StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import GooglePlacesSearch from "@/components/Search/GooglePlacesSearch";
import Sheet from "../Sheet";

export default function MapViewPage() {
  const mapRef = useRef<any>();
  const [pin, setPin] = React.useState({
    latitude: 0,
    longitude: 0,
  });
  const [region, setRegion] = React.useState({
    latitude: -25.2744,
    longitude: 133.7751,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [camera, setCamera] = React.useState({
    center: {
      latitude: -25.2744,
      longitude: 133.7751,
    },
    heading: 0,
    pitch: 0,
    zoom: 0,
    altitude: 40000,
  });

  const mapInitialCamera = useMemo(
    () => ({
      center: {
        latitude: -25.2744,
        longitude: 133.7751,
      },
      heading: 0,
      pitch: 0,
      zoom: 10,
      altitude: 10000,
    }),
    []
  );

  return (
    <View style={styles.container} id="container">
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton
        showsUserLocation
        ref={mapRef}
        initialRegion={region}
        onLongPress={(e) => {
          console.log(e.nativeEvent.coordinate);
          setPin(e.nativeEvent.coordinate);
        }}
        googleMapId={process.env.GOOGLE_MAPS_MAPID}
        initialCamera={mapInitialCamera}
        camera={camera}
        mapType="terrain"
      >
        <Marker
          coordinate={{
            latitude: camera.center.latitude,
            longitude: camera.center.longitude,
          }}
        />

        <Marker coordinate={pin} />
      </MapView>
      <Sheet>
        <GooglePlacesSearch region={camera} setRegion={setCamera} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
