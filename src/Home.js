import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import TextField from "@mui/material/TextField";
// import Select from "@mui/material/Select";
// import RecipeList from "./recipeList";

export default function Home() {
  const today = moment().format("L");
  const [weather, setWeather] = useState({});
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getWeather();
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function getWeather() {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=25.0651335306964&lon=121.576200811347&lang=zh_tw&units=metric&appid=445813e62fa1a98ba142c1e48ccd0290"
      )
      .then((response) => {
        let data = {};
        data["main"] = response.data.main;
        data["des"] = response.data.weather;
        setWeather(data);
        // dispatch(data);
        console.log("response", data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Box>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Today
          </Typography>
          <Grid container>
            <Grid item md={6}>
              <Typography variant="h5" component="div">
                {today}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="h5" component="div">
                {date.toLocaleTimeString()}
              </Typography>
            </Grid>
          </Grid>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Weather
          </Typography>
          <Grid container>
            <Grid item md={3}>
              <Typography variant="body2">
                Current:{" "}
                {weather.main ? `${weather.main.temp}\u00b0C` : "Pending"}
              </Typography>
            </Grid>
            <Grid item md={3}>
              <Typography variant="body2">
                Description:{" "}
                {weather.des ? `${weather.des[0].description}` : "Pending"}
              </Typography>
            </Grid>
            <Grid item md={3}>
              <Typography variant="body2">
                Feels:{" "}
                {weather.main ? `${weather.main.feels_like}\u00b0C` : "Pending"}
              </Typography>
            </Grid>
            <Grid item md={3}>
              <Typography variant="body2">
                Temp_range:{" "}
                {weather.main
                  ? `${weather.main.temp_min}-${weather.main.temp_max}\u00b0C`
                  : "Pending"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
