import React, { useContext, useState } from "react";
import "./voucher-card.scss";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Context } from "../../components/contexts/user-context";
import { BACKEND_URL } from "../../config";
import BasicModal from "../basic-modal/basic-modal";
import BasicModalWithoutButtons from "../basic-modal/basic-modal-without-buttons";
import VoucherForm from "../forms/voucher-form";

const VoucherCard = (props) => {
  const { voucher, getVouchers } = props;
  const { id, compania, fotografie, descriere, valoare } = voucher;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDetaliiModal, setOpenDetaliiModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const user = useContext(Context);

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleCloseDetaliiModal = () => {
    setOpenDetaliiModal(false);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleDelete = async () => {
    await axios
      .delete(BACKEND_URL + `/api/vouchers/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        handleCloseDeleteModal();
        getVouchers();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateVoucher = async (values) => {
    var formData = new FormData();
    formData.append("compania", values.compania);
    if (values.fotografie) {
      formData.append("fotografie", values.fotografie);
    }
    formData.append("descriere", values.descriere);
    formData.append("valoare", values.valoare);
    await axios
      .put(`${BACKEND_URL}/api/vouchers/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        handleCloseUpdateModal();
        getVouchers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card sx={{ width: 300 }} className="voucher-card-content">
      <CardMedia
        component="img"
        height="200"
        image={`${BACKEND_URL}/uploads/${fotografie}`}
        alt={compania}
      />
      <CardContent style={{ height: "200px" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          className="denumire-voucher"
        >
          {`${valoare}% ${compania}`}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ textAlign: "justify" }}
        >
          {descriere.length > 140
            ? `${descriere.substr(0, 140)}...`
            : descriere}
        </Typography>
      </CardContent>
      <CardActions className="voucher-card-button">
        <div>
          {user.isLoggedIn && (
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
          )}
        </div>
        {descriere.length > 140 && (
          <Button
            variant="outlined"
            endIcon={<NavigateNextIcon />}
            onClick={() => setOpenDetaliiModal(true)}
          >
            Vezi mai mult
          </Button>
        )}
      </CardActions>
      <BasicModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Șterge voucher"
        onSubmit={handleDelete}
        content={`Ești sigur că vrei să ștergi acest voucher?`}
      />
      <BasicModalWithoutButtons
        open={openDetaliiModal}
        onClose={handleCloseDetaliiModal}
        title={`${valoare}% ${compania}`}
        content={
          <div className="detalii-layout">
            {descriere}
            <div className="detalii-buttons">
              <Button variant="contained" onClick={handleCloseDetaliiModal}>
                Închide
              </Button>
            </div>
          </div>
        }
      />
      <BasicModalWithoutButtons
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        title="Actualizează voucher"
        content={
          <VoucherForm
            onSubmit={handleUpdateVoucher}
            onClose={handleCloseUpdateModal}
            voucher={voucher}
            submitText="Actualizează"
          />
        }
      />
    </Card>
  );
};

export default VoucherCard;
