import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getExpense } from "../../utility";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

export default function Expense() {
  const location = useLocation();
  const navigate = useNavigate();
  const checkDate = location.state ? moment(location.state.date) : moment();
  const [curMonth, setCurMonth] = useState(checkDate.format("MM"));
  const [curYear, setCurYear] = useState(checkDate.format("YYYY"));
  const [overall, setOverall] = useState({});
  const [total, setTotal] = useState();
  const [date, setDate] = useState(checkDate);
  // const url = "https://d1-tutorial.a29098477.workers.dev/api";
  const [cashRecords, setCashRecords] = useState([]);
  const [rowKeys, setRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
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
    year: moment().format("YYYY"),
    date: parseInt(moment().format("DD")),
    month: moment().format("MM"),
    method: methods[0],
    amount: "",
    type: types[0],
    note: "",
  };
  const [newRow, setNewRow] = useState(initialRow);
  const color = {
    Transportation: "#ff9595",
    Food: "#ffb944",
    Social: "#ffea44",
    Shopping: "#c1ff44",
    Others: "#44ff96",
    Investment: "#44ffd4",
    Fun: "#9ceeff",
    "Fixed Expense": "#44c9ff",
    Daily: "#e8abff",
  };

  useEffect(() => {
    fetchExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curMonth, curYear]);

  function fetchExpense() {
    getExpense().then((res) => {
      setCashRecords(res);
      const keys = Object.keys(res[0]).filter((key) => key !== "id");
      setRowKeys(keys);
      getOverall(curMonth, curYear, res);
    });
  }

  const handleClose = () => {
    setOpen(false);
    setNewRow(initialRow);
  };

  function getOverall(month, year, res) {
    let all = {};
    let sum = 0;
    Object.keys(color).map((c) => (all[c] = 0));
    const curdata = res.filter((f) => f.month === month && f.year === year);
    curdata.map((c) => {
      all[c.type] = (all[c.type] || 0) + c.amount;
      sum += c.amount;
      return all;
    });
    let sort = Object.entries(all);
    sort.sort((a, b) => b[1] - a[1]);
    sort = Object.fromEntries(sort);
    setOverall(sort);
    console.log("cashRecords", res);
    setTotal(sum);
    //react-hooks/exhaustive-deps
  }

  function getMonth(e) {
    // console.log("🚀 ~ getMonth ~ e:", e);
    setDate(e);
    setCurMonth(moment(e).format("MM"));
    setCurYear(moment(e).format("YYYY"));
  }

  function getData(type) {
    let filter = cashRecords.filter(
      (r) => r.type === type && r.month === curMonth && r.year === curYear
    );
    let curDate = moment(date).format("YYYY-MM");
    navigate("/expense/details", {
      state: { data: filter, date: curDate, type: type },
    });
  }

  function handleInput(event, key) {
    console.log("row", event.target.value, key);
    let val = event.target.value;
    let newData = { ...newRow };
    // console.log("🚀 ~ handleInput ~ newData11111111:", newData);
    if (key === "amount") {
      val = parseInt(val) || "";
    }
    newData[key] = val;
    // console.log("🚀 ~ handleInput ~ newData2222222:", newData);
    setNewRow(newData);
  }

  const handleSave = () => {
    // console.log("newww", newRow);
    create();
    setTimeout(() => {
      fetchExpense();
      handleClose();
    }, 2000);
  };

  async function create() {
    const url = "https://d1-tutorial.a29098477.workers.dev/api";
    await axios
      .post(`${url}/expense/create`, newRow, {
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
              value={newRow[col] || selectOp[0]}
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
            value={newRow[col]}
            variant="standard"
            size="small"
            onChange={(e) => handleInput(e, col)}
          />
        );
    }
  };

  return (
    <Box>
      <Grid container px={2}>
        <Grid item md={8}>
          <DatePicker
            views={["year", "month"]}
            value={date}
            format="YYYY-MM"
            onChange={(e) => getMonth(e)}
            sx={{ pr: 1 }}
          />
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Add
          </Button>
        </Grid>
        <Grid item md={4} textAlign={"right"}>
          <Typography fontWeight={"bold"}>Total Expense: ${total}</Typography>
        </Grid>
      </Grid>
      {/* </Stack> */}
      <Grid container>
        {Object.keys(overall).map((o, index) => (
          <Grid item md={3} p={2} key={o + index}>
            <Paper
              elevation={3}
              sx={{ p: 1, height: 80, backgroundColor: color[o] }}
            >
              <Button
                sx={{ fontSize: 12, color: "#686868" }}
                onClick={() => getData(o)}
              >
                {o}
              </Button>
              <Typography
                fontSize={24}
                textAlign={"center"}
                style={{ verticalAlign: "bottom" }}
              >
                ${overall[o]}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography textAlign={"center"} fontWeight={"bold"} fontSize={16}>
            Create a new entry
          </Typography>
          <Typography color="error" textAlign={"center"}>
            please note that amount is requried
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            {rowKeys.map((c) => (
              <Grid item md={6} key={c} alignContent={"center"} p={1}>
                <Typography
                  color={"text.secondary"}
                  fontWeight={"bold"}
                  fontSize={14}
                >
                  {c}
                </Typography>
                {EditInput(c, "create")}
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
            disabled={!newRow.amount}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
