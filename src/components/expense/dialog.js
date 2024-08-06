import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

const ExpenseDialog = ({
  open,
  handleClose,
  title,
  subTitle,
  content,
  handleSave,
  saveLoading,
  disable,
}) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      <Typography textAlign={"center"} fontWeight={"bold"} fontSize={16}>
        {title}
      </Typography>
      <Typography color="error" textAlign={"center"}>
        {subTitle}
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Grid container>{content}</Grid>
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
        disabled={disable}
      >
        <Typography
          sx={{
            display: !saveLoading ? undefined : "none",
            color: disable ? "#b9b9b9" : "#38af4a",
          }}
        >
          Save
        </Typography>
        <CircularProgress
          size={24}
          color="success"
          sx={{ display: saveLoading ? undefined : "none" }}
        />
      </Button>
    </DialogActions>
  </Dialog>
);

export default ExpenseDialog;
