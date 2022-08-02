import React, { useEffect, useState } from "react";
import "./facultati.scss";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { CircularProgress, Typography } from "@mui/material";
import ClickableFacultateCard from "../facultate-card/clickable-facultate-card";

const Facultati = ({ setActiveStep, setFacultateId }) => {
  const [facultati, setFacultati] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClickFacultate = (id) => {
    setFacultateId(id);
    setActiveStep(1);
  };

  const getFacultati = async () => {
    await axios
      .get(BACKEND_URL + "/api/facultati/")
      .then((res) => {
        if (res.data) {
          setFacultati(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getFacultati();
  }, []);

  return (
    <div className="facultati-layout">
      {loading ? (
        <div className="loading-facultati">
          <CircularProgress />
        </div>
      ) : facultati.length !== 0 ? (
        <div className="facultati-cards">
          {facultati.map((facultate) => (
            <ClickableFacultateCard
              key={facultate.id}
              onClick={handleClickFacultate}
              facultate={facultate}
            />
          ))}
        </div>
      ) : (
        <Typography variant="h3" className="no-facultate-added">
          Nicio facultate nu a fost adaugată
        </Typography>
      )}
    </div>
  );
};

export default Facultati;
