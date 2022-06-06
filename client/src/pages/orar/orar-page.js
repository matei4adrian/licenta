import React, { useContext } from "react";
import Orar from "../../components/orar/orar";
import "./orar-page.scss";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Context } from "../../components/contexts/user-context";

const OrarPage = () => {
  const user = useContext(Context);

  return (
    <div className="orar-page-container">
      <div className="orar-page-buttons-container">
        {user.isLoggedIn && (
          <Button variant="contained" startIcon={<AddIcon />}>
            Adauga activitate
          </Button>
        )}
      </div>
      <div className="orar-page-content">
        <Orar />
      </div>
    </div>
  );
};

export default OrarPage;
