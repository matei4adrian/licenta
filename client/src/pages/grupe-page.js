import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./pages.scss";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { Context } from "../components/contexts/user-context";
import CustomGrid from "../components/custom-grid";
import BasicModalWithoutButtons from "../components/basic-modal/basic-modal-without-buttons";
import { BACKEND_URL } from "../config";
import Message from "../components/message/message";
import ActiuniColumn from "../components/actiuni-column";
import GrupeForm from "../components/forms/grupe-form";
import Header from "../components/administrare-child-page/header";

const GrupePage = () => {
  const navigate = useNavigate();
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [grupe, setGrupe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddGrupaModal, setOpenAddGrupaModal] = useState(false);
  const [openUpdateGrupaModal, setOpenUpdateGrupaModal] = useState(false);
  const [openDeleteGrupaModal, setOpenDeleteGrupaModal] = useState(false);
  const [grupaToBeEdited, setGrupaToBeEdited] = useState({});
  const [grupaToBeDeleted, setGrupaToBeDeleted] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const columns = [
    {
      field: "numar",
      headerName: "Numar",
      description: "Numarul grupei",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "seria",
      headerName: "Seria",
      description: "Seria grupei",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "actiuni",
      headerName: "Actiuni",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <ActiuniColumn
            params={params}
            getItems={getGrupe}
            openUpdateModal={openUpdateGrupaModal}
            openDeleteModal={openDeleteGrupaModal}
            setOpenUpdateModal={setOpenUpdateGrupaModal}
            setOpenDeleteModal={setOpenDeleteGrupaModal}
            toBeEdited={grupaToBeEdited}
            setToBeEdited={setGrupaToBeEdited}
            setToBeDeleted={setGrupaToBeDeleted}
            editUrl={`${BACKEND_URL}/api/grupe/${grupaToBeEdited.id}`}
            deleteUrl={`${BACKEND_URL}/api/grupe/${grupaToBeDeleted.id}`}
            updateTitle="Actualizeaza grupa"
            deleteTitle="Sterge grupa"
            deleteContent="Esti sigur ca vrei sa stergi aceasta grupa?"
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            Form={GrupeForm}
          />
        );
      },
    },
  ];

  const handleOpenAddGrupaModal = () => {
    setOpenAddGrupaModal(true);
  };

  const handleCloseAddGrupaModal = () => {
    setOpenAddGrupaModal(false);
  };

  const handleAddGrupa = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    await axios
      .post(
        BACKEND_URL + `/api/grupe/serii/${values.serieId}`,
        { numar: values.numar },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        handleCloseAddGrupaModal();
        getGrupe();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  const getGrupe = async () => {
    await axios
      .get(BACKEND_URL + "/api/grupe/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setGrupe(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("../administrare");
    }
    getGrupe();
  }, [isLoggedIn, navigate]);

  return (
    <div className="pages-layout">
      <Header
        pageTitleText="Grupe"
        addButtonText="Adauga grupa"
        handleOpenAddModal={handleOpenAddGrupaModal}
      />
      <CustomGrid
        columns={columns}
        rows={grupe.map((grupa) => {
          return {
            ...grupa,
            seria: `${grupa.serie.litera} - ${grupa.serie.limba}, ${grupa.serie.facultate.denumire}`,
          };
        })}
        loading={loading}
      />
      <BasicModalWithoutButtons
        open={openAddGrupaModal}
        onClose={handleCloseAddGrupaModal}
        title="Adauga grupa"
        subTitle="Completati campurile"
        content={
          <GrupeForm
            onSubmit={handleAddGrupa}
            onClose={handleCloseAddGrupaModal}
            submitText="Adauga"
          />
        }
      />
      {!!errorMessage && <Message severity="error" message={errorMessage} />}
    </div>
  );
};

export default GrupePage;
