"use client";
import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

export default function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Ładowanie mapy...</div>;
  return <>{children}</>;
}


