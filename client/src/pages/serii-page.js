import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
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
import SeriiForm from "../components/forms/serii-form";
import Header from "../components/administrare-child-page/header";

const SeriiPage = () => {
  const navigate = useNavigate();
  const user = useContext(Context);
  const isMobile = useMediaQuery({ query: `(max-width: 560px)` });
  const { isLoggedIn } = user;
  const [serii, setSerii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddSerieModal, setOpenAddSerieModal] = useState(false);
  const [openUpdateSerieModal, setOpenUpdateSerieModal] = useState(false);
  const [openDeleteSerieModal, setOpenDeleteSerieModal] = useState(false);
  const [serieToBeEdited, setSerieToBeEdited] = useState({});
  const [serieToBeDeleted, setSerieToBeDeleted] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const columns = [
    {
      field: "litera",
      headerName: "Litera",
      description: "Identificatorul seriei",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "facultate",
      headerName: "Facultatea",
      description: "Facultatea de care aparține seria",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "limba",
      headerName: "Limba",
      description: "Limba programului de licență a seriei",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "grupe",
      headerName: "Grupe",
      description: "Grupele care aparțin seriei",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "actiuni",
      headerName: "Acțiuni",
      sortable: false,
      filterable: false,
      ...(!isMobile ? { flex: 1 } : { width: 150 }),
      renderCell: (params) => {
        return (
          <ActiuniColumn
            params={params}
            getItems={getSerii}
            openUpdateModal={openUpdateSerieModal}
            openDeleteModal={openDeleteSerieModal}
            setOpenUpdateModal={setOpenUpdateSerieModal}
            setOpenDeleteModal={setOpenDeleteSerieModal}
            toBeEdited={serieToBeEdited}
            setToBeEdited={setSerieToBeEdited}
            setToBeDeleted={setSerieToBeDeleted}
            editUrl={`${BACKEND_URL}/api/serii/${serieToBeEdited.id}`}
            deleteUrl={`${BACKEND_URL}/api/serii/${serieToBeDeleted.id}`}
            updateTitle="Actualizează seria"
            deleteTitle="Șterge seria"
            deleteContent="Ești sigur că vrei să ștergi această serie? Grupele aferente acesteia vor fi șterse de asemenea."
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            Form={SeriiForm}
          />
        );
      },
    },
  ];

  const handleOpenAddSerieModal = () => {
    setOpenAddSerieModal(true);
  };

  const handleCloseAddSerieModal = () => {
    setOpenAddSerieModal(false);
  };

  const handleAddSerie = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    await axios
      .post(BACKEND_URL + "/api/serii/", values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseAddSerieModal();
        getSerii();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  const getSerii = async () => {
    await axios
      .get(BACKEND_URL + "/api/serii/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setSerii(res.data);
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
    getSerii();
  }, [isLoggedIn, navigate]);

  return (
    <div className="pages-layout">
      <Header
        pageTitleText="Serii"
        addButtonText="Adaugă serie"
        handleOpenAddModal={handleOpenAddSerieModal}
      />
      <CustomGrid
        columns={columns}
        rows={serii.map((serie) => {
          const grupeSerie = [];
          serie.grupas.forEach((grupa) => {
            grupeSerie.push(grupa.numar);
          });

          return {
            ...serie,
            facultate: serie.facultate.denumire,
            grupe: grupeSerie.length > 0 ? grupeSerie.join(", ") : "Fără grupe",
          };
        })}
        loading={loading}
      />
      <BasicModalWithoutButtons
        open={openAddSerieModal}
        onClose={handleCloseAddSerieModal}
        title="Adaugă serie"
        subTitle="Completați câmpurile"
        content={
          <SeriiForm
            onSubmit={handleAddSerie}
            onClose={handleCloseAddSerieModal}
            submitText="Adaugă"
          />
        }
      />
      {!!errorMessage && <Message severity="error" message={errorMessage} />}
    </div>
  );
};

export default SeriiPage;
