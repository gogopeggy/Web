import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { getExpense } from "../../utility";
import DialogData from "../../components/expense/dialogContent";
import ExpenseDialog from "../../components/expense/dialog";
import { crud } from "../../utility";
import { DatePicker } from "@mui/x-date-pickers";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function Expense() {
  const location = useLocation();
  const navigate = useNavigate();
  const checkDate = location.state ? moment(location.state.date) : moment();
  const [curMonth, setCurMonth] = useState(checkDate.format("MM"));
  const [curYear, setCurYear] = useState(checkDate.format("YYYY"));
  const [overall, setOverall] = useState({});
  const [total, setTotal] = useState();
  const [date, setDate] = useState(checkDate);
  const [saveLoading, setSaveLoading] = useState(false);
  const [cashRecords, setCashRecords] = useState([]);
  const [open, setOpen] = useState(false);
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
    setTotal(sum);
  }

  function getMonth(e) {
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
    // console.log("row", event.target.value, key);
    let val = event.target.value;
    let newData = { ...newRow };
    if (key === "amount") {
      val = parseInt(val) || "";
    }
    newData[key] = val;
    // console.log("🚀 ~ handleInput ~ newData2222222:", newData);
    setNewRow(newData);
  }

  const handleSave = () => {
    setSaveLoading(true);
    crud("/expense/create", newRow, false);
    setTimeout(() => {
      fetchExpense();
      setSaveLoading(false);
      handleClose();
    }, 2000);
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
          <Typography fontWeight={"bold"} pt={{ md: 0, xs: 2 }}>
            Total Expense: ${total}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        {Object.keys(overall).map((o, index) => (
          <Grid item md={3} xs={6} p={2} key={o + index}>
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
      <ExpenseDialog
        open={open}
        handleClose={handleClose}
        title="Create a new entry"
        subTitle="please note that amount is requried"
        content={<DialogData row={newRow} handleInput={handleInput} />}
        handleSave={handleSave}
        saveLoading={saveLoading}
        disable={!newRow.amount}
      />
    </Box>
  );
}
