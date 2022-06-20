import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ReportIcon from "@mui/icons-material/Report";

const StyledDialog = styled(Dialog)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const BasicModal = ({ open, onClose, title, content, onSubmit }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle
        id="confirm-dialog"
        style={{ display: "flex", alignItems: "center" }}
      >
        <ReportIcon color="warning" sx={{ marginRight: "2%" }} />
        {title}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Nu</Button>
        <Button variant="contained" onClick={onSubmit}>
          Da
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default BasicModal;
