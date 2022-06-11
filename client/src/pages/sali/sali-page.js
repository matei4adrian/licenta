import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./sali-page.scss";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip, Typography } from "@mui/material";
import { Context } from "../../components/contexts/user-context";
import CustomGrid from "../../components/custom-grid";
import BasicModalWithoutButtons from "../../components/basic-modal/basic-modal-without-buttons";
import { BACKEND_URL } from "../../config";
import Message from "../../components/message/message";
import BasicModal from "../../components/basic-modal/basic-modal";
import SaliForm from "../../components/forms/sali-form";

const SaliPage = () => {
  let navigate = useNavigate();
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
      description: "Numarul seriei",
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
        const handleCloseUpdateSalaModal = () => {
          setOpenUpdateSalaModal(false);
        };

        const handleOpenUpdateSalaModal = () => {
          setSalaToBeEdited(params.row);
          setOpenUpdateSalaModal(true);
        };

        const handleOpenDeleteSalaModal = () => {
          setSalaToBeDeleted(params.row);
          setOpenDeleteSalaModal(true);
        };

        const handleCloseDeleteSalaModal = () => {
          setOpenDeleteSalaModal(false);
        };

        const handleEditSala = async (values) => {
          await axios
            .put(
              `${BACKEND_URL}/api/sali/${salaToBeEdited.id}`,
              { ...values, id: salaToBeEdited.id },
              {
                withCredentials: true,
              }
            )
            .then(() => {
              handleCloseUpdateSalaModal();
              getSali();
            })
            .catch((err) => {
              console.log(err);
            });
        };

        const handleDeleteSala = async () => {
          await axios
            .delete(`${BACKEND_URL}/api/sali/${salaToBeDeleted.id}`, {
              withCredentials: true,
            })
            .then(() => {
              handleCloseDeleteSalaModal();
              getSali();
            })
            .catch((err) => {
              console.log(err);
            });
        };

        return (
          <div>
            <IconButton aria-label="edit" onClick={handleOpenUpdateSalaModal}>
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={handleOpenDeleteSalaModal}
            >
              <DeleteIcon />
            </IconButton>
            <BasicModalWithoutButtons
              open={openUpdateSalaModal}
              onClose={handleCloseUpdateSalaModal}
              title="Actualizeaza sala"
              content={
                <SaliForm
                  onSubmit={handleEditSala}
                  onClose={handleCloseUpdateSalaModal}
                  submitText="Actualizeaza"
                  sala={salaToBeEdited}
                />
              }
            />
            <BasicModal
              open={openDeleteSalaModal}
              onClose={handleCloseDeleteSalaModal}
              title="Sterge sala"
              onSubmit={handleDeleteSala}
              content={`Esti sigur ca vrei sa stergi aceasta sala?`}
            />
          </div>
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
    <div className="sali-page-layout">
      <Typography variant="h3">Sali</Typography>
      <div className="sali-page-buttons">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddSalaModal}
        >
          Adauga sala
        </Button>
      </div>
      <CustomGrid columns={columns} rows={sali} loading={loading} />
      <BasicModalWithoutButtons
        open={openAddSalaModal}
        onClose={handleCloseAddSalaModal}
        title="Adauga sala"
        subTitle="Completati campurile"
        content={
          <SaliForm
            onSubmit={handleAddSala}
            onClose={handleCloseAddSalaModal}
            submitText="Adauga"
          />
        }
      />
      {!!errorMessage && <Message severity="error" message={errorMessage} />}
    </div>
  );
};

export default SaliPage;
