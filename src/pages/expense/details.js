import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getExpense } from "../../utility";
import ExpenseDialog from "../../components/expense/dialog";
import DialogData from "../../components/expense/dialogContent";
import GeneralDialog from "../../components/generalDialog";
import { crud } from "../../utility";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
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
  const [deleteLoding, setDeleteLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rows, setRows] = useState(location.state.data);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setCurRow({});
    }, 1500);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

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
      width: 70,
      editable: true,
    },
    {
      field: "month",
      headerName: "Month",
      width: 70,
      editable: true,
    },
    {
      field: "date",
      headerName: "Date",
      width: 70,
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
      headerName: "$Amount",
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
    let val = event.target.value;
    let newData = { ...curRow };
    if (key === "amount") {
      val = parseInt(val) || "";
    }
    newData[key] = val;
    setCurRow(newData);
  }

  const fetchExpense = () => {
    getExpense().then((res) => {
      let update = res.filter(
        (f) =>
          f.year === curMonth.split("-")[0] &&
          f.month === curMonth.split("-")[1] &&
          f.type === curType
      );
      update.sort((a, b) => a.date - b.date);
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
    setDeleteLoading(true);
    await crud("/expense/delete", { id: curRow.id }, true);
    setTimeout(() => {
      fetchExpense();
      setDeleteLoading(false);
      setDeleteOpen(false);
    }, 2000);
  };

  return (
    <Box>
      <Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/expense", { state: { date: curMonth } })}
        >
          Back
        </Button>
      </Box>
      <Box sx={{ height: 380, width: "100%", pt: 1 }}>
        <DataGrid
          rows={rows}
          columnHeaderHeight={45}
          editMode={false}
          rowHeight={45}
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
          disableColumnMenu
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
      <GeneralDialog
        open={deleteOpen}
        handleClose={handleDeleteClose}
        title={"This is going to delete this entry"}
        subTitle={"Are you sure?"}
        action={"Delete"}
        handleSave={handleDelete}
        saveLoading={deleteLoding}
        disable={false}
      />
    </Box>
  );
}
