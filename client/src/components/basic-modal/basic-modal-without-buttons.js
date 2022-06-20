import React from "react";
import Box from "@mui/material/Box";
import { Paper, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import "./basic-modal-form-without-buttons.scss";

const StyledModal = styled(Modal)`
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const BasicModalWithoutButtons = ({
  open,
  onClose,
  title,
  subTitle,
  content,
}) => {
  return (
    <StyledModal open={open} onClose={onClose}>
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
    </StyledModal>
  );
};

export default BasicModalWithoutButtons;
