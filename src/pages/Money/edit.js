import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import Button from "@mui/material/Button";

export default function Edit() {
  const navigate = useNavigate();
  return (
    <Box>
      <Box>
        <Button variant="outlined" onClick={() => navigate("/money")}>
          Back/
        </Button>
      </Box>
      <Box>
        <DatePicker
          // label={'"month" and "year"'}
          views={["year", "month", "day"]}
          format="YYYY-MM-DD"
          //   onChange={(e) => getMonth(e)}
          sx={{ pt: 1 }}
        />
      </Box>
    </Box>
  );
}
