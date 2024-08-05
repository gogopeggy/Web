import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getExpense } from "../../utility";
import ExpenseDialog from "../../components/expense/dialog";
import DialogData from "../../components/expense/dialogContent";
import { crud } from "../../utility";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const curMonth = location.state.date;
  const [open, setOpen] = useState(false);
  const [curRow, setCurRow] = useState({});
  const curType = location.state.type;
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setCurRow({});
  };
  const [rows, setRows] = useState(location.state.data);
  const columns = [
    {
      field: "action",
      headerName: "Action",
      type: "actions",
      width: 80,
      cellClassName: "actions",
      getActions: (params) => {
        return [
          <>
            <GridActionsCellItem
              icon={<EditIcon color="success" />}
              label="Edit"
              onClick={() => startEdit(params.row)}
            />
            <GridActionsCellItem
              icon={<DeleteForeverIcon color="error" />}
              label="Delete"
              onClick={() => {
                setDeleteOpen(true);
                setCurRow(params.row);
              }}
            />
          </>,
        ];
      },
    },
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

  function startEdit(row) {
    setOpen(true);
    setCurRow(row);
  }

  function handleInput(event, key) {
    // console.log("row", event.target.value, key);
    let val = event.target.value;
    let newData = { ...curRow };
    if (key === "amount") {
      val = parseInt(val) || "";
    }
    newData[key] = val;
    // console.log("🚀 ~ handleInput ~ newData2222222:", newData);
    setCurRow(newData);
  }

  const fetchExpense = () => {
    getExpense().then((res) => {
      const update = res.filter(
        (f) =>
          f.year === curMonth.split("-")[0] &&
          f.month === curMonth.split("-")[1] &&
          f.type === curType
      );
      setRows(update);
    });
  };

  const handleSave = () => {
    setSaveLoading(true);
    crud("/expense/update", curRow, false);
    setTimeout(() => {
      fetchExpense();
      setSaveLoading(false);
      handleClose();
    }, 2000);
  };

  const handleDelete = async () => {
    await crud("/expense/delete", { id: curRow.id }, true);
    setTimeout(() => {
      fetchExpense();
      setDeleteOpen(false);
    }, 2000);
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
          disableRowSelectionOnClick
          disableColumnResize
        />
      </Box>
      <ExpenseDialog
        open={open}
        handleClose={handleClose}
        title="You are going to edit this entry"
        subTitle="please note that amount is requried"
        content={<DialogData row={curRow} handleInput={handleInput} />}
        handleSave={handleSave}
        saveLoading={saveLoading}
        disable={!curRow.amount}
      />
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography textAlign={"center"} fontWeight={"bold"} fontSize={16}>
            This is going to delete this entry
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography textAlign={"center"} fontSize={14}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteOpen(false)}
            variant="outlined"
            color="primary"
          >
            Back
          </Button>
          <Button
            onClick={handleDelete}
            variant="outlined"
            autoFocus
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
