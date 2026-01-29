"use client"

import { useEffect, useMemo, useRef, memo, useCallback, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Delivery } from "@/app/data"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapComponentProps {
  locations: Delivery[]
  selectedLocation: Delivery | null
}

// Fix default marker icon issue with webpack (only run once)
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}

// Memoized component to handle map updates - instant performance
const MapUpdater = memo(({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom, { animate: false })
  }, [map, center, zoom])
  
  return null
})
MapUpdater.displayName = 'MapUpdater'

// Memoized component to fit bounds - instant no animation
const FitBounds = memo(({ locations, selectedLocation }: { locations: Delivery[]; selectedLocation: Delivery | null }) => {
  const map = useMap()
  
  useEffect(() => {
    if (selectedLocation) return
    if (locations.length === 0) return
    
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 13, { animate: false })
    } else {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]))
      map.fitBounds(bounds, { 
        padding: [30, 30], 
        maxZoom: 15,
        animate: false
      })
    }
  }, [locations, selectedLocation, map])
  
  return null
})
FitBounds.displayName = 'FitBounds'

// Simplified Marker for better performance
const LocationMarker = memo(({ 
  location, 
  icon 
}: { 
  location: Delivery; 
  icon: L.Icon 
}) => {
  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={icon}
    >
      <Popup maxWidth={250} minWidth={200}>
        <div className="p-2">
          <h3 className="font-bold text-sm mb-1">{location.location}</h3>
          <p className="text-xs mb-1">Code: <span className="font-mono">{location.code}</span></p>
          <p className="text-xs mb-2">Delivery: {location.delivery}</p>
          <div className="flex gap-1">
            {location.descriptionsObj?.websiteLink && (
              <a 
                href={location.descriptionsObj.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-1 px-1 bg-blue-500 text-white rounded text-xs"
              >
                Website
              </a>
            )}
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-1 px-1 bg-green-500 text-white rounded text-xs"
            >
              Directions
            </a>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return prevProps.location.code === nextProps.location.code && 
         prevProps.icon === nextProps.icon
})
LocationMarker.displayName = 'LocationMarker'

export const MapComponent = memo(({ locations, selectedLocation }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  
  // Filter valid locations (dengan koordinat yang valid)
  const validLocations = useMemo(() => {
    return locations.filter(loc => 
      loc.lat !== 0 && loc.lng !== 0 && 
      parseFloat(loc.lat.toString()) !== 0 && 
      parseFloat(loc.lng.toString()) !== 0
    )
  }, [locations])
  
  // Calculate center from locations
  const defaultCenter: [number, number] = useMemo(() => {
    if (validLocations.length === 0) {
      return [3.1390, 101.6869] // Default to KL
    }
    
    const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length
    const avgLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0) / validLocations.length
    return [avgLat, avgLng]
  }, [validLocations])
  
  // Determine map center and zoom based on selected location
  const { center, zoom } = useMemo(() => {
    if (selectedLocation && selectedLocation.lat !== 0 && selectedLocation.lng !== 0) {
      return {
        center: [selectedLocation.lat, selectedLocation.lng] as [number, number],
        zoom: 16
      }
    }
    return {
      center: defaultCenter,
      zoom: 10
    }
  }, [selectedLocation, defaultCenter])
  
  // Create and cache standard Leaflet icons for better performance
  const { normalIcon, selectedIcon } = useMemo(() => {
    const baseConfig = {
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      popupAnchor: [0, -28] as [number, number],
      shadowSize: [32, 32] as [number, number]
    }
    
    return {
      normalIcon: new L.Icon({
        ...baseConfig,
        iconSize: [20, 32] as [number, number],
        iconAnchor: [10, 32] as [number, number],
      }),
      selectedIcon: new L.Icon({
        ...baseConfig,
        iconSize: [25, 40] as [number, number],
        iconAnchor: [12.5, 40] as [number, number],
      })
    }
  }, [])

  // Reset view callback - instant
  const handleReset = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(defaultCenter, 10, { animate: false })
    }
  }, [defaultCenter])

  // Locate user callback - instant
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported')
      setTimeout(() => setLocationError(null), 3000)
      return
    }
    
    setIsLocating(true)
    setLocationError(null)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos: [number, number] = [position.coords.latitude, position.coords.longitude]
        setUserLocation(userPos)
        setIsLocating(false)
        if (mapRef.current) {
          mapRef.current.setView(userPos, 15, { animate: false })
        }
      },
      (error) => {
        setIsLocating(false)
        const errorMessages: Record<number, string> = {
          1: 'Location access denied',
          2: 'Location unavailable',
          3: 'Location timeout'
        }
        setLocationError(errorMessages[error.code] || 'Location error')
        setTimeout(() => setLocationError(null), 3000)
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 30000
      }
    )
  }, [])

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-lg"
        preferCanvas={true}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={false}
        touchZoom={true}
        dragging={true}
        boxZoom={false}
        fadeAnimation={false}
        markerZoomAnimation={false}
        zoomAnimation={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
          minZoom={5}
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={2}
        />
        
        <MapUpdater center={center} zoom={zoom} />
        <FitBounds locations={validLocations} selectedLocation={selectedLocation} />
        
        {/* Render all markers with memoized components */}
        {validLocations.map((location) => {
          const isSelected = selectedLocation?.id === location.id
          
          return (
            <LocationMarker
              key={location.id}
              location={location}
              icon={isSelected ? selectedIcon : normalIcon}
            />
          )
        })}
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center p-1">
                <p className="font-semibold text-sm">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Control buttons */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Locate button */}
        <button 
          onClick={handleLocate}
          disabled={isLocating}
          className={`bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isLocating ? 'animate-pulse' : ''
          }`}
          title="Find my location"
          aria-label="Find my location"
        >
          {isLocating ? (
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
        
        {/* Reset button */}
        <button 
          onClick={handleReset}
          className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Reset view"
          aria-label="Reset map view"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      {/* Location count badge */}
      {validLocations.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {validLocations.length} {validLocations.length === 1 ? 'location' : 'locations'}
          </p>
        </div>
      )}
      
      {/* Error notification */}
      {locationError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {locationError}
          </p>
        </div>
      )}
    </div>
  )
})
MapComponent.displayName = 'MapComponent'
