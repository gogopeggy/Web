import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import moment from "moment";

import Button from "@mui/material/Button";

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const rows = location.state.data;
  const columns = [
    { field: "id", headerName: "ID", width: 40 },
    {
      field: "year",
      headerName: "Year",
      width: 60,
      editable: true,
    },
    {
      field: "month",
      headerName: "Month",
      width: 60,
      editable: true,
    },
    {
      field: "date",
      headerName: "Date",
      width: 40,
      editable: true,
    },
    {
      field: "method",
      headerName: "Method",
      width: 80,
      editable: true,
    },
    ,
    {
      field: "type",
      headerName: "Type",
      width: 100,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 80,
      editable: true,
    },
    {
      field: "note",
      headerName: "Note",
      width: 180,
      editable: true,
    },
  ];

  useEffect(() => {
    console.log("🚀 ~ Details ~ data:", rows);
  }, []);

  return (
    <Box>
      <Box>
        <Button variant="outlined" onClick={() => navigate("/money")}>
          Back
        </Button>
      </Box>
      <Box sx={{ height: 400, width: "100%", pt: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
