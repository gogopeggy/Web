import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { DatePicker } from "@mui/x-date-pickers";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
// import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Button from "@mui/material/Button";

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const curMonth = location.state.date;
  // const curType = location.state.type;
  const [open, setOpen] = useState(false);
  const [curRow, setCurRow] = useState({});
  const [newRow, setNewRow] = useState({});
  const url = "https://d1-tutorial.a29098477.workers.dev/api";

  const handleClose = () => {
    setOpen(false);
    setCurRow({});
    setNewRow({});
  };
  const rows = location.state.data;
  const columns = [
    {
      field: "action",
      headerName: "action",
      type: "actions",
      width: 80,
      cellClassName: "actions",
      getActions: (params) => {
        // console.log("🚀 ~ Details ~ params:", params);
        return [
          <>
            <GridActionsCellItem
              icon={<EditIcon color="success" />}
              label="Edit"
              onClick={(e) => startEdit(e, params.row)}
            />
            <GridActionsCellItem
              icon={<DeleteForeverIcon color="error" />}
              label="Delete"
              // onClick={(e) => }
            />
          </>,
        ];
      },
    },
    // { field: "id", headerName: "ID", width: 40 },
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
      width: 50,
      editable: true,
    },
    {
      field: "method",
      headerName: "Method",
      width: 120,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
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
    // console.log("🚀 ~ Details ~ data:", rows);
  }, []);

  function startEdit(event, row) {
    console.log("row", event.target, row);
    setOpen(true);
    setCurRow(row);
  }

  function handleInput(event, key, action) {
    console.log("row", event.target.value, key);
    let val = event.target.value;
    let newData = action === "edit" ? { ...curRow } : { ...newRow };
    if (key === "amount") {
      val = parseInt(val);
    }
    newData[key] = val;
    console.log("🚀 ~ handleInput ~ newRow:", newData);
    if (action === "edit") {
      setCurRow(newData);
    } else {
      setNewRow(newData);
    }
  }

  const handleSave = () => {
    if (newRow.id) {
      // create
      console.log("create");
      // create();
    } else {
      //update
      console.log("update");
    }
    handleClose();
  };

  // function create() {
  //   setOpen(true);
  // }

  async function create() {
    await axios
      .post(`${url}/expense/create`, newRow)
      .then(function (response) {
        // console.log("res", response);
        // handle success
        // setCashRecords(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        // console.log("done");
      });
  }

  return (
    <Box>
      <Box>
        <Button
          variant="outlined"
          onClick={() => navigate("/expense", { state: { date: curMonth } })}
        >
          Back
        </Button>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Create
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
          disableColumnResize
        />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography textAlign={"center"} fontWeight={"bold"} fontSize={16}>
            {curRow.id
              ? "You are going to edit this entry"
              : "Create a new entry"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            {curRow.id
              ? Object.keys(curRow).map((c) => (
                  // console.log("c", c);
                  <Grid item md={6} key={c} alignContent={"center"} p={1}>
                    <Typography
                      color={"text.secondary"}
                      fontWeight={"bold"}
                      fontSize={14}
                    >
                      {c}
                    </Typography>
                    <TextField
                      value={curRow[c]}
                      variant="standard"
                      size="small"
                      disabled={c === "id" && curRow.id}
                      onChange={(e) => handleInput(e, c, "edit")}
                      // required={c !== "note"}
                    />
                  </Grid>
                ))
              : Object.keys(rows[0]).map((c) => (
                  <Grid item md={6} key={c} alignContent={"center"} p={1}>
                    <Typography
                      color={"text.secondary"}
                      fontWeight={"bold"}
                      fontSize={14}
                    >
                      {c}
                    </Typography>
                    <TextField
                      value={curRow[c]}
                      variant="standard"
                      size="small"
                      disabled={c === "id" && curRow.id}
                      onChange={(e) => handleInput(e, c, "create")}
                    />
                  </Grid>
                ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Discard</Button>
          <Button onClick={handleSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
