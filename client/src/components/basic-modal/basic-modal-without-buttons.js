import React from "react";
import Box from "@mui/material/Box";
import { Paper, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import "./basic-modal-form-without-buttons.scss";

const BasicModalWithoutButtons = ({
  open,
  onClose,
  title,
  subTitle,
  content,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="basic-modal-wrapper">
        <Paper style={{ padding: "5% 0" }}>
          <Typography variant="h3" component="h2" style={{ padding: "0 2%" }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
            {subTitle}
          </Typography>
          {content}
        </Paper>
      </Box>
    </Modal>
  );
};

export default BasicModalWithoutButtons;
