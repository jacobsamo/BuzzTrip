import React, { useMemo, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Dimensions, StyleSheet, View } from "react-native";
import GooglePlacesSearch from "@/components/Search/GooglePlacesSearch";
import Sheet from "../Sheet";
import {
  Collection,
  CollectionMarker,
  CombinedMarker,
  Map,
  MapUser,
} from "@buzztrip/db/src/types";

export interface MapViewProps {
  initState: {
    collections: Collection[] | null;
    collectionMarkers: CollectionMarker[] | null;
    markers: CombinedMarker[] | null;
    mapUsers: MapUser[] | null;
    map: Map;
  };
}

export default function MapViewPage({ initState }: MapViewProps) {
  const { collectionMarkers, collections, map, markers, mapUsers } = initState;
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
        googleMapId={process.env.EXPO_PUBLIC_GOOGLE_MAPS_MAPID}
        initialCamera={mapInitialCamera}
        camera={camera}
        mapType="terrain"
      >
        {markers &&
          markers.map((marker) => (
            <Marker
              key={marker.marker_id as string}
              coordinate={{
                latitude: marker.lat as number,
                longitude: marker.lng as number,
              }}
            />
          ))}

        <Marker coordinate={pin} />
      </MapView>
      {/* <Sheet>
        <GooglePlacesSearch region={camera} setRegion={setCamera} />
      </Sheet> */}
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
