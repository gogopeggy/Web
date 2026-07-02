import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { getCamping } from "../../utility";
import axios from "axios";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

export default function Camping() {
  // NOTE: a Google Maps JS key is always visible in the browser bundle — this
  // env var keeps it out of source, but the real protection is HTTP-referrer +
  // API restrictions on the key in Google Cloud Console. Rotate the old key.
  const mapsApiKey = process.env.REACT_APP_API_MAPS;
  const [curLng, setCurLng] = useState();
  const [curLat, setCurLat] = useState();
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
      if (result.status !== "OK") {
        throw new Error(result.error_message || `Distance API status: ${result.status}`);
      }
      const element = result.rows?.[0]?.elements?.[0];
      if (!element || element.status !== "OK") {
        throw new Error(`No route found (${element?.status || "no data"})`);
      }
      setDuration(element.duration.text);
      setDistance(element.distance.text);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setDistance(undefined);
      setDuration(undefined);
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
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          {destination ? (
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Stack direction={"row"}>
                <Typography pr={2} fontWeight={"bold"} fontSize={14}>
                  From your location to:
                </Typography>
                <Typography fontSize={14}>{destination}</Typography>
              </Stack>
              <Stack direction={"row"}>
                <Typography pr={2} fontWeight={"bold"} fontSize={14}>
                  Distance:
                </Typography>
                <Typography fontSize={14}>
                  {distance}
                  {` (about ${duration} drive)`}
                </Typography>
              </Stack>
            </Paper>
          ) : (
            <Typography color="text.secondary">Let's find a place!</Typography>
          )}
        </Grid>
        <Grid item md={6} xs={12} sx={{ textAlign: { md: "right", xs: "left" } }}>
          <Stack sx={{ width: { md: 240, xs: "100%" }, maxWidth: 320, display: "inline-flex" }} pb={2} direction="row">
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
      <APIProvider apiKey={mapsApiKey}>
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
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                p: 1.5,
                borderRadius: 2,
                zIndex: 1000,
                maxWidth: 260,
              }}
            >
              <Typography fontWeight={"bold"} fontSize={14} pb={1}>
                {hoveredMarker.name}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                地址: {hoveredMarker.address}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Lat: {hoveredMarker.lat}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Lng: {hoveredMarker.lng}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                營位: {hoveredMarker.spot}
              </Typography>
            </Paper>
          )}
        </Map>
      </APIProvider>
      <div id="map"></div>
    </>
  );
}
