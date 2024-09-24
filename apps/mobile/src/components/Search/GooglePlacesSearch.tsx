import { View, Text } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface GooglePlacesSearchProps {
  region: any;
  setRegion: any;
}

const GooglePlacesSearch = ({ region, setRegion }: GooglePlacesSearchProps) => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      fetchDetails={true}
      // GooglePlacesSearchQuery={{
      //   rankby: "distance",
      //   language: "en",
      // }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
        setRegion({
          center: {
            latitude: details?.geometry?.location?.lat || region.latitude,
            longitude: details?.geometry?.location?.lng || region.longitude,
          },
          heading: 0,
          pitch: 0,
          zoom: 10,
          altitude: 10000,
        });
      }}
      query={{
        key: process.env.GOOGLE_MAPS_API_KEY,
        language: "en",
        components: "country:au",
        //   radius: 30000,
        location: `${region.center.latitude}, ${region.center.longitude}`,
      }}
      styles={{
        container: {
          flex: 0,
          position: "absolute",
          top: 0,
          width: "100%",
          zIndex: 1,
        },
        listView: { backgroundColor: "white" },
      }}
    />
  );
};

export default GooglePlacesSearch;
