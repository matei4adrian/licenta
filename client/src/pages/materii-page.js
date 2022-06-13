import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import "./pages.scss";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip, Typography } from "@mui/material";
import { Context } from "../components/contexts/user-context";
import CustomGrid from "../components/custom-grid";
import BasicModalWithoutButtons from "../components/basic-modal/basic-modal-without-buttons";
import MateriiForm from "../components/forms/materii-form";
import { BACKEND_URL } from "../config";
import Message from "../components/message/message";
import ActiuniColumn from "../components/actiuni-column";

const MateriiPage = () => {
  let navigate = useNavigate();
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
      field: "an",
      headerName: "Anul",
      description: "Anul corespunzator materiei",
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
      description: "Semestrul corespunzator materiei",
      ...(!isMobile && { flex: 1 }),
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
            updateTitle="Actualizeaza materie"
            deleteTitle="Sterge materie"
            deleteContent="Esti sigur ca vrei sa stergi aceasta materie?"
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
      <Typography variant="h3">Materii</Typography>
      <div className="pages-buttons">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddMaterieModal}
        >
          Adauga materie
        </Button>
      </div>
      <CustomGrid columns={columns} rows={materii} loading={loading} />
      <BasicModalWithoutButtons
        open={openAddMaterieModal}
        onClose={handleCloseAddMaterieModal}
        title="Adauga materie"
        subTitle="Completati campurile"
        content={
          <MateriiForm
            onSubmit={handleAddMaterie}
            onClose={handleCloseAddMaterieModal}
            submitText="Adauga"
          />
        }
      />
      {!!errorMessage && <Message severity="error" message={errorMessage} />}
    </div>
  );
};

export default MateriiPage;