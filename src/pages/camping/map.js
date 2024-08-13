import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function Mapbox() {
  // const [markerRef, marker] = useMarkerRef();
  const Key = process.env.REACT_APP_API_MAPS;
  const locations = [
    { lat: 25.0410887583241, lng: 121.5203191419131, name: "中正紀年堂" },
    { lat: 25.092942603441546, lng: 121.525899341745761, name: "士林捷運站" },
    { lat: 25.091854377536897, lng: 121.56812803669244, name: "金面山步道" },
    {
      lat: 25.05453792265606,
      lng: 121.59782545224441,
      name: "台北流行音樂中心",
    },
    { lat: 25.02887626611717, lng: 121.4529432588325, name: "板橋藝文特區" },
    {
      lat: 25.001847196692243,
      lng: 121.58140718430352,
      name: "台北市立動物園",
    },
    { lat: 23.003804245607544, lng: 120.16124013732555, name: "安平老街" },
  ];

  const bounds = {
    north: 28.5,
    south: 21.5,
    west: 117.5,
    east: 124.5,
  };

  const [hoveredMarker, setHoveredMarker] = useState(null);

  const handleMouseOver = (position) => {
    setHoveredMarker(position);
  };

  const handleMouseOut = () => {
    setHoveredMarker(null);
  };

  useEffect(() => {
    // if (!marker) {
    //   return;
    // }
    // do something with marker instance here
  }, []);

  return (
    <APIProvider apiKey={Key}>
      <Map
        defaultTilt={20}
        style={{ width: "60vw", height: "70vh" }}
        defaultCenter={{ lat: 25.0410887583241, lng: 120.9605 }}
        restriction={{
          latLngBounds: bounds,
        }}
      >
        {/* <Marker ref={markerRef} position={{ lat: 53.54992, lng: 10.00678 }} /> */}
        {locations.map((position, index) => (
          <>
            <Marker
              key={index}
              position={position}
              onMouseOver={() => handleMouseOver(position)}
              onMouseOut={handleMouseOut}
            />
          </>
        ))}
        {hoveredMarker && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              padding: "10px",
              backgroundColor: "white",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
              borderRadius: "5px",
              zIndex: 1000,
            }}
          >
            <Typography fontWeight={"bold"} fontSize={14} pb={2}>
              地標:
            </Typography>
            <Typography fontSize={12}>{hoveredMarker.name}</Typography>
          </div>
        )}
      </Map>
    </APIProvider>
  );
}
