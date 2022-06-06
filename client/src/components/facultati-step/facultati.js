import React from "react";
import "./administrare-page.scss";
import FacultateCard from "../../components/facultate-card/facultate-card";

const Facultati = () => {
  return (
    <div className="facultati-layout">
      <div className="facultati-cards">
        <FacultateCard className="facultati-card" />
        <FacultateCard className="facultati-card" />
        <FacultateCard className="facultati-card" />
        <FacultateCard className="facultati-card" />
        <FacultateCard className="facultati-card" />
        <FacultateCard className="facultati-card" />
      </div>
    </div>
  );
};

export default Facultati;
