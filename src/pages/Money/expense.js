import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import Button from "@mui/material/Button";

export default function Expense() {
  const [curMonth, setCurMonth] = useState(moment().format("MM"));
  const [curYear, setCurYear] = useState(moment().format("YYYY"));
  const [overall, setOverall] = useState({});
  const [total, setTotal] = useState();
  const [date, setDate] = useState(moment());
  const url = "https://d1-tutorial.a29098477.workers.dev/api";
  const [cashRecords, setCashRecords] = useState([]);
  const navigate = useNavigate();
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
    getOverall(curMonth, curYear);
    getExpense();
  }, [curMonth, curYear]);

  async function getExpense() {
    await axios
      .get(`${url}/expense`)
      .then(function (response) {
        // handle success
        // data = response.data;
        setCashRecords(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        console.log("done");
      });
    // return data;
  }

  function getOverall(month, year) {
    let all = {};
    let sum = 0;
    Object.keys(color).map((c) => (all[c] = 0));
    const curdata = cashRecords.filter(
      (f) => f.month === month && f.year === year
    );
    curdata.map((c) => {
      all[c.type] = (all[c.type] || 0) + c.amount;
      sum += c.amount;
    });
    let sort = Object.entries(all);
    sort.sort((a, b) => b[1] - a[1]);
    sort = Object.fromEntries(sort);
    setOverall(sort);
    setTotal(sum);
    //react-hooks/exhaustive-deps
  }

  function getMonth(e) {
    console.log("🚀 ~ getMonth ~ e:", e);
    setDate(e);
    setCurMonth(moment(e).format("MM"));
    setCurYear(moment(e).format("YYYY"));
  }

  function getData(type) {
    console.log("type", type, curMonth);
    let filter = cashRecords.filter(
      (r) => r.type === type && r.month === curMonth && r.year === curYear
    );
    filter.map((f) => (f["id"] = Math.random()));
    console.log("🚀 ~ getData ~ filter:", filter);
    navigate("/expense/details", { state: { data: filter } });
  }

  return (
    <Box>
      <Grid container p={2}>
        <Grid item md={8}>
          <DatePicker
            // label={'"month" and "year"'}
            views={["year", "month"]}
            value={date}
            format="YYYY-MM"
            onChange={(e) => getMonth(e)}
            sx={{ pr: 1 }}
          />
          <Button variant="outlined" onClick={() => navigate("/expense/edit")}>
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
              sx={{ p: 2, height: 80, backgroundColor: color[o] }}
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
    </Box>
  );
}
