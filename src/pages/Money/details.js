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
// import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import Button from "@mui/material/Button";
import moment from "moment";
import { Paper } from "@mui/material";

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const curMonth = location.state.date;
  // const curType = location.state.type;
  const [open, setOpen] = useState(false);
  const [curRow, setCurRow] = useState({});
  const url = "https://d1-tutorial.a29098477.workers.dev/api";
  const yearOptions = [
    moment().format("YYYY"),
    moment().subtract(1, "year").year(),
  ];
  const days = Array.from({ length: 31 }, (v, k) => k + 1);
  const months = Array.from({ length: 12 }, (v, k) =>
    (k + 1).toString().padStart(2, "0")
  );
  const methods = ["cash", "credit card", "bank transfer"];
  const types = [
    "Transportation",
    "Food",
    "Social",
    "Shopping",
    "Others",
    "Investment",
    "Fun",
    "Fixed Expense",
    "Daily",
  ];
  const initialRow = {
    year: yearOptions[0],
    date: days[0],
    month: months[0],
    method: methods[0],
    amount: "",
    type: types[0],
    note: "",
  };
  const [newRow, setNewRow] = useState(initialRow);
  const handleClose = () => {
    setOpen(false);
    setCurRow({});
    setNewRow(initialRow);
  };
  const rows = location.state.data;
  const newRowKeys = Object.keys(rows[0]);
  newRowKeys.splice(Object.keys(rows[0]).indexOf("id"), 1);
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
    console.log("🚀 ~ handleInput ~ newData:", newData);
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
    console.log("newww", newRow, curRow);
    if (newRow.year) {
      // create
      console.log("create");
      // create("create");
    } else {
      //update
      // create("update");
      console.log("update");
    }
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  async function create(action) {
    let route = action === "create" ? "/expense/create" : "/expense/update";
    let row = action === "create" ? newRow : curRow;
    await axios
      .post(`${url}${route}`, row, {
        headers: {
          "Content-Type": "application/json",
        },
      })
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

  const EditInput = ({ col }) => {
    let selectOp;
    switch (col) {
      case "year":
        selectOp = yearOptions;
        break;
      case "date":
        selectOp = days;
        break;
      case "month":
        selectOp = months;
        break;
      case "method":
        selectOp = methods;
        break;
      case "type":
        selectOp = types;
        break;
      default:
        break;
    }

    switch (col) {
      case "year":
      case "date":
      case "month":
      case "method":
      case "type":
        return (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={curRow[col] || selectOp[0]}
              label="Age"
              size="small"
              sx={{ width: 200 }}
              onChange={(e) => handleInput(e, col, "edit")}
              MenuProps={{ PaperProps: { sx: { maxHeight: 100 } } }}
            >
              {selectOp.map((y) => (
                <MenuItem value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return (
          <TextField
            value={curRow[col]}
            variant="standard"
            size="small"
            disabled={col === "id" && curRow.id}
            onChange={(e) => handleInput(e, col, "edit")}
            // required={c !== "note"}
          />
        );
    }
  };

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
                  <Grid item md={6} key={c} alignContent={"center"} p={1}>
                    <Typography
                      color={"text.secondary"}
                      fontWeight={"bold"}
                      fontSize={14}
                    >
                      {c}
                    </Typography>
                    <EditInput col={c} />
                    {/* <TextField
                      value={curRow[c]}
                      variant="standard"
                      size="small"
                      disabled={c === "id" && curRow.id}
                      onChange={(e) => handleInput(e, c, "edit")}
                      // required={c !== "note"}
                    /> */}
                  </Grid>
                ))
              : newRowKeys.map((c) => (
                  <Grid item md={6} key={c} alignContent={"center"} p={1}>
                    <Typography
                      color={"text.secondary"}
                      fontWeight={"bold"}
                      fontSize={14}
                    >
                      {c}
                    </Typography>
                    <EditInput col={c} />
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
