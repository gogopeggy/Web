import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import Button from "@mui/material/Button";

export default function Money() {
  const [curMonth, setCurMonth] = useState(moment().format("MM"));
  const [curYear, setCurYear] = useState(moment().format("YYYY"));
  const [overall, setOverall] = useState({});
  const [total, setTotal] = useState();
  const [date, getDate] = useState(moment().month());
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

  const cashRecords = [
    {
      month: "01",
      year: "2024",
      date: 5,
      type: "Transportation",
      method: "Cash",
      amount: 1200,
      note: "Consulting fee",
    },
    {
      month: "01",
      year: "2024",
      date: 15,
      type: "Food",
      method: "Credit",
      amount: 300,
      note: "Office supplies",
    },
    {
      month: "02",
      year: "2024",
      date: 10,
      type: "Social",
      method: "Bank Transfer",
      amount: 800,
      note: "Freelance project",
    },
    {
      month: "02",
      year: "2024",
      date: 20,
      type: "Social",
      method: "Debit",
      amount: 450,
      note: "Utilities",
    },
    {
      month: "03",
      year: "2024",
      date: 7,
      type: "Shopping",
      method: "Cash",
      amount: 600,
      note: "Rent income",
    },
    {
      month: "03",
      year: "2024",
      date: 25,
      type: "Others",
      method: "Mobile Payment",
      amount: 200,
      note: "Transportation",
    },
    {
      month: "04",
      year: "2024",
      date: 12,
      type: "Investment",
      method: "Credit",
      amount: 950,
      note: "Investment return",
    },
    {
      month: "04",
      year: "2024",
      date: 18,
      type: "Investment",
      method: "Cash",
      amount: 500,
      note: "Groceries",
    },
    {
      month: "05",
      year: "2024",
      date: 3,
      type: "Food",
      method: "Debit",
      amount: 700,
      note: "Part-time job",
    },
    {
      month: "05",
      year: "2024",
      date: 22,
      type: "Investment",
      method: "Bank Transfer",
      amount: 1000,
      note: "Car maintenance",
    },
    {
      month: "06",
      year: "2024",
      date: 14,
      type: "Food",
      method: "Mobile Payment",
      amount: 400,
      note: "Gift",
    },
    {
      month: "06",
      year: "2024",
      date: 30,
      type: "Investment",
      method: "Credit",
      amount: 350,
      note: "Dining out",
    },
    {
      month: "07",
      year: "2024",
      date: 8,
      type: "Others",
      method: "Cash",
      amount: 1000,
      note: "Bonus",
    },
    {
      month: "07",
      year: "2024",
      date: 27,
      type: "Transportation",
      method: "Debit",
      amount: 600,
      note: "Vacation",
    },
  ];

  useEffect(() => {
    getOverall(curMonth, curYear);
  }, [curMonth, curYear]);

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
    navigate("/money/details", { state: { data: filter } });
  }

  return (
    <Box>
      <Grid container p={2}>
        <Grid item md={8}>
          <DatePicker
            // label={'"month" and "year"'}
            views={["year", "month"]}
            format="YYYY-MM"
            onChange={(e) => getMonth(e)}
            sx={{ pr: 1 }}
          />
          <Button variant="outlined" onClick={() => navigate("/money/edit")}>
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
