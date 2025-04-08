"use client"

import { useEffect, useRef, useState } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import { Wrapper, Status } from "@googlemaps/react-wrapper"

interface MapDisplayProps {
  campusLocation: { lat: number; lng: number }
  radius: number
  postcodeLocation: { lat: number; lng: number } | null
  isWithinRadius: boolean
}

// You would need to replace this with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"

// Declare google variable
declare global {
  interface Window {
    google: any
  }
}

export default function MapDisplay({ campusLocation, radius, postcodeLocation, isWithinRadius }: MapDisplayProps) {
  const render = (status: Status) => {
    if (status === Status.LOADING) return <CircularProgress />
    if (status === Status.FAILURE) return <Typography color="error">Error loading map</Typography>
    return null
  }

  return (
    <Box className="h-full">
      <Typography variant="h6" className="mb-4">
        Map Visualization
      </Typography>
      <Box className="h-[400px] w-full">
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
          <MapComponent
            campusLocation={campusLocation}
            radius={radius}
            postcodeLocation={postcodeLocation}
            isWithinRadius={isWithinRadius}
          />
        </Wrapper>
      </Box>
      <Typography variant="caption" className="mt-2 block text-gray-500">
        The circle represents the allowable radius from the campus location.
      </Typography>
    </Box>
  )
}

function MapComponent({ campusLocation, radius, postcodeLocation, isWithinRadius }: MapDisplayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [circle, setCircle] = useState<google.maps.Circle | null>(null)
  const [campusMarker, setCampusMarker] = useState<google.maps.Marker | null>(null)
  const [postcodeMarker, setPostcodeMarker] = useState<google.maps.Marker | null>(null)

  // Initialize map
  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: campusLocation,
        zoom: 10,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      })
      setMap(newMap)
    }
  }, [ref, map, campusLocation])

  // Update campus marker and radius circle
  useEffect(() => {
    if (map) {
      // Update or create campus marker
      if (campusMarker) {
        campusMarker.setPosition(campusLocation)
      } else {
        const newMarker = new window.google.maps.Marker({
          position: campusLocation,
          map,
          title: "Campus Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        })
        setCampusMarker(newMarker)
      }

      // Update or create radius circle
      if (circle) {
        circle.setCenter(campusLocation)
        circle.setRadius(radius * 1000) // Convert km to meters
      } else {
        const newCircle = new window.google.maps.Circle({
          strokeColor: "#3f51b5",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#3f51b5",
          fillOpacity: 0.1,
          map,
          center: campusLocation,
          radius: radius * 1000, // Convert km to meters
        })
        setCircle(newCircle)
      }

      // Center map to fit both points if postcode location exists
      if (postcodeLocation) {
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(campusLocation)
        bounds.extend(postcodeLocation)
        map.fitBounds(bounds)
      } else {
        map.setCenter(campusLocation)
        map.setZoom(10)
      }
    }
  }, [map, campusLocation, radius, circle, campusMarker])

  // Update postcode marker
  useEffect(() => {
    if (map && postcodeLocation) {
      // Remove old marker if exists
      if (postcodeMarker) {
        postcodeMarker.setMap(null)
      }

      // Create new marker
      const newMarker = new window.google.maps.Marker({
        position: postcodeLocation,
        map,
        title: "Postcode Location",
        icon: {
          url: isWithinRadius
            ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        },
      })
      setPostcodeMarker(newMarker)

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div>
          <strong>${isWithinRadius ? "Eligible" : "Not Eligible"}</strong><br>
          Distance: ${
            postcodeLocation
              ? calculateDistance(campusLocation.lat, campusLocation.lng, postcodeLocation.lat, postcodeLocation.lng)
              : 0
          } km
        </div>`,
      })

      newMarker.addListener("click", () => {
        infoWindow.open(map, newMarker)
      })
    } else if (postcodeMarker) {
      postcodeMarker.setMap(null)
      setPostcodeMarker(null)
    }
  }, [map, postcodeLocation, isWithinRadius, postcodeMarker, campusLocation])

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />
}

// Haversine formula to calculate distance between two coordinates in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return Number.parseFloat(distance.toFixed(2))
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
