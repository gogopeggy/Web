import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

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

const EditInput = (col, row, handleInput) => {
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
            value={row[col] || selectOp[0]}
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
          value={row[col]}
          variant="standard"
          size="small"
          disabled={col === "id"}
          onChange={(e) => handleInput(e, col)}
        />
      );
  }
};

const DialogData = ({ row, handleInput }) => {
  // let renderRow = action === "update" ? Object.keys(row) : row;
  return Object.keys(row).map((c) => (
    <Grid item md={6} key={c} alignContent={"center"} p={1}>
      <Typography color={"text.secondary"} fontWeight={"bold"} fontSize={14}>
        {c}
      </Typography>
      {EditInput(c, row, handleInput)}
    </Grid>
  ));
};

export default DialogData;
