"use client"; // ponieważ używamy efektów i window object, musimy wymusić rendering po stronie klienta

import { useEffect, useRef } from "react";

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (mapRef.current && !googleMapRef.current) {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 50.0647, lng: 19.9450 }, // np. Kraków
          zoom: 12,
        });

        new window.google.maps.Marker({
          position: { lat: 50.0647, lng: 19.9450 },
          map: googleMapRef.current,
          title: "Moja ikona",
          icon: "/my-icon.png",
        });
      }
    }
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
}
