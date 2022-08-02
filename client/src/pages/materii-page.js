import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import "./pages.scss";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { Context } from "../components/contexts/user-context";
import CustomGrid from "../components/custom-grid";
import BasicModalWithoutButtons from "../components/basic-modal/basic-modal-without-buttons";
import MateriiForm from "../components/forms/materii-form";
import { BACKEND_URL } from "../config";
import Message from "../components/message/message";
import ActiuniColumn from "../components/actiuni-column";
import Header from "../components/administrare-child-page/header";

const MateriiPage = () => {
  const navigate = useNavigate();
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [materii, setMaterii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddMaterieModal, setOpenAddMaterieModal] = useState(false);
  const [openUpdateMaterieModal, setOpenUpdateMaterieModal] = useState(false);
  const [openDeleteMaterieModal, setOpenDeleteMaterieModal] = useState(false);
  const [materieToBeEdited, setMaterieToBeEdited] = useState({});
  const [materieToBeDeleted, setMaterieToBeDeleted] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const isMobile = useMediaQuery({ query: `(max-width: 560px)` });

  const columns = [
    {
      field: "denumire",
      headerName: "Denumire",
      description: "Denumirea materiei",
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
      field: "an",
      headerName: "Anul",
      description: "Anul corespunzător materiei",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "semestru",
      headerName: "Semestrul",
      description: "Semestrul corespunzător materiei",
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
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => {
        return (
          <ActiuniColumn
            params={params}
            getItems={getMaterii}
            openUpdateModal={openUpdateMaterieModal}
            openDeleteModal={openDeleteMaterieModal}
            setOpenUpdateModal={setOpenUpdateMaterieModal}
            setOpenDeleteModal={setOpenDeleteMaterieModal}
            toBeEdited={materieToBeEdited}
            setToBeEdited={setMaterieToBeEdited}
            setToBeDeleted={setMaterieToBeDeleted}
            editUrl={`${BACKEND_URL}/api/materii/${materieToBeEdited.id}`}
            deleteUrl={`${BACKEND_URL}/api/materii/${materieToBeDeleted.id}`}
            updateTitle="Actualizează materie"
            deleteTitle="Șterge materie"
            deleteContent="Ești sigur că vrei să ștergi această materie?"
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            Form={MateriiForm}
          />
        );
      },
    },
  ];

  const handleOpenAddMaterieModal = () => {
    setOpenAddMaterieModal(true);
  };

  const handleCloseAddMaterieModal = () => {
    setOpenAddMaterieModal(false);
  };

  const handleAddMaterie = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    await axios
      .post(BACKEND_URL + "/api/materii/", values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseAddMaterieModal();
        getMaterii();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  const getMaterii = async () => {
    await axios
      .get(BACKEND_URL + "/api/materii/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setMaterii(res.data);
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
    getMaterii();
  }, [isLoggedIn, navigate]);

  return (
    <div className="pages-layout">
      <Header
        pageTitleText="Materii"
        addButtonText="Adaugă materie"
        handleOpenAddModal={handleOpenAddMaterieModal}
      />
      <CustomGrid
        columns={columns}
        rows={materii.map((materie) => {
          return {
            ...materie,
            facultate: materie.facultate.denumire,
          };
        })}
        loading={loading}
      />
      <BasicModalWithoutButtons
        open={openAddMaterieModal}
        onClose={handleCloseAddMaterieModal}
        title="Adaugă materie"
        subTitle="Completați câmpurile"
        content={
          <MateriiForm
            onSubmit={handleAddMaterie}
            onClose={handleCloseAddMaterieModal}
            submitText="Adaugă"
          />
        }
      />
      {!!errorMessage && <Message severity="error" message={errorMessage} />}
    </div>
  );
};

export default MateriiPage;
