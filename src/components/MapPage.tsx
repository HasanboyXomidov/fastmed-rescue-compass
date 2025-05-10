
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Send, Navigation, LogOut, HeartPulse } from "lucide-react";
import L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { useNavigate } from 'react-router-dom';

interface MapPageProps {
  onLogout: () => void;
}

interface SelectedLocation {
  lat: number;
  lng: number;
  address?: string;
}

// Create default marker icons
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapPage: React.FC<MapPageProps> = ({ onLogout }) => {
  const [currentLocation, setCurrentLocation] = useState<SelectedLocation | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Function to get the current location
  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      setCurrentLocation({
        lat: latitude,
        lng: longitude
      });
      
      // Also set as selected location initially
      setSelectedLocation({
        lat: latitude,
        lng: longitude
      });
      
      // Get address for the current location
      getAddressFromCoordinates(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location', error);
      toast({
        title: "Location Error",
        description: "Could not get your current location. Please enable location services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reverse geocoding function to get address from coordinates
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    setIsAddressLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setSelectedLocation(prev => 
          prev ? { ...prev, lat, lng, address: data.display_name } : { lat, lng, address: data.display_name }
        );
      }
    } catch (error) {
      console.error('Error getting address', error);
      toast({
        title: "Address Error",
        description: "Could not retrieve the address for this location.",
        variant: "destructive",
      });
    } finally {
      setIsAddressLoading(false);
    }
  };

  // Function to send the selected location (In a real app, this would connect to a backend)
  const sendLocation = async () => {
    if (!selectedLocation) return;
    
    setIsSending(true);
    try {
      // Simulate sending location to emergency services
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Emergency Alert Sent",
        description: "Your location has been sent to emergency services. Help is on the way.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Map click handler component
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({
          lat,
          lng
        });
        getAddressFromCoordinates(lat, lng);
      },
    });
    return null;
  };

  // Handle logout
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <HeartPulse />
          <span>FastMed</span>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-1">
          <LogOut size={16} /> Logout
        </Button>
      </header>

      <main className="flex-grow p-4 overflow-auto">
        <Card className="p-4 mb-4">
          <h1 className="text-xl font-bold mb-2">Emergency Location Service</h1>
          <p className="text-gray-600">
            Select your location on the map or use the "Get My Location" button to automatically detect your position.
          </p>
        </Card>

        <div className="map-container mb-4">
          {currentLocation ? (
            <MapContainer 
              center={[currentLocation.lat, currentLocation.lng] as [number, number]} 
              zoom={15} 
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Current location marker */}
              {currentLocation && (
                <Marker 
                  position={[currentLocation.lat, currentLocation.lng] as [number, number]} 
                  icon={markerIcon}
                >
                  <Popup>
                    Your current location
                  </Popup>
                </Marker>
              )}
              
              {/* Selected location marker */}
              {selectedLocation && selectedLocation !== currentLocation && (
                <Marker 
                  position={[selectedLocation.lat, selectedLocation.lng] as [number, number]} 
                  icon={markerIcon}
                >
                  <Popup>
                    {isAddressLoading ? (
                      "Loading address..."
                    ) : (
                      selectedLocation.address || "Selected location"
                    )}
                  </Popup>
                </Marker>
              )}
              
              <MapClickHandler />
            </MapContainer>
          ) : (
            <div className="h-[70vh] flex items-center justify-center bg-gray-100">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading map...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Button onClick={getCurrentLocation}>Retry Loading Map</Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Selected Address Display */}
          <Card className="p-4 bg-gray-50">
            <h3 className="font-medium text-sm text-gray-500 mb-1">Selected Location</h3>
            {isAddressLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <p>Getting address...</p>
              </div>
            ) : (
              <p className="font-medium">{selectedLocation?.address || "No location selected"}</p>
            )}
          </Card>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="emergency-button" 
              onClick={getCurrentLocation}
              disabled={isLoading}
              variant="default"
            >
              <Navigation size={20} className="mr-2" />
              {isLoading ? "Getting Location..." : "Get My Location"}
            </Button>
            
            <Button 
              className="emergency-button"
              onClick={sendLocation}
              disabled={isSending || !selectedLocation}
              variant="destructive"
            >
              <Send size={20} className="mr-2" />
              {isSending ? "Sending..." : "Send Emergency Alert"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapPage;
