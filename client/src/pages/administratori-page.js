import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./pages.scss";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { Context } from "../components/contexts/user-context";
import CustomGrid from "../components/custom-grid";
import { BACKEND_URL } from "../config";
import Header from "../components/administrare-child-page/header";
import BasicModalWithoutButtons from "../components/basic-modal/basic-modal-without-buttons";
import Message from "../components/message/message";
import AdministratoriForm from "../components/forms/administratori-form";

const AdministratoriPage = () => {
  const navigate = useNavigate();
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddAdministratorModal, setOpenAddAdministratorModal] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const columns = [
    {
      field: "email",
      headerName: "Email",
      description: "Emailul administratorului",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      description: "Username-ul administratorului",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
  ];

  const getUsers = async () => {
    await axios
      .get(BACKEND_URL + "/api/users/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setUsers(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenAddAdministratorModal = () => {
    setOpenAddAdministratorModal(true);
  };

  const handleCloseAddAdministratorModal = () => {
    setOpenAddAdministratorModal(false);
  };

  const handleAddAdministratorByEmail = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    await axios
      .post(BACKEND_URL + `/api/users/`, values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseAddAdministratorModal();
        getUsers();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  const handleAddAdministratorByUsers = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    await axios
      .post(BACKEND_URL + "/api/users/importFromCSV", values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseAddAdministratorModal();
        getUsers();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("../administrare");
    }
    getUsers();
  }, [isLoggedIn, navigate]);

  return (
    <div className="pages-layout">
      <Header
        pageTitleText="Administratori"
        addButtonText="Adaugă administrator"
        handleOpenAddModal={handleOpenAddAdministratorModal}
      />
      <CustomGrid
        columns={columns}
        rows={users.map((user) => {
          return {
            ...user,
            username: user.username
              ? user.username
              : "Administratorului nu s-a autentificat încă",
          };
        })}
        loading={loading}
      />
      <BasicModalWithoutButtons
        open={openAddAdministratorModal}
        onClose={handleCloseAddAdministratorModal}
        title="Adaugă administrator"
        subTitle="Completați campul"
        content={
          <AdministratoriForm
            onSubmitEmail={handleAddAdministratorByEmail}
            onSubmitUsers={handleAddAdministratorByUsers}
            onClose={handleCloseAddAdministratorModal}
            submitText="Adaugă"
          />
        }
      />
      {!!errorMessage && <Message severity="error" message={errorMessage} />}
    </div>
  );
};

export default AdministratoriPage;
