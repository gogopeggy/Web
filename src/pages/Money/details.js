import React, { useState } from "react";
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
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import moment from "moment";
import { getExpense } from "../../utility";

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const curMonth = location.state.date;
  const [open, setOpen] = useState(false);
  const [curRow, setCurRow] = useState({});
  const curType = location.state.type;
  const url = "https://d1-tutorial.a29098477.workers.dev/api";
  const handleClose = () => {
    setOpen(false);
    setCurRow({});
  };
  const [rows, setRows] = useState(location.state.data);
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

  function startEdit(event, row) {
    // console.log("row", event.target, row);
    setOpen(true);
    setCurRow(row);
  }

  function handleInput(event, key) {
    console.log("row", event.target.value, key);
    let val = event.target.value;
    let newData = { ...curRow };
    console.log("🚀 ~ handleInput ~ newData11111111:", newData);
    if (key === "amount") {
      val = parseInt(val) || "";
    }
    newData[key] = val;
    console.log("🚀 ~ handleInput ~ newData2222222:", newData);
    setCurRow(newData);
  }

  const handleSave = () => {
    console.log("curRow", curRow);
    create();
    setTimeout(() => {
      getExpense().then((res) => {
        const update = res.filter(
          (f) =>
            f.year === curMonth.split("-")[0] &&
            f.month === curMonth.split("-")[1] &&
            f.type === curType
        );
        setRows(update);
      });
      handleClose();
    }, 2000);
  };

  async function create(action) {
    await axios
      .post(`${url}/expense/update`, curRow, {
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
        console.log(error);
      })
      .finally(function () {
        console.log("done");
      });
  }

  const EditInput = (col) => {
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
              size="small"
              sx={{ width: 200 }}
              onChange={(e) => handleInput(e, col)}
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
            disabled={col === "id"}
            onChange={(e) => handleInput(e, col)}
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
          <Typography color="error" textAlign={"center"}>
            please note that amount is requried
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            {Object.keys(curRow).map((c) => (
              <Grid item md={6} key={c} alignContent={"center"} p={1}>
                <Typography
                  color={"text.secondary"}
                  fontWeight={"bold"}
                  fontSize={14}
                >
                  {c}
                </Typography>
                {EditInput(c, "edit")}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="error">
            Discard
          </Button>
          <Button
            onClick={handleSave}
            variant="outlined"
            autoFocus
            color="success"
            disabled={!curRow.amount}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
