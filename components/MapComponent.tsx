"use client"

import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '500px',
}

const center = {
  lat: 50.0647,
  lng: 19.9450,
}

function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const [map, setMap] = React.useState<google.maps.Map | null>(null)

  const onLoad = React.useCallback((mapInstance: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center)
    mapInstance.fitBounds(bounds)
    setMap(mapInstance)
  }, [])

  const onUnmount = React.useCallback(() => {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Tu możesz dodać Markery, InfoWindow itd. */}
      <></>
    </GoogleMap>
  ) : (
    <div>Ładowanie mapy...</div>
  )
}

export default React.memo(MapComponent)
