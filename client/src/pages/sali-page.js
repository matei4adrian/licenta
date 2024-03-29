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
import SaliForm from "../components/forms/sali-form";
import ActiuniColumn from "../components/actiuni-column";
import Header from "../components/administrare-child-page/header";

const SaliPage = () => {
  const navigate = useNavigate();
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [sali, setSali] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddSalaModal, setOpenAddSalaModal] = useState(false);
  const [openUpdateSalaModal, setOpenUpdateSalaModal] = useState(false);
  const [openDeleteSalaModal, setOpenDeleteSalaModal] = useState(false);
  const [salaToBeEdited, setSalaToBeEdited] = useState({});
  const [salaToBeDeleted, setSalaToBeDeleted] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const columns = [
    {
      field: "numar",
      headerName: "Numar",
      description: "Numărul sălii",
      flex: 1,
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
      flex: 1,
      renderCell: (params) => {
        return (
          <ActiuniColumn
            params={params}
            getItems={getSali}
            openUpdateModal={openUpdateSalaModal}
            openDeleteModal={openDeleteSalaModal}
            setOpenUpdateModal={setOpenUpdateSalaModal}
            setOpenDeleteModal={setOpenDeleteSalaModal}
            toBeEdited={salaToBeEdited}
            setToBeEdited={setSalaToBeEdited}
            setToBeDeleted={setSalaToBeDeleted}
            editUrl={`${BACKEND_URL}/api/sali/${salaToBeEdited.id}`}
            deleteUrl={`${BACKEND_URL}/api/sali/${salaToBeDeleted.id}`}
            updateTitle="Actualizează sală"
            deleteTitle="Șterge sală"
            deleteContent="Ești sigur că vrei să ștergi această sală?"
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            Form={SaliForm}
          />
        );
      },
    },
  ];

  const handleOpenAddSalaModal = () => {
    setOpenAddSalaModal(true);
  };

  const handleCloseAddSalaModal = () => {
    setOpenAddSalaModal(false);
  };

  const handleAddSala = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    await axios
      .post(BACKEND_URL + "/api/sali/", values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseAddSalaModal();
        getSali();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  const getSali = async () => {
    await axios
      .get(BACKEND_URL + "/api/sali/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setSali(res.data);
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
    getSali();
  }, [isLoggedIn, navigate]);

  return (
    <div className="pages-layout">
      <Header
        pageTitleText="Săli"
        addButtonText="Adaugă sală"
        handleOpenAddModal={handleOpenAddSalaModal}
      />
      <CustomGrid columns={columns} rows={sali} loading={loading} />
      <BasicModalWithoutButtons
        open={openAddSalaModal}
        onClose={handleCloseAddSalaModal}
        title="Adaugă sală"
        subTitle="Completați câmpurile"
        content={
          <SaliForm
            onSubmit={handleAddSala}
            onClose={handleCloseAddSalaModal}
            submitText="Adaugă"
          />
        }
      />
      {!!errorMessage && <Message severity="error" message={errorMessage} />}
    </div>
  );
};

export default SaliPage;
