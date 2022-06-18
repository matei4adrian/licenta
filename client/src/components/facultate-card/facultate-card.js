import React, { useState } from "react";
import "./facultate-card.scss";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { BACKEND_URL } from "../../config";
import BasicModal from "../basic-modal/basic-modal";
import BasicModalWithoutButtons from "../basic-modal/basic-modal-without-buttons";
import FacultateForm from "../forms/facultate-form";

const FacultateCard = (props) => {
  const { facultate, getFacultati } = props;
  const { id, fotografie, denumire } = facultate;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleDelete = async () => {
    await axios
      .delete(BACKEND_URL + `/api/facultati/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseDeleteModal();
        getFacultati();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdate = async (values) => {
    var formData = new FormData();
    formData.append("denumire", values.denumire);
    if (values.fotografie) {
      formData.append("fotografie", values.fotografie);
    }
    await axios
      .put(`${BACKEND_URL}/api/facultati/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        handleCloseUpdateModal();
        getFacultati();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card sx={{ width: 300 }} className="facultate-card-content">
      <CardMedia
        component="img"
        height="200"
        image={`${BACKEND_URL}/uploads/${fotografie}`}
        alt={denumire}
      />
      <CardContent
        style={{
          height: "150px",
          textAlign: "center",
          padding: "4px 16px 16px",
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {denumire}
          </Typography>
        </CardContent>
      </CardContent>
      <CardActions className="facultate-card-button">
        <div>
          <div>
            <IconButton
              aria-label="edit"
              onClick={() => setOpenUpdateModal(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => setOpenDeleteModal(true)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </CardActions>
      <BasicModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Sterge facultate"
        onSubmit={handleDelete}
        content={`Esti sigur ca vrei sa stergi aceasta facultate?`}
      />
      <BasicModalWithoutButtons
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        title="Actualizeaza facultate"
        content={
          <FacultateForm
            onSubmit={handleUpdate}
            onClose={handleCloseUpdateModal}
            facultate={facultate}
            submitText="Actualizeaza"
          />
        }
      />
    </Card>
  );
};

export default FacultateCard;
