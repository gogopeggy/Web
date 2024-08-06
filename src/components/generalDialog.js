import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const GeneralDialog = ({
  open,
  handleClose,
  title,
  subTitle,
  action,
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
    </DialogTitle>
    <DialogContent>
      <Typography textAlign={"center"} fontSize={14}>
        {subTitle}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} variant="outlined" color="primary">
        Back
      </Button>
      <Button
        onClick={handleSave}
        variant="outlined"
        color="error"
        disabled={disable}
      >
        <Typography
          sx={{
            display: !saveLoading ? undefined : "none",
            color: "#d32f2f",
          }}
        >
          {action}
        </Typography>
        <CircularProgress
          size={24}
          color="error"
          sx={{
            display: saveLoading ? undefined : "none",
          }}
        />
      </Button>
    </DialogActions>
  </Dialog>
);

export default GeneralDialog;
