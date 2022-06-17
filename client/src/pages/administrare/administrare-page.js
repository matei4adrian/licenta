import React, { useContext } from "react";
import "./administrare-page.scss";
import { Typography } from "@mui/material";
import Login from "../../components/login/login";
import { Context } from "../../components/contexts/user-context";
import OptionCard from "../../components/option-card/option-card";

const options = [
  { id: 1, to: "/facultati", denumire: "Facultati" },
  { id: 2, to: "/materii", denumire: "Materii" },
  { id: 3, to: "/profesori", denumire: "Profesori" },
  { id: 4, to: "/sali", denumire: "Sali" },
  { id: 5, to: "/serii", denumire: "Serii" },
  { id: 6, to: "/grupe", denumire: "Grupe" },
  { id: 7, to: "/feedbacks", denumire: "Gestioneaza feedback-uri" },
  { id: 8, to: "/administratori", denumire: "Gestioneaza administratori" },
  { id: 9, to: "/statistici", denumire: "Statistici" },
];

const AdministrarePage = () => {
  const user = useContext(Context);

  return (
    <div className="administrare-layout">
      {user.isLoggedIn ? (
        <div>
          <Typography variant="h3" className="administrare-title">
            Vizualizeaza
          </Typography>
          <div className="administrare-cards">
            {options.map((option) => (
              <OptionCard
                className="administrare-card"
                to={option.to}
                denumire={option.denumire}
                key={option.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="administrare-content">
          <Login />
        </div>
      )}
    </div>
  );
};

export default AdministrarePage;
