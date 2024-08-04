import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
// import axios from "axios";
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

  return (
    <Box>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography fontSize={16} color="text.secondary" gutterBottom>
            Today
          </Typography>
          <Grid container pb={1}>
            <Grid item md={6}>
              <Typography variant="h6" component="div">
                <CalendarMonthIcon sx={{ verticalAlign: "sub", pr: 1 }} />
                {today}
              </Typography>
            </Grid>
            <Grid item md={6}>
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
            <Grid item md={3}>
              <Stack direction={"row"}>
                <Typography variant="body2" fontWeight={"bold"} pr={2}>
                  Current:{" "}
                </Typography>
                <Typography variant="body2">
                  {weather.main ? `${weather.main.temp}\u00b0C` : "Pending"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={3}>
              <Stack direction={"row"}>
                <Typography variant="body2" fontWeight={"bold"} pr={2}>
                  Description:{" "}
                </Typography>
                <Typography variant="body2">
                  {weather.des ? `${weather.des[0].description}` : "Pending"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={2.5}>
              <Stack direction={"row"}>
                <Typography variant="body2" fontWeight={"bold"} pr={2}>
                  Feels:{" "}
                </Typography>
                <Typography variant="body2">
                  {weather.main
                    ? `${weather.main.feels_like}\u00b0C`
                    : "Pending"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={3.5}>
              <Stack direction={"row"}>
                <Typography variant="body2" fontWeight={"bold"} pr={2}>
                  Temp_range:{" "}
                </Typography>
                <Typography variant="body2">
                  {weather.main
                    ? `${weather.main.temp_min}-${weather.main.temp_max}\u00b0C`
                    : "Pending"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
