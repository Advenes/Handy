"use client";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface MapComponentProps {
  coords: { lat: number; lng: number };
}

export default function MapComponent({ coords }: MapComponentProps) {
  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "500px" }}
      center={coords}
      zoom={15}
    >
      <Marker position={coords} />
    </GoogleMap>
  );
}
