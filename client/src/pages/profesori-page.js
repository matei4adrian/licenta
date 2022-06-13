import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import "./pages.scss";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Context } from "../components/contexts/user-context";
import CustomGrid from "../components/custom-grid";
import BasicModalWithoutButtons from "../components/basic-modal/basic-modal-without-buttons";
import { BACKEND_URL } from "../config";
import Message from "../components/message/message";
import BasicModal from "../components/basic-modal/basic-modal";
import ProfesoriForm from "../components/forms/profesori-form";
import MaterieToProfesorForm from "../components/forms/materie-to-profesor-form";

const ProfesoriPage = () => {
  let navigate = useNavigate();
  const user = useContext(Context);
  const { isLoggedIn } = user;
  const [profesori, setProfesori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddProfesorModal, setOpenAddProfesorModal] = useState(false);
  const [openUpdateProfesorModal, setOpenUpdateProfesorModal] = useState(false);
  const [openDeleteProfesorModal, setOpenDeleteProfesorModal] = useState(false);
  const [profesorToBeEdited, setProfesorToBeEdited] = useState({});
  const [profesorToBeDeleted, setProfesorToBeDeleted] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [profesorToMaterieType, setProfesorToMaterieType] = useState("");
  const [openMaterieToProfesorModal, setOpenMaterieToProfesorModal] =
    useState(false);
  const [profesorToUpdateMaterie, setProfesorToUpdateMaterie] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  const isMobile = useMediaQuery({ query: `(max-width: 560px)` });
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      field: "nume",
      headerName: "Nume",
      description: "Numele profesorului",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "prenume",
      headerName: "Prenume",
      description: "Prenumele profesorului",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },

    {
      field: "email",
      headerName: "Email",
      description: "Emailul institutional al profesorului",
      ...(!isMobile && { flex: 1 }),
      renderCell: (params) => (
        <Tooltip title={params.value.toString()}>
          <span>{params.value.toString()}</span>
        </Tooltip>
      ),
    },
    {
      field: "materii",
      headerName: "Materii",
      description: "Materiile predate de catre profesor",
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
      ...(!isMobile ? { flex: 1 } : { width: 150 }),
      renderCell: (params) => {
        const handleCloseUpdateProfesorModal = () => {
          setOpenUpdateProfesorModal(false);
        };

        const handleOpenUpdateProfesorModal = () => {
          setProfesorToBeEdited(params.row);
          setOpenUpdateProfesorModal(true);
        };

        const handleOpenDeleteProfesorModal = () => {
          setProfesorToBeDeleted(params.row);
          setOpenDeleteProfesorModal(true);
        };

        const handleCloseDeleteProfesorModal = () => {
          setOpenDeleteProfesorModal(false);
        };

        const handleEditProfesor = async (values) => {
          if (errorMessage) {
            setErrorMessage("");
          }
          await axios
            .put(
              `${BACKEND_URL}/api/profesori/${profesorToBeEdited.id}`,
              values,
              {
                withCredentials: true,
              }
            )
            .then(() => {
              handleCloseUpdateProfesorModal();
              getProfesori();
            })
            .catch((err) => {
              console.log(err);
              setErrorMessage(err.response.data.message);
            });
        };

        const handleDeleteProfesor = async () => {
          await axios
            .delete(`${BACKEND_URL}/api/profesori/${profesorToBeDeleted.id}`, {
              withCredentials: true,
            })
            .then(() => {
              handleCloseDeleteProfesorModal();
              getProfesori();
            })
            .catch((err) => {
              console.log(err);
            });
        };

        const handleCloseMaterieToProfesorModal = () => {
          setOpenMaterieToProfesorModal(false);
        };

        const handleOpenAddMaterieToProfesor = () => {
          setProfesorToUpdateMaterie(selectedRow);
          setProfesorToMaterieType("add");
          setOpenMaterieToProfesorModal(true);
        };

        const handleOpenDeleteMaterieToProfesor = (e) => {
          setProfesorToUpdateMaterie(selectedRow);
          setProfesorToMaterieType("delete");
          setOpenMaterieToProfesorModal(true);
        };

        const handleMaterieToProfesor = async (values) => {
          if (errorMessage) {
            setErrorMessage("");
          }

          const { materie: materieId } = values;

          profesorToMaterieType === "delete"
            ? await axios
                .delete(
                  BACKEND_URL +
                    `/api/profesori/${profesorToUpdateMaterie.id}/materii/${materieId}`,
                  {
                    withCredentials: true,
                  }
                )
                .then(() => {
                  handleCloseMaterieToProfesorModal();
                  getProfesori();
                })
                .catch((err) => {
                  console.log(err);
                  setErrorMessage(err.response.data.message);
                })
            : await axios
                .post(
                  BACKEND_URL +
                    `/api/profesori/${profesorToUpdateMaterie.id}/materii/${materieId}`,
                  {
                    withCredentials: true,
                  }
                )
                .then(() => {
                  handleCloseMaterieToProfesorModal();
                  getProfesori();
                })
                .catch((err) => {
                  console.log(err);
                  setErrorMessage(err.response.data.message);
                });
        };

        return (
          <div>
            <IconButton
              aria-label="edit"
              onClick={handleOpenUpdateProfesorModal}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={handleOpenDeleteProfesorModal}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={(event) => {
                handleClickMenu(event, params.row);
              }}
              aria-controls={openMenu ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleCloseMenu}
              onClick={handleCloseMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenAddMaterieToProfesor}>
                <ListItemIcon>
                  <AddIcon fontSize="small" />
                </ListItemIcon>
                Adauga materie
              </MenuItem>
              <MenuItem onClick={handleOpenDeleteMaterieToProfesor}>
                <ListItemIcon>
                  <RemoveIcon fontSize="small" />
                </ListItemIcon>
                Sterge materie
              </MenuItem>
            </Menu>
            <BasicModalWithoutButtons
              open={openMaterieToProfesorModal}
              onClose={handleCloseMaterieToProfesorModal}
              title={`${
                profesorToMaterieType === "delete" ? "Sterge" : "Adauga"
              } materia profesorului`}
              content={
                <MaterieToProfesorForm
                  onSubmit={handleMaterieToProfesor}
                  onClose={handleCloseMaterieToProfesorModal}
                  submitText={
                    profesorToMaterieType === "delete" ? "Sterge" : "Adauga"
                  }
                  profesor={profesorToUpdateMaterie}
                  profesorToMaterieType={profesorToMaterieType}
                />
              }
            />
            <BasicModalWithoutButtons
              open={openUpdateProfesorModal}
              onClose={handleCloseUpdateProfesorModal}
              title="Actualizeaza profesor"
              content={
                <ProfesoriForm
                  onSubmit={handleEditProfesor}
                  onClose={handleCloseUpdateProfesorModal}
                  submitText="Actualizeaza"
                  profesor={profesorToBeEdited}
                />
              }
            />
            <BasicModal
              open={openDeleteProfesorModal}
              onClose={handleCloseDeleteProfesorModal}
              title="Sterge profesor"
              onSubmit={handleDeleteProfesor}
              content={`Esti sigur ca vrei sa stergi acest profesor?`}
            />
          </div>
        );
      },
    },
  ];

  const handleOpenAddProfesorModal = () => {
    setOpenAddProfesorModal(true);
  };

  const handleCloseAddProfesorModal = () => {
    setOpenAddProfesorModal(false);
  };

  const handleAddProfesor = async (values) => {
    if (errorMessage) {
      setErrorMessage("");
    }
    await axios
      .post(BACKEND_URL + "/api/profesori/", values, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseAddProfesorModal();
        getProfesori();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.message);
      });
  };

  const getProfesori = async () => {
    await axios
      .get(BACKEND_URL + "/api/profesori/", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setProfesori(res.data);
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
    getProfesori();
  }, [isLoggedIn, navigate]);

  return (
    <div className="pages-layout">
      <Typography variant="h3">Profesori</Typography>
      <div className="pages-buttons">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddProfesorModal}
        >
          Adauga profesor
        </Button>
      </div>
      <CustomGrid
        columns={columns}
        rows={profesori.map((profesor) => {
          const materiiProfesor = [];
          profesor.materies.forEach((materie) => {
            materiiProfesor.push(materie.denumire);
          });

          return { ...profesor, materii: materiiProfesor.join(", ") };
        })}
        loading={loading}
      />
      <BasicModalWithoutButtons
        open={openAddProfesorModal}
        onClose={handleCloseAddProfesorModal}
        title="Adauga profesor"
        subTitle="Completati campurile"
        content={
          <ProfesoriForm
            onSubmit={handleAddProfesor}
            onClose={handleCloseAddProfesorModal}
            submitText="Adauga"
          />
        }
      />
      {!!errorMessage && <Message severity="error" message={errorMessage} />}
    </div>
  );
};

export default ProfesoriPage;
