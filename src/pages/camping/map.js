import React, { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMarkerRef,
} from "@vis.gl/react-google-maps";

export default function Mapbox() {
  const [markerRef, marker] = useMarkerRef();
  const locations = [
    { lat: 25.0410887583241, lng: 121.5203191419131 },
    { lat: 25.092942603441546, lng: 121.525899341745761 },
    { lat: 25.091854377536897, lng: 121.56812803669244 },
    { lat: 25.05453792265606, lng: 121.59782545224441 },
    { lat: 25.02887626611717, lng: 121.4529432588325 },
    { lat: 25.001847196692243, lng: 121.58140718430352 },
    { lat: 23.003804245607544, lng: 120.16124013732555 },
  ];
  // const bounds = {
  //   north: 25.5, // Slightly increased from 25.3
  //   south: 21.5, // Slightly decreased from 21.8 to allow more southern panning
  //   west: 118.5, // Slightly decreased from 119.3 to allow more western panning
  //   east: 122.5,
  // };
  useEffect(() => {
    if (!marker) {
      return;
    }
    // do something with marker instance here
  }, [marker]);

  return (
    <APIProvider apiKey={"AIzaSyAHtk1J6egQrl9ap81rAvQX0oB9NZfIh10"}>
      <Map
        // zoom={12}
        style={{ width: "60vw", height: "70vh" }}
        center={{ lat: 25.0410887583241, lng: 120.9605 }}
        // restriction={{
        //   latLngBounds: bounds,
        //   strictBounds: true, // Prevent the user from panning outside the bounds
        // }}
      >
        {/* <Marker ref={markerRef} position={{ lat: 53.54992, lng: 10.00678 }} /> */}
        {locations.map((position, index) => (
          <Marker key={index} position={position} />
        ))}
      </Map>
    </APIProvider>
  );
}
