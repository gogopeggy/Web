import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Mapbox() {
  // const [markerRef, marker] = useMarkerRef();
  const Key = process.env.REACT_APP_API_MAPS;
  const [curLng, setCurLng] = useState();
  const [curLat, setCurLat] = useState();
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [destination, setDestination] = useState("");
  const locations = [
    {
      lat: 25.0410887583241,
      lng: 121.5203191419131,
      name: "中正紀念堂",
      address: "中正紀念堂123456",
      spot: 12,
    },
    {
      lat: 25.092942603441546,
      lng: 121.525899341745761,
      name: "士林捷運站",
      address: "士林捷運站123456",
      spot: 18,
    },
    {
      lat: 25.091854377536897,
      lng: 121.56812803669244,
      name: "金面山步道",
      address: "金面山步道123456",
      spot: 20,
    },
    {
      lat: 25.05453792265606,
      lng: 121.59782545224441,
      name: "台北流行音樂中心",
      address: "台北流行音樂中心123456",
      spot: 40,
    },
    {
      lat: 25.02887626611717,
      lng: 121.4529432588325,
      name: "板橋藝文特區",
      address: "板橋藝文特區123456",
      spot: 33,
    },
    {
      lat: 25.001847196692243,
      lng: 121.58140718430352,
      name: "台北市立動物園",
      address: "台北市立動物園123456",
      spot: 22,
    },
    {
      lat: 23.003804245607544,
      lng: 120.16124013732555,
      name: "安平老街",
      address: "安平老街123456",
      spot: 37,
    },
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

  function success(pos) {
    const crd = pos.coords;
    setCurLat(crd.latitude);
    setCurLng(crd.longitude);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const calculateDistance = async (des) => {
    const origin = `${curLat},${curLng}`;
    const destination = `${des[0]}, ${des[1]}`;
    console.log("🚀 ~ calculateDistance ~ destination:", destination);
    console.log("🚀 ~ calculateDistance ~ origin:", origin);

    const url = `https://d1-tutorial.a29098477.workers.dev/api/distance?destinations=${destination}&origins=${origin}`;
    try {
      const response = await axios.get(url);
      const result = response.data;
      const distanceInMeters = result.rows[0].elements[0].distance.text;
      const time = result.rows[0].elements[0].duration.text;
      setDuration(time);
      // console.log("result:", result);
      setDistance(distanceInMeters);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const getDestination = (position) => {
    let des = [];
    des.push(position.lat);
    des.push(position.lng);
    calculateDistance(des);
    // console.log("🚀 ~ getDestination ~ des:", des);
    setDestination(position.name);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
    // if (!marker) {
    //   return;
    // }
    // do something with marker instance here
  }, []);

  return (
    <>
      <Box display={destination === "" ? "none" : undefined}>
        <Typography>From your location to : {destination}</Typography>
        <Typography>Distance : {distance}</Typography>
        <Typography>About : {duration} drive</Typography>
      </Box>
      <APIProvider apiKey={Key}>
        <Map
          defaultTilt={20}
          defaultZoom={2}
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
                onClick={() => getDestination(position)}
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
                {hoveredMarker.name}
              </Typography>
              <Typography fontSize={12}>
                地址: {hoveredMarker.address}
              </Typography>
              <Typography fontSize={12}>Lat: {hoveredMarker.lat}</Typography>
              <Typography fontSize={12}>Lng: {hoveredMarker.lng}</Typography>
              <Typography fontSize={12}>營位: {hoveredMarker.spot}</Typography>
            </div>
          )}
        </Map>
      </APIProvider>
      <div id="map"></div>
    </>
  );
}
