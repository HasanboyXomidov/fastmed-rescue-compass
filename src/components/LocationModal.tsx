import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { io } from "socket.io-client";
import { Geolocation } from '@capacitor/geolocation';
interface Props {  
  setAddress: (address: string) => void;
}

const LocationModal: React.FC<Props> = ({ setAddress }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [locationName, setLocationName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([41.3111, 69.2797], 13); // Tashkent
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      map.on("moveend", () => {
        const center = map.getCenter();
        fetchLocationName(center.lat, center.lng);
        setSelectedLocation({ latitude: center.lat, longitude: center.lng });
      });

      mapRef.current = map;
      setLoading(false);
    }
  }, []);

  
  //  <----- web-sockets:start ----->
  // const ws = new WebSocket("ws://fastmed-api-production.up.railway.app/ws");

// function sendLocation(phone: string, latitude: number, longitude: number) {
//     ws.send(JSON.stringify({
//         phone,
//         latitude,
//         longitude
//       }));  
// }
//#  <----- web-sockets:end ----->



  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: { lat, lon, format: "json" },
      });
      if (res.data && res.data.display_name) {
        setLocationName(res.data.display_name);
      }
    } catch {
      setLocationName("Noma'lum joy");
    }
  };

  const goToCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }
    const coords = await Geolocation.getCurrentPosition();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // const { latitude, longitude } = pos.coords;
        const { latitude, longitude } = coords.coords;
        mapRef.current?.setView([latitude, longitude], 15);
        fetchLocationName(latitude, longitude);
        setSelectedLocation({ latitude, longitude });
        setLoading(false);
      },
      () => alert("Lokatsiyani aniqlab bo'lmadi.")
    );
  };

  const searchLocation = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: searchQuery, format: "json", limit: 1 },
      });

      if (res.data.length > 0) {
        const lat = parseFloat(res.data[0].lat);
        const lon = parseFloat(res.data[0].lon);
        mapRef.current?.setView([lat, lon], 15);
        fetchLocationName(lat, lon);
      } else {
        alert("Topilmadi.");
      }
    } catch {
      alert("Qidiruvda xatolik.");
    }
  };

  const saveLocation = () => {
    if (selectedLocation) {
      localStorage.setItem("location", JSON.stringify(selectedLocation));      
    //   setAddress(locationName);      
      try{
        const fastmed_user_phone = localStorage.getItem("fastMed_userPhone");
        const location = JSON.parse(localStorage.getItem("location") || "{}");
        const { latitude, longitude } = location;
        alert(fastmed_user_phone + " " + selectedLocation.latitude + " " + selectedLocation.longitude);

        if (fastmed_user_phone && latitude && longitude) {
            // sendLocation(fastmed_user_phone, latitude, longitude);
            alert("Lokatsiya jo'natildi!! "+ fastmed_user_phone + " " + latitude + " " + longitude);
        } else {
            alert("Telefon raqamingizni kiritmadingiz.");
        }
        // alert("Lokatsiya saqlandi.");

      }
      catch(e){
        alert("Xatolik: "+ e);
      }
      
        


        // Optionally close the modal or perform other actions
        // closeModal();
         
    }
  };

  return (
    <div className="modal-content" style={{
      padding: "20px",
      width: "90%",
      maxWidth: "400px",
      margin: "auto",
      backgroundColor: "#9999999",
    }}
    >
      {/* <div style={{ border: '2px solid red', backgroundColor: 'white', padding: '20px' }}> */}
      {/* <h2 style={{ border: '1px solid blue' }}>Qidiruv</h2> */}
      <h2>Qidiruv</h2>
      <input
        style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        className="search-input"
        type="text"
        placeholder="Lokatsiyani qidirish"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && searchLocation()}
      />
      <div id="map" className="map-container" style={{
    height: "300px",
    marginTop: "10px",
    position: "relative",
    border: "1px solid black"
  }}>
  {/* Pointer loader or marker */}
  <div className="map-pointer">
    { (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#ffd100">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>
    )}
  </div>
</div>

      <div className="controls" style={{ marginTop: "10px", display: "flex", margin:"5px", justifyContent: "end" }}>
        <button onClick={goToCurrentLocation} style={{ marginRight: "10px" , borderRadius:"5px", padding:"5px", backgroundColor :"yellow",  color:"black"}}>Mening lokatsiyam</button>
        <button onClick={saveLocation} style={{backgroundColor :"green", borderRadius:"5px", padding:"5px",  color:"white"}} >Tezkor Jo'natish</button>
      </div>
    </div>
  );
};

export default LocationModal;
