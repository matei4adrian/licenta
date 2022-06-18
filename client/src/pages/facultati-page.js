import React, { useContext, useState, useEffect } from "react";
import "./cards-page.scss";
import "./pages.scss";
import { Typography } from "@mui/material";
import axios from "axios";
import { Context } from "../components/contexts/user-context";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { BACKEND_URL } from "../config";
import BasicModalWithoutButtons from "../components/basic-modal/basic-modal-without-buttons";
import { useNavigate } from "react-router-dom";
import FacultateForm from "../components/forms/facultate-form";
import FacultateCard from "../components/facultate-card/facultate-card";
import Header from "../components/administrare-child-page/header";

const FacultatiPage = () => {
  const navigate = useNavigate();
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [open, setOpen] = useState(false);
  const [facultati, setFacultati] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = async (values) => {
    var formData = new FormData();
    formData.append("denumire", values.denumire);
    formData.append("fotografie", values.fotografie);
    await axios
      .post(BACKEND_URL + "/api/facultati/", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        handleClose();
        getFacultati();
      })
      .catch((err) => {
        console.log(err);
      });
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
    if (!isLoggedIn) {
      navigate("../administrare");
    }
    getFacultati();
  }, [isLoggedIn, navigate]);

  return (
    <div>
      {loading ? (
        <div className="loading-cards-page">
          <CircularProgress />
        </div>
      ) : (
        <div className="pages-layout" style={{ marginTop: "3%" }}>
          <Header
            pageTitleText="Facultati"
            addButtonText="Adauga facultate"
            handleOpenAddModal={handleOpen}
          />
          <BasicModalWithoutButtons
            open={open}
            onClose={handleClose}
            title="Adauga facultate"
            subTitle="Completati campurile"
            content={
              <FacultateForm
                onSubmit={handleAdd}
                onClose={handleClose}
                submitText="Adauga"
              />
            }
          />
          <div className="cards-layout" style={{ padding: "0 3%" }}>
            {facultati.length !== 0 ? (
              <div className="cards">
                {facultati.map((facultate) => (
                  <FacultateCard
                    facultate={facultate}
                    getFacultati={getFacultati}
                    key={facultate.id}
                  />
                ))}
              </div>
            ) : (
              <Typography variant="h3" className="no-card-added">
                Nicio facultate nu a fost adaugata
              </Typography>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultatiPage;
