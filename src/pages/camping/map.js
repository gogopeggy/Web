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

  // const locations = [
  //   {
  //     lat: 25.0410887583241,
  //     lng: 121.5203191419131,
  //     name: "中正紀念堂",
  //     address: "100台北市中正區中山南路21號",
  //     city: "台北市",
  //     spot: 12,
  //   },
  //   {
  //     lat: 25.092942603441546,
  //     lng: 121.525899341745761,
  //     name: "士林捷運站",
  //     address: "111台北市士林區福德路1號",
  //     city: "台北市",
  //     spot: 18,
  //   },
  //   {
  //     lat: 25.091854377536897,
  //     lng: 121.56812803669244,
  //     name: "金面山步道",
  //     address: "114台北市內湖區環山路一段136巷底號",
  //     city: "台北市",
  //     spot: 20,
  //   },
  //   {
  //     lat: 25.05453792265606,
  //     lng: 121.59782545224441,
  //     name: "台北流行音樂中心",
  //     address: "115台北市南港區市民大道八段99號",
  //     city: "台北市",
  //     spot: 40,
  //   },
  //   {
  //     lat: 25.02887626611717,
  //     lng: 121.4529432588325,
  //     name: "板橋藝文特區",
  //     address: "220新北市板橋區中正路435號",
  //     city: "新北市",
  //     spot: 33,
  //   },
  //   {
  //     lat: 25.001847196692243,
  //     lng: 121.58140718430352,
  //     name: "台北市立動物園",
  //     address: "116台北市文山區新光路二段30號",
  //     city: "台北市",
  //     spot: 22,
  //   },
  //   {
  //     lat: 23.003804245607544,
  //     lng: 120.16124013732555,
  //     name: "安平老街",
  //     address: "708台南市安平區延平街",
  //     city: "台南市",
  //     spot: 37,
  //   },
  //   {
  //     lat: 24.840706236985522,
  //     lng: 121.25663520216912,
  //     name: "三坑自然生態公園",
  //     address: "325桃園市龍潭區",
  //     city: "桃園市",
  //     spot: 37,
  //   },
  //   {
  //     lat: 24.871505786270422,
  //     lng: 121.25597165867062,
  //     name: "落羽松大道",
  //     address: "335桃園市大溪區落羽松路",
  //     city: "桃園市",
  //     spot: 37,
  //   },
  //   {
  //     lat: 24.772221710558703,
  //     lng: 121.10516189496242,
  //     name: "小森之歌",
  //     address: "307新竹縣芎林鄉倒別牛23號",
  //     city: "新竹縣",
  //     spot: 37,
  //   },
  //   {
  //     lat: 24.81197776341848,
  //     lng: 121.04062748744002,
  //     name: "高鐵新竹站",
  //     address: "302新竹縣竹北市高鐵七路6號",
  //     city: "新竹縣",
  //     spot: 37,
  //   },
  //   {
  //     lat: 24.16618098917034,
  //     lng: 120.64901746593382,
  //     name: "臺中國家歌劇院",
  //     address: "407025台中市西屯區惠來路二段101號",
  //     city: "台中市",
  //     spot: 37,
  //   },
  //   {
  //     lat: 23.95086157682222,
  //     lng: 120.45160561387692,
  //     name: "二林東螺溪木棉花道",
  //     address: "526彰化縣二林鎮華崙里",
  //     city: "彰化縣",
  //     spot: 37,
  //   },
  //   {
  //     lat: 23.266532674982802,
  //     lng: 120.33968378337353,
  //     name: "德元埤荷蘭村",
  //     address: "736台南市柳營區100號",
  //     city: "台南市",
  //     spot: 37,
  //   },
  // ];

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
    console.log("🚀 ~ success ~ crd:", crd);
    setCurLat(crd.latitude);
    setCurLng(crd.longitude);
    // setCurLocation({ lat: crd.latitude, lng: crd.longitude });
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
    setDestination(position.name);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("ihihi");
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
        <Grid item md={6}>
          <Box display={destination === "" ? "none" : undefined}>
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
          </Box>
        </Grid>
        <Grid item md={6} textAlign={"-webkit-right"}>
          <Box sx={{ width: 120 }} pb={2}>
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
          </Box>
        </Grid>
      </Grid>
      <APIProvider apiKey={Key}>
        <Map
          defaultTilt={20}
          defaultZoom={6}
          style={{ width: "67vw", height: "70vh" }}
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

          {/* {curLocation && (
            <Marker
              position={curLocation}
              // icon={{
              //   // path: window.google.maps.SymbolPath.CIRCLE,
              //   scale: 10,
              //   fillColor: "blue",
              //   fillOpacity: 1,
              //   strokeWeight: 0,
              // }}
            />
          )} */}
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
