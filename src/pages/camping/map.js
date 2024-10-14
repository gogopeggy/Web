import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { getCamping } from "../../utility";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function Mapbox() {
  const Key = process.env.REACT_APP_API_MAPS;
  const [curLng, setCurLng] = useState();
  const [curLat, setCurLat] = useState();
  // const [curLocation, setCurLocation] = useState({});
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [destination, setDestination] = useState("");
  const [curCity, setCurCity] = useState("");
  const [locations, setLocations] = useState([]);

  const handleChange = (event) => {
    setCurCity(event.target.value);
    setFilteredLocation(() => {
      let opt = locations.filter((f) => f.city === event.target.value);
      return opt;
    });
  };

  const clearCity = () => {
    setCurCity("");
    setFilteredLocation(locations);
    setDestination("");
  };

  const city = [...new Set(locations.map((l) => l.city))];
  const [filteredLocation, setFilteredLocation] = useState([]);

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

  function fetchCamping() {
    getCamping().then((res) => {
      setLocations(res);
      setFilteredLocation(res);
    });
  }

  const calculateDistance = async (des) => {
    const origin = `${curLat},${curLng}`;
    const destination = `${des[0]}, ${des[1]}`;

    const url = `https://d1-tutorial.a29098477.workers.dev/api/distance?destinations=${destination}&origins=${origin}`;
    try {
      const response = await axios.get(url);
      const result = response.data;
      const distanceInMeters = result.rows[0].elements[0].distance.text;
      const time = result.rows[0].elements[0].duration.text;
      setDuration(time);
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
    setDestination(position.name);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, {
        maximumAge: 60000,
        timeout: 5000,
        enableHighAccuracy: true,
      });
    }
    fetchCamping();
  }, []);

  return (
    <>
      <Grid container>
        <Grid item md={6} xs={6}>
          {destination ? (
            <>
              <Stack direction={"row"}>
                <Typography pr={2} fontWeight={"bold"} fontSize={14}>
                  From your location to :
                </Typography>
                <Typography> {destination}</Typography>
              </Stack>
              <Stack direction={"row"}>
                <Typography pr={2} fontWeight={"bold"} fontSize={14}>
                  Distance :
                </Typography>
                <Typography fontSize={14}>
                  {distance}
                  {`(about ${duration} dirve)`}
                </Typography>
              </Stack>
            </>
          ) : (
            <Box>Let's find a place!</Box>
          )}
        </Grid>
        <Grid item md={6} xs={6} textAlign={"-webkit-right"}>
          <Stack sx={{ width: { md: 200, xs: 180 } }} pb={2} direction="row">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{ fontSize: 12 }}>
                Camping city
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={curCity}
                label="curCity"
                onChange={handleChange}
                size="small"
              >
                {city.map((c) => (
                  <MenuItem value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={clearCity}>clear</Button>
          </Stack>
        </Grid>
      </Grid>
      <APIProvider apiKey={Key}>
        <Map
          defaultTilt={20}
          defaultZoom={6}
          style={{ width: "100%", height: "70vh" }}
          defaultCenter={{
            lat: curCity === "" ? 25.0410887583241 : filteredLocation[0].lat,
            lng: curCity === "" ? 120.9605 : filteredLocation[0].lng,
          }}
          restriction={{
            latLngBounds: bounds,
          }}
        >
          {filteredLocation.map((position, index) => {
            return (
              <>
                <Marker
                  key={index}
                  position={position}
                  onMouseOver={() => handleMouseOver(position)}
                  onMouseOut={handleMouseOut}
                  onClick={() => getDestination(position)}
                />
              </>
            );
          })}
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
