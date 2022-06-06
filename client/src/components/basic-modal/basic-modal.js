import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const BasicModal = ({ open, onClose, title, content, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Nu</Button>
        <Button variant="contained" onClick={onSubmit}>
          Da
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BasicModal;
