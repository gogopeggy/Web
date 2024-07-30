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
  const color = [
    "#ff9595",
    "#ffb944",
    "#ffea44",
    "#c1ff44",
    "#44ff96",
    "#44ffd4",
    "#9ceeff",
    "#44c9ff",
    "#e8abff",
  ];
  const cashRecords = [
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 10,
    //   type: "Food",
    //   method: "Cash",
    //   amount: 500,
    //   note: "Salary",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 14,
    //   type: "Transportation",
    //   method: "Credit",
    //   amount: 250,
    //   note: "Groceries",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 22,
    //   type: "Fun",
    //   method: "Debit",
    //   amount: 300,
    //   note: "Freelance project",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 5,
    //   type: "Social",
    //   method: "Cash",
    //   amount: 100,
    //   note: "Transportation",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 18,
    //   type: "Fixed Expense",
    //   method: "Bank Transfer",
    //   amount: 800,
    //   note: "Bonus",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 29,
    //   type: "Daily",
    //   method: "Mobile Payment",
    //   amount: 200,
    //   note: "Utilities",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 12,
    //   type: "Shopping",
    //   method: "Cash",
    //   amount: 400,
    //   note: "Gift",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 25,
    //   type: "Investment",
    //   method: "Debit",
    //   amount: 150,
    //   note: "Dining out",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 8,
    //   type: "Others",
    //   method: "Credit",
    //   amount: 700,
    //   note: "Investment return",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 17,
    //   type: "Food",
    //   method: "Bank Transfer",
    //   amount: 300,
    //   note: "Shopping",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 21,
    //   type: "Social",
    //   method: "Mobile Payment",
    //   amount: 600,
    //   note: "Part-time job",
    // },
    // {
    //   month: "Jan",
    //   year: 2023,
    //   date: 31,
    //   type: "Transportation",
    //   method: "Cash",
    //   amount: 500,
    //   note: "Holiday gifts",
    // },
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
    let curdata = cashRecords.filter(
      (f) => f.month === month && f.year === year
    );
    curdata.map((c) => {
      all[c.type] = (all[c.type] || 0) + c.amount;
      sum += c.amount;
    });
    setOverall(all);
    setTotal(sum);
    //react-hooks/exhaustive-deps
  }

  function getMonth(e) {
    setCurMonth(moment(e).format("MM"));
    setCurYear(moment(e).format("YYYY"));
  }

  return (
    <Box>
      {/* <Stack direction={"row"} p={2} justifyContent={"space-between"}> */}
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
              sx={{ p: 2, height: 80, backgroundColor: color[index] }}
            >
              <Typography paddingBottom={1} color={"text.secondary"}>
                {o}
              </Typography>
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
