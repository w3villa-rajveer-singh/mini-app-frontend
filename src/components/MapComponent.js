import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const libraries = ["places"]; // 🔥 IMPORTANT

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 26.4499,
  lng: 80.3319,
};

const MapComponent = ({ setLocation }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries, // 🔥 REQUIRED for autocomplete
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(defaultCenter);
  const [autocomplete, setAutocomplete] = useState(null);

  if (!isLoaded) return <div>Loading...</div>;

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setMarker({ lat, lng });

      setLocation({
        address: place.formatted_address,
        latitude: lat,
        longitude: lng,
      });

      map.panTo({ lat, lng });
    }
  };

  return (
    <div>
      {/* 🔍 SEARCH INPUT WITH SUGGESTIONS */}
      <Autocomplete
        onLoad={(auto) => setAutocomplete(auto)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search your location"
          style={{
            width: "100%",
            height: "40px",
            marginBottom: "10px",
            padding: "8px",
          }}
        />
      </Autocomplete>

      {/* 🗺️ MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker}
        zoom={12}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        <Marker position={marker} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;