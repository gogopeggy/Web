import React from "react";
// import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Mapbox from "./map";
// import axios from "axios";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import TextField from "@mui/material/TextField";
// import Select from "@mui/material/Select";
// import Typography from "@mui/material/Typography";
// import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function Camping() {
  // if (!process.env.REACT_APP_GOOGLE_KEY) {
  //   return <h2>Add google key</h2>;
  // }
  // const render = (status) => {
  //   console.log(status);
  //   if (status === Status.LOADING) return <h3>{status} ..</h3>;
  //   if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  //   return <></>;
  // };
  return (
    // <div className="App">
    // {/* <Wrapper
    //   apiKey={"AIzaSyAHtk1J6egQrl9ap81rAvQX0oB9NZfIh10"}
    //   render={render}
    // >
    //   <Map center={{ lat: 55.753559, lng: 37.609218 }} zoom={11} />
    // </Wrapper> */}
    <Mapbox />
    // </div>
  );
}
