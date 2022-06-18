import "./header.scss";
import { Button, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Header = ({ pageTitleText, addButtonText, handleOpenAddModal }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("../administrare");
  };

  return (
    <>
      <Typography variant="h3">{pageTitleText}</Typography>
      <div className="header-buttons">
        <IconButton aria-label="back" color="success" onClick={handleBack}>
          <ArrowBackIcon />
          Administrare
        </IconButton>
        {addButtonText && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
          >
            {addButtonText}
          </Button>
        )}
      </div>
    </>
  );
};

export default Header;
