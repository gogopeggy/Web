import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Home() {
  const today = moment().format("L");
  const [date, setDate] = useState(new Date());
  const weather = useSelector((state) => state.user.weather);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const WeatherInfoGrid = ({ label, value }) => (
    <Grid item md={3} xs={6}>
      <Stack direction="row">
        <Typography variant="body2" fontWeight="bold" pr={2}>
          {label}:{" "}
        </Typography>
        <Typography variant="body2">{value || "Pending"}</Typography>
      </Stack>
    </Grid>
  );

  return (
    <Box>
      <Card sx={{ minWidth: 250, backgroundColor: "#f3f3f3" }}>
        <CardContent>
          <Typography fontSize={16} color="text.secondary" gutterBottom>
            Today
          </Typography>
          <Grid container pb={1}>
            <Grid item md={6} xs={6}>
              <Typography variant="h6" component="div">
                <CalendarMonthIcon sx={{ verticalAlign: "sub", pr: 1 }} />
                {today}
              </Typography>
            </Grid>
            <Grid item md={6} xs={6}>
              <Typography variant="h6" component="div">
                <AccessTimeIcon sx={{ verticalAlign: "sub", pr: 1 }} />
                {date.toLocaleTimeString()}
              </Typography>
            </Grid>
          </Grid>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Weather
          </Typography>
          <Grid container>
            <WeatherInfoGrid
              label="Current"
              value={
                weather.main ? `${parseInt(weather.main.temp)}\u00b0C` : null
              }
            />
            <WeatherInfoGrid
              label="Description"
              value={weather.des ? `${weather.des[0].description}` : null}
            />
            <WeatherInfoGrid
              label="Feels"
              value={
                weather.main
                  ? `${parseInt(weather.main.feels_like)}\u00b0C`
                  : null
              }
            />
            <WeatherInfoGrid
              label="Temp_range"
              value={
                weather.main
                  ? `${parseInt(weather.main.temp_min)}-${parseInt(
                      weather.main.temp_max
                    )}\u00b0C`
                  : null
              }
            />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
