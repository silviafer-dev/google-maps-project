import React, { useEffect, useState } from "react";
import { InfoWindow, Map, Marker } from "@vis.gl/react-google-maps";

export default function Home() {
  const [coordsLoaded, setCoordsLoaded] = useState(false);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogLocation, setDialogLocation] = useState("");
  const [listOfLocations, setListOfLocations] = useState([]);

  // handle click on map
  const handleMapClick = (mapProps) => {
    console.log(mapProps);
    const lat = mapProps.detail.latLng.lat;
    const lng = mapProps.detail.latLng.lng;
    setShowDialog(true);
    setDialogLocation({ lat, lng });
    setSelectedLocation({ lat, lng });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setMarkerLocation({ lat: latitude, lng: longitude });
        setCoordsLoaded(true);
      },
      (error) => {
        console.error("Error getting location: ", error);
        setMarkerLocation({ lat: 0, lng: 0 });
        setCoordsLoaded(true);
      }
    );
  }, []);

  const validCoords = (coords) => {
    return (
      coords && typeof coords.lat === "number" && typeof coords.lng === "number"
    );
  };

  const onAddLocation = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: selectedLocation }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setListOfLocations([
            ...listOfLocations,
            { name: results[0].formatted_address, location: selectedLocation },
          ]);
          setShowDialog(false);
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  console.log(listOfLocations);

  if (!coordsLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <div className="map-container">
      <Map
        key={
          coordsLoaded
            ? `${markerLocation.lat}-${markerLocation.lng}`
            : "default"
        }
        defaultCenter={
          validCoords(markerLocation)
            ? { lat: markerLocation.lat, lng: markerLocation.lng }
            : { lat: 0, lng: 0 }
        }
        zoom={15}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onClick={handleMapClick}
      >
        {showDialog && (
          <InfoWindow position={dialogLocation}>
            <div>
              <button className="app-button" onClick={onAddLocation}>
                Add this location
              </button>
            </div>
          </InfoWindow>
        )}
        {validCoords(markerLocation) && <Marker position={markerLocation} />}
      </Map>

      <form>
        <label>
          <input />
        </label>
      </form>
    </div>
  );
}
